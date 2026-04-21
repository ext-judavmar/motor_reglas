import { check } from 'k6';
import { Counter } from 'k6/metrics';

const errorCounter = new Counter('errors');

const isNumeric = (value) => /^\d+$/.test(value);

// Use this instead of check() in every script so failed requests
// are counted in the 'errors' measurement that Grafana dashboard queries.
export function checkResponse(response) {
  const passed = check(response, { 'status is 200': (r) => r.status === 200 });
  if (!passed) errorCounter.add(1);
  return passed;
}


// TEST_TYPE (smoke|load|stress) drives both stages and filename.
// TARGET_VUS sets the peak VU count (default 5).
export function getOptions(defaultVus = 5, tagNames = []) {
  const targetVusEnv = `${__ENV.TARGET_VUS}`;
  const targetVus    = isNumeric(targetVusEnv) ? Number(targetVusEnv) : defaultVus;
  const testType     = __ENV.TEST_TYPE || 'smoke';

  const stageProfiles = {
    smoke:  [
      { duration: '15s', target: targetVus },
      { duration: '20s', target: targetVus },
      { duration: '5s',  target: 0 }
    ],
    load:   [
      { duration: '1m',  target: targetVus },
      { duration: '5m',  target: targetVus },
      { duration: '30s', target: 0 }
    ],
    stress: [
      { duration: '2m',  target: targetVus },
      { duration: '10m', target: targetVus },
      { duration: '1m',  target: 0 }
    ],
  };

  const stages = stageProfiles[testType] || stageProfiles.smoke;

  const thresholds = {
    http_req_duration: ['p(95)<2000'],
    http_req_failed:   ['rate<0.01'],
  };
  for (const name of tagNames) {
    thresholds[`http_req_duration{name:${name}}`] = [];
    thresholds[`http_reqs{name:${name}}`]         = [];
    thresholds[`http_req_failed{name:${name}}`]   = [];
  }

  return {
    summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'],
    stages,
    thresholds,
  };
}

// Splits a stripped tag (e.g. "TR-3224_NO_prev_achiever") into { caseId, caseDesc }
function parseTag(stripped) {
  const sepIdx = stripped.indexOf('_');
  return {
    caseId:   sepIdx !== -1 ? stripped.slice(0, sepIdx)  : stripped,
    caseDesc: sepIdx !== -1 ? stripped.slice(sepIdx + 1) : '',
  };
}

function generateHtml(scriptName, timestamp, testType, vus, duration, rps, p95, p99, errorRate, checks, fails, caseEndpoints, getDisplayName) {
  const errorColor  = errorRate > 0 ? '#ef4444' : '#16a34a';
  const checksColor = fails    > 0 ? '#d97706' : '#16a34a';

  // Findings: flag endpoints whose p95 is > 1.5x the mean p95
  let findingsHtml = '';
  if (caseEndpoints.length > 0) {
    const meanP95  = caseEndpoints.reduce((s, ep) => s + ep.p95, 0) / caseEndpoints.length;
    const outliers = caseEndpoints.filter(ep => ep.p95 > meanP95 * 1.5);
    findingsHtml   = outliers.length > 0
      ? outliers.map(ep => {
          const { caseId } = parseTag(getDisplayName(ep.name));
          return `<div class="finding warn">&#9888; ${caseId}: p95=${ep.p95.toFixed(0)}ms is ${(ep.p95 / meanP95).toFixed(1)}x the mean p95 (${meanP95.toFixed(0)}ms)</div>`;
        }).join('')
      : '<div class="finding ok">&#10003; No latency outliers detected</div>';
  } else {
    findingsHtml = '<div class="finding ok">&#8212; IntAPI script — no per-case breakdown available</div>';
  }

  // CSS horizontal bar chart (no external dependencies)
  let chartSection = '';
  if (caseEndpoints.length > 0) {
    const maxVal = Math.max(...caseEndpoints.map(ep => Math.max(ep.avg, ep.p95, ep.p99 || 0))) * 1.1 || 1;

    const chartRows = caseEndpoints.map(ep => {
      const { caseId } = parseTag(getDisplayName(ep.name));
      const avgPct = (ep.avg         / maxVal * 100).toFixed(1);
      const p95Pct = (ep.p95         / maxVal * 100).toFixed(1);
      const p99Pct = ((ep.p99 || 0)  / maxVal * 100).toFixed(1);
      return `<div style="display:flex;align-items:flex-start;margin-bottom:10px;gap:10px">
        <div style="width:75px;color:#60a5fa;font-size:.75rem;font-weight:500;padding-top:2px;flex-shrink:0">${caseId}</div>
        <div style="flex:1">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px"><div style="flex:1;background:#0f172a;border-radius:3px;height:12px"><div style="width:${avgPct}%;height:100%;background:#3b82f6;border-radius:3px"></div></div><span style="font-size:.7rem;color:#94a3b8;width:50px">${ep.avg.toFixed(0)}ms</span></div>
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px"><div style="flex:1;background:#0f172a;border-radius:3px;height:12px"><div style="width:${p95Pct}%;height:100%;background:#8b5cf6;border-radius:3px"></div></div><span style="font-size:.7rem;color:#94a3b8;width:50px">${ep.p95.toFixed(0)}ms</span></div>
          <div style="display:flex;align-items:center;gap:6px"><div style="flex:1;background:#0f172a;border-radius:3px;height:12px"><div style="width:${p99Pct}%;height:100%;background:#f59e0b;border-radius:3px"></div></div><span style="font-size:.7rem;color:#94a3b8;width:50px">${(ep.p99 || 0).toFixed(0)}ms</span></div>
        </div>
      </div>`;
    }).join('\n      ');

    const tableRows = caseEndpoints.map(ep => {
      const { caseId, caseDesc } = parseTag(getDisplayName(ep.name));
      const errPct = (ep.errorRate * 100).toFixed(1);
      const errClr = ep.errorRate > 0 ? '#ef4444' : '#16a34a';
      return `<tr>
          <td>${caseId}</td><td>${caseDesc}</td>
          <td>${ep.reqs}</td><td>${ep.avg.toFixed(0)}</td>
          <td>${ep.p95.toFixed(0)}</td><td>${(ep.p99 || 0).toFixed(0)}</td>
          <td>${ep.rps.toFixed(2)}</td><td style="color:${errClr}">${errPct}%</td>
        </tr>`;
    }).join('\n        ');

    chartSection = `
  <div class="card">
    <div class="card-title">Response Time by Case</div>
    <div style="display:flex;gap:16px;margin-bottom:14px">
      <div style="display:flex;align-items:center;gap:6px;font-size:.72rem;color:#94a3b8"><div style="width:10px;height:10px;background:#3b82f6;border-radius:2px;flex-shrink:0"></div> Avg</div>
      <div style="display:flex;align-items:center;gap:6px;font-size:.72rem;color:#94a3b8"><div style="width:10px;height:10px;background:#8b5cf6;border-radius:2px;flex-shrink:0"></div> p95</div>
      <div style="display:flex;align-items:center;gap:6px;font-size:.72rem;color:#94a3b8"><div style="width:10px;height:10px;background:#f59e0b;border-radius:2px;flex-shrink:0"></div> p99</div>
    </div>
    ${chartRows}
  </div>

  <div class="card">
    <div class="card-title">Endpoint Breakdown</div>
    <table>
      <thead><tr>
        <th>Case</th><th>Description</th><th>Samples</th>
        <th>Avg (ms)</th><th>p95 (ms)</th><th>p99 (ms)</th><th>RPS</th><th>Err%</th>
      </tr></thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  </div>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>k6 Report — ${scriptName}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#0f172a;color:#f1f5f9;font-family:'Segoe UI',system-ui,sans-serif;padding:24px;max-width:1200px;margin:0 auto}
    h1{font-size:1.3rem;color:#60a5fa;margin-bottom:4px}
    .meta{color:#64748b;font-size:.8rem;margin-bottom:24px}
    .kpi-row{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:20px}
    .kpi{background:#1e293b;border-radius:8px;padding:14px 18px;flex:1;min-width:130px}
    .kpi-lbl{font-size:.7rem;color:#64748b;text-transform:uppercase;letter-spacing:.06em}
    .kpi-val{font-size:1.7rem;font-weight:700;margin:4px 0 2px}
    .kpi-unit{font-size:.95rem;font-weight:400;color:#94a3b8}
    .kpi-sub{font-size:.7rem;color:#475569}
    .card{background:#1e293b;border-radius:8px;padding:18px;margin-bottom:20px}
    .card-title{font-size:.7rem;color:#64748b;text-transform:uppercase;letter-spacing:.06em;margin-bottom:14px}
    .finding.warn{color:#f59e0b;font-size:.82rem;padding:3px 0}
    .finding.ok{color:#16a34a;font-size:.82rem}
    table{width:100%;border-collapse:collapse}
    th{color:#64748b;font-size:.7rem;text-transform:uppercase;padding:8px 10px;text-align:right;border-bottom:1px solid #334155}
    th:first-child,th:nth-child(2){text-align:left}
    td{padding:7px 10px;border-top:1px solid #0f172a;font-size:.82rem;text-align:right}
    td:first-child{text-align:left;color:#60a5fa;font-weight:500}
    td:nth-child(2){text-align:left;color:#94a3b8}
    tr:hover td{background:#263348}
  </style>
</head>
<body>
  <h1>${scriptName}</h1>
  <div class="meta">${timestamp} &nbsp;&#183;&nbsp; VUs: ${vus} &nbsp;&#183;&nbsp; ${testType.toUpperCase()}</div>

  <div class="kpi-row">
    <div class="kpi">
      <div class="kpi-lbl">Total Samples</div>
      <div class="kpi-val">${checks + fails}</div>
      <div class="kpi-sub">iterations executed</div>
    </div>
    <div class="kpi">
      <div class="kpi-lbl">Avg Response</div>
      <div class="kpi-val">${duration.toFixed(0)}<span class="kpi-unit"> ms</span></div>
      <div class="kpi-sub">mean latency</div>
    </div>
    <div class="kpi">
      <div class="kpi-lbl">p95 Response</div>
      <div class="kpi-val">${p95.toFixed(0)}<span class="kpi-unit"> ms</span></div>
      <div class="kpi-sub">95th percentile</div>
    </div>
    <div class="kpi">
      <div class="kpi-lbl">p99 Response</div>
      <div class="kpi-val">${p99.toFixed(0)}<span class="kpi-unit"> ms</span></div>
      <div class="kpi-sub">99th percentile</div>
    </div>
    <div class="kpi">
      <div class="kpi-lbl">RPS</div>
      <div class="kpi-val">${rps.toFixed(2)}</div>
      <div class="kpi-sub">requests / sec</div>
    </div>
    <div class="kpi">
      <div class="kpi-lbl">Error Rate</div>
      <div class="kpi-val" style="color:${errorColor}">${(errorRate * 100).toFixed(2)}<span class="kpi-unit">%</span></div>
      <div class="kpi-sub">SLA: &lt;1%</div>
    </div>
    <div class="kpi">
      <div class="kpi-lbl">Checks</div>
      <div class="kpi-val" style="color:${checksColor}">${checks}<span class="kpi-unit"> passed</span></div>
      <div class="kpi-sub">${fails} failed</div>
    </div>
  </div>

  <div class="card">
    <div class="card-title">Findings</div>
    ${findingsHtml}
  </div>

  ${chartSection}
</body>
</html>`;
}

export function logResponse(response, tc) {
  console.log(`[RESPONSE] ${tc.id} | ${tc.name} | status:${response.status} | body:${response.body}`);
}

// Call from each script's setup() — aborts the test before any VU starts
// if TIGER_TOKEN is missing or was not injected by the shell.
export function validateEnv() {
  const token = __ENV.TIGER_TOKEN;
  if (!token || token === 'undefined' || token.trim() === '') {
    throw new Error('TIGER_TOKEN is not set. Pass it with: -e "TIGER_TOKEN=Bearer <token>"');
  }
}

export function handleSummary(data, scriptName) {
  const timestamp = new Date().toISOString();
  const vus       = data.metrics.vus_max             ? data.metrics.vus_max.values.value              : 0;
  const duration  = data.metrics.iteration_duration  ? data.metrics.iteration_duration.values.avg      : 0;
  const rps       = data.metrics.http_reqs           ? data.metrics.http_reqs.values.rate              : 0;
  const p95       = data.metrics.http_req_duration   ? data.metrics.http_req_duration.values['p(95)']  : 0;
  const p99       = data.metrics.http_req_duration   ? data.metrics.http_req_duration.values['p(99)']  : 0;
  const errorRate = data.metrics.http_req_failed     ? data.metrics.http_req_failed.values.rate        : 0;
  const checks    = data.metrics.checks              ? data.metrics.checks.values.passes               : 0;
  const fails     = data.metrics.checks              ? data.metrics.checks.values.fails                : 0;

  const fileTimestamp = timestamp.replace('T', '_').replace(/:/g, '-').slice(0, 19);
  const testType      = __ENV.TEST_TYPE || 'smoke';

  // Collect per-endpoint metrics from tagged requests
  const endpoints = [];
  for (const [key, metric] of Object.entries(data.metrics)) {
    const match = key.match(/^http_req_duration\{name:(.+)\}$/);
    if (!match) continue;
    const name         = match[1];
    const reqsMetric   = data.metrics[`http_reqs{name:${name}}`];
    const failedMetric = data.metrics[`http_req_failed{name:${name}}`];
    endpoints.push({
      name,
      avg:       metric.values.avg           || 0,
      p95:       metric.values['p(95)']      || 0,
      p99:       metric.values['p(99)']      || 0,
      reqs:      reqsMetric   ? reqsMetric.values.count   : 0,
      rps:       reqsMetric   ? reqsMetric.values.rate    : 0,
      errorRate: failedMetric ? failedMetric.values.rate  : 0,
    });
  }
  endpoints.sort((a, b) => a.name.localeCompare(b.name));

  // Strip the scriptName prefix from tag names to display only the case ID + description
  const displayName = (name) => {
    const prefix = scriptName + '_';
    return name.startsWith(prefix) ? name.slice(prefix.length) : name;
  };

  // CSV — one OVERALL row + one row per tagged endpoint
  const csvHeader = 'timestamp,script,test_type,endpoint,vus,avg_duration_ms,rps,p95_ms,p99_ms,error_rate,requests\n';
  let csvRows = `${timestamp},${scriptName},${testType},OVERALL,${vus},${duration.toFixed(2)},${rps.toFixed(2)},${p95.toFixed(2)},${p99.toFixed(2)},${errorRate.toFixed(4)},${checks + fails}\n`;
  for (const ep of endpoints) {
    csvRows += `${timestamp},${scriptName},${testType},${displayName(ep.name)},,${ep.avg.toFixed(2)},${ep.rps.toFixed(2)},${ep.p95.toFixed(2)},${ep.p99.toFixed(2)},${ep.errorRate.toFixed(4)},${ep.reqs}\n`;
  }

  // Console: overall summary box
  let consoleReport = `
┌─────────────────────────────────────────────┐
│  Script   : ${scriptName.padEnd(30)} │
│  Timestamp: ${timestamp.padEnd(30)} │
│  Test Type: ${testType.padEnd(30)} │
├─────────────────────────────────────────────┤
│  VUs            : ${String(vus).padEnd(26)} │
│  Avg Duration   : ${(duration.toFixed(2) + ' ms').padEnd(26)} │
│  RPS            : ${rps.toFixed(2).padEnd(26)} │
│  p95            : ${(p95.toFixed(2) + ' ms').padEnd(26)} │
│  p99            : ${(p99.toFixed(2) + ' ms').padEnd(26)} │
│  Error Rate     : ${((errorRate * 100).toFixed(2) + '%').padEnd(26)} │
│  Checks Passed  : ${String(checks).padEnd(26)} │
│  Checks Failed  : ${String(fails).padEnd(26)} │
└─────────────────────────────────────────────┘
`;

  // Console: per-endpoint breakdown table
  const caseEndpoints = endpoints.filter(ep => ep.name !== scriptName);
  if (caseEndpoints.length > 0) {
    const border = '─'.repeat(86);
    consoleReport += '\nEndpoint Breakdown:\n';
    consoleReport += `┌${border}┐\n`;
    consoleReport += `│  ${'Case'.padEnd(9)} ${'Description'.padEnd(24)} ${'Samples'.padStart(7)} ${'Avg(ms)'.padStart(8)} ${'p95(ms)'.padStart(8)} ${'p99(ms)'.padStart(8)} ${'RPS'.padStart(6)} ${'Err%'.padStart(6)} │\n`;
    consoleReport += `├${border}┤\n`;
    for (const ep of caseEndpoints) {
      const { caseId, caseDesc } = parseTag(displayName(ep.name));
      const id      = caseId.padEnd(9);
      const desc    = caseDesc.padEnd(24);
      const samples = String(ep.reqs).padStart(7);
      const avg     = ep.avg.toFixed(0).padStart(8);
      const p95s    = ep.p95.toFixed(0).padStart(8);
      const p99s    = (ep.p99 || 0).toFixed(0).padStart(8);
      const rate    = ep.rps.toFixed(2).padStart(6);
      const err     = ((ep.errorRate * 100).toFixed(1) + '%').padStart(6);
      consoleReport += `│  ${id} ${desc} ${samples} ${avg} ${p95s} ${p99s} ${rate} ${err} │\n`;
    }
    consoleReport += `└${border}┘\n`;
  }

  const htmlReport = generateHtml(scriptName, timestamp, testType, vus, duration, rps, p95, p99, errorRate, checks, fails, caseEndpoints, displayName);

  return {
    [`/results/report_${scriptName}_${testType}_t_${fileTimestamp}.csv`]:  csvHeader + csvRows,
    [`/results/report_${scriptName}_${testType}_t_${fileTimestamp}.html`]: htmlReport,
    stdout: consoleReport
  };
}
