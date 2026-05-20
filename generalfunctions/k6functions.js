import { check } from 'k6';
import { Counter } from 'k6/metrics';
import { open as fsOpen } from 'k6/experimental/fs';

const errorCounter = new Counter('errors');
const errorsByStatus = new Counter('errors_by_status');

// Common error status codes broken down in the summary report.
const TRACKED_ERROR_STATUSES = ['0', '400', '401', '403', '404', '408', '429', '500', '502', '503', '504'];

const isNumeric = (value) => /^\d+$/.test(value);

// Use this instead of check() in every script so failed requests
// are counted in the 'errors' measurement that Grafana dashboard queries.
export function checkResponse(response) {
  const passed = check(response, { 'status is 200': (r) => r.status === 200 });
  if (!passed) {
    errorCounter.add(1);
    errorsByStatus.add(1, { status: String(response.status) });
    console.error(`[FAIL] status=${response.status}`);
  }
  return passed;
}


// Set VERBOSE_LOG=false to silence per-request logs (recommended for load/stress tests).
// Default: enabled — useful for smoke runs and debugging.
const verboseLog = (__ENV.VERBOSE_LOG || 'true').toLowerCase() !== 'false';

export function logRequest(url, payload) {
  if (!verboseLog) return;
  console.log(`[REQUEST] ${url}`);
  console.log(`[PAYLOAD] ${JSON.stringify(payload)}`);
}

export function logResponse(response) {
  if (!verboseLog) return;
  console.log(`[STATUS]  ${response.status}`);
  console.log(`[BODY]    ${response.body}`);
}


// TEST_TYPE (smoke|load|stress) drives both stages and filename.
// TARGET_VUS sets the peak VU count (default 5).
// DURATION (optional) overrides the steady-state duration of the chosen profile (e.g. '2m', '90s').
export function getOptions(defaultVus = 5, tagNames = []) {
  const targetVusEnv  = `${__ENV.TARGET_VUS}`;
  const targetVus     = isNumeric(targetVusEnv) ? Number(targetVusEnv) : defaultVus;
  const testType      = __ENV.TEST_TYPE || 'smoke';
  const customDuration = __ENV.DURATION;

  const stageProfiles = {
    smoke:  [
      { duration: '15s', target: targetVus },
      { duration: customDuration || '20s', target: targetVus },
      { duration: '5s',  target: 0 }
    ],
    load:   [
      { duration: '1m',  target: targetVus },
      { duration: customDuration || '5m', target: targetVus },
      { duration: '30s', target: 0 }
    ],
    stress: [
      { duration: '2m',  target: targetVus },
      { duration: customDuration || '10m', target: targetVus },
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
  for (const status of TRACKED_ERROR_STATUSES) {
    thresholds[`errors_by_status{status:${status}}`] = [];
  }

  return {
    summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'],
    stages,
    thresholds,
  };
}

// ms when < 1s, seconds (2 decimals) when >= 1s
function fmtTime(ms) {
  const v = Number(ms) || 0;
  return v < 1000 ? `${v.toFixed(0)}ms` : `${(v / 1000).toFixed(2)}s`;
}

// Splits a stripped tag (e.g. "TR-3224_NO_prev_achiever") into { caseId, caseDesc }
function parseTag(stripped) {
  const sepIdx = stripped.indexOf('_');
  return {
    caseId:   sepIdx !== -1 ? stripped.slice(0, sepIdx)  : stripped,
    caseDesc: sepIdx !== -1 ? stripped.slice(sepIdx + 1) : '',
  };
}

function generateHtml(scriptName, timestamp, testType, vus, duration, rps, p95, p99, errorRate, checks, fails, caseEndpoints, getDisplayName, errorsByStatus = []) {
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
          return `<div class="finding warn">&#9888; ${caseId}: p95=${fmtTime(ep.p95)} is ${(ep.p95 / meanP95).toFixed(1)}x the mean p95 (${fmtTime(meanP95)})</div>`;
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
      const { caseId, caseDesc } = parseTag(getDisplayName(ep.name));
      const trMatch = caseDesc.match(/^(TR-\d+)/);
      const trId    = trMatch ? trMatch[1] : '';
      const avgPct = (ep.avg         / maxVal * 100).toFixed(1);
      const p95Pct = (ep.p95         / maxVal * 100).toFixed(1);
      const p99Pct = ((ep.p99 || 0)  / maxVal * 100).toFixed(1);
      return `<div class="chart-row" data-case="${caseId}" data-samples="${ep.reqs}" data-avg="${ep.avg}" data-p95="${ep.p95}" data-p99="${ep.p99 || 0}" data-rps="${ep.rps}" data-err="${ep.errorRate}" style="display:flex;align-items:flex-start;margin-bottom:10px;gap:10px">
        <div style="width:110px;color:#60a5fa;font-size:.75rem;font-weight:500;padding-top:2px;flex-shrink:0">${caseId}${trId ? `<div style="font-size:.65rem;color:#475569;font-weight:400">${trId}</div>` : ''}</div>
        <div style="flex:1">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px"><div style="flex:1;background:#0f172a;border-radius:3px;height:12px"><div style="width:${avgPct}%;height:100%;background:#3b82f6;border-radius:3px"></div></div><span style="font-size:.7rem;color:#94a3b8;width:60px">${fmtTime(ep.avg)}</span></div>
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px"><div style="flex:1;background:#0f172a;border-radius:3px;height:12px"><div style="width:${p95Pct}%;height:100%;background:#8b5cf6;border-radius:3px"></div></div><span style="font-size:.7rem;color:#94a3b8;width:60px">${fmtTime(ep.p95)}</span></div>
          <div style="display:flex;align-items:center;gap:6px"><div style="flex:1;background:#0f172a;border-radius:3px;height:12px"><div style="width:${p99Pct}%;height:100%;background:#f59e0b;border-radius:3px"></div></div><span style="font-size:.7rem;color:#94a3b8;width:60px">${fmtTime(ep.p99 || 0)}</span></div>
        </div>
      </div>`;
    }).join('\n      ');

    const tableRows = caseEndpoints.map(ep => {
      const { caseId, caseDesc } = parseTag(getDisplayName(ep.name));
      const errPct = (ep.errorRate * 100).toFixed(1);
      const errClr = ep.errorRate > 0 ? '#ef4444' : '#16a34a';
      return `<tr data-case="${caseId}" data-samples="${ep.reqs}" data-avg="${ep.avg}" data-p95="${ep.p95}" data-p99="${ep.p99 || 0}" data-rps="${ep.rps}" data-err="${ep.errorRate}">
          <td>${caseId}</td><td>${caseDesc}</td>
          <td>${ep.reqs}</td><td>${fmtTime(ep.avg)}</td>
          <td>${fmtTime(ep.p95)}</td><td>${fmtTime(ep.p99 || 0)}</td>
          <td>${ep.rps.toFixed(2)}</td><td style="color:${errClr}">${errPct}%</td>
        </tr>`;
    }).join('\n        ');

    chartSection = `
  <div class="card">
    <div class="card-title">Response Time by Case <span style="font-size:.68rem;color:#475569;text-transform:none;letter-spacing:0">&middot; click table headers below to re-sort</span></div>
    <div style="display:flex;gap:16px;margin-bottom:14px">
      <div style="display:flex;align-items:center;gap:6px;font-size:.72rem;color:#94a3b8"><div style="width:10px;height:10px;background:#3b82f6;border-radius:2px;flex-shrink:0"></div> Avg</div>
      <div style="display:flex;align-items:center;gap:6px;font-size:.72rem;color:#94a3b8"><div style="width:10px;height:10px;background:#8b5cf6;border-radius:2px;flex-shrink:0"></div> p95</div>
      <div style="display:flex;align-items:center;gap:6px;font-size:.72rem;color:#94a3b8"><div style="width:10px;height:10px;background:#f59e0b;border-radius:2px;flex-shrink:0"></div> p99</div>
    </div>
    <div id="chart-rows">
      ${chartRows}
    </div>
  </div>

  <div class="card">
    <div class="card-title">Endpoint Breakdown</div>
    <table>
      <thead><tr>
        <th class="sortable" data-sort="case">Case</th><th>Description</th><th class="sortable" data-sort="samples">Samples</th>
        <th class="sortable" data-sort="avg">Avg</th><th class="sortable" data-sort="p95">p95</th><th class="sortable" data-sort="p99">p99</th><th class="sortable" data-sort="rps">RPS</th><th class="sortable" data-sort="err">Err%</th>
      </tr></thead>
      <tbody id="breakdown-tbody">
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
    th.sortable{cursor:pointer;user-select:none}
    th.sortable:hover{color:#94a3b8}
    th.sortable[data-dir="asc"]::after{content:" ↑";color:#60a5fa}
    th.sortable[data-dir="desc"]::after{content:" ↓";color:#60a5fa}
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
      <div class="kpi-val">${fmtTime(duration)}</div>
      <div class="kpi-sub">mean latency</div>
    </div>
    <div class="kpi">
      <div class="kpi-lbl">p95 Response</div>
      <div class="kpi-val">${fmtTime(p95)}</div>
      <div class="kpi-sub">95th percentile</div>
    </div>
    <div class="kpi">
      <div class="kpi-lbl">p99 Response</div>
      <div class="kpi-val">${fmtTime(p99)}</div>
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

  ${errorsByStatus.length > 0 ? `
  <div class="card">
    <div class="card-title">Errors by Status Code</div>
    <table>
      <thead><tr><th style="text-align:left">Status</th><th>Count</th><th>Description</th></tr></thead>
      <tbody>
        ${errorsByStatus.map(e => {
          const desc = ({
            '0':   'Timeout / network failure',
            '400': 'Bad Request',
            '401': 'Unauthorized (token expired or invalid)',
            '403': 'Forbidden',
            '404': 'Not Found',
            '408': 'Request Timeout',
            '429': 'Too Many Requests',
            '500': 'Internal Server Error',
            '502': 'Bad Gateway',
            '503': 'Service Unavailable',
            '504': 'Gateway Timeout',
          })[e.status] || 'Other';
          return `<tr><td style="color:#ef4444;font-weight:600">${e.status}</td><td>${e.count}</td><td style="text-align:left;color:#94a3b8">${desc}</td></tr>`;
        }).join('\n        ')}
      </tbody>
    </table>
  </div>
  ` : ''}

  ${chartSection}
  <script>
    (function () {
      var state = { key: 'avg', dir: 'desc' };
      var tbody = document.getElementById('breakdown-tbody');
      var chart = document.getElementById('chart-rows');
      function applySort() {
        var sign = state.dir === 'desc' ? -1 : 1;
        function cmp(a, b) {
          var av = a.getAttribute('data-' + state.key);
          var bv = b.getAttribute('data-' + state.key);
          if (state.key === 'case') return sign * av.localeCompare(bv);
          return sign * (parseFloat(av) - parseFloat(bv));
        }
        if (tbody) Array.prototype.slice.call(tbody.children).sort(cmp).forEach(function (n) { tbody.appendChild(n); });
        if (chart) Array.prototype.slice.call(chart.children).sort(cmp).forEach(function (n) { chart.appendChild(n); });
        document.querySelectorAll('th.sortable').forEach(function (th) {
          th.setAttribute('data-dir', th.getAttribute('data-sort') === state.key ? state.dir : '');
        });
      }
      document.querySelectorAll('th.sortable').forEach(function (th) {
        th.addEventListener('click', function () {
          var k = th.getAttribute('data-sort');
          if (state.key === k) state.dir = state.dir === 'desc' ? 'asc' : 'desc';
          else { state.key = k; state.dir = (k === 'case') ? 'asc' : 'desc'; }
          applySort();
        });
      });
      applySort();
    })();
  </script>
</body>
</html>`;
}


// Builds options for multi-scenario scripts (each scenario runs a named exported function concurrently).
// scenarioFuncs: array of exported function name strings, e.g. ['execution', 'intapi']
export function getScenariosOptions(defaultVus = 5, scenarioFuncs = [], tagNames = []) {
  const targetVusEnv   = `${__ENV.TARGET_VUS}`;
  const targetVus      = isNumeric(targetVusEnv) ? Number(targetVusEnv) : defaultVus;
  const testType       = __ENV.TEST_TYPE || 'smoke';
  const customDuration = __ENV.DURATION;

  const stageProfiles = {
    smoke:  [
      { duration: '15s', target: targetVus },
      { duration: customDuration || '20s', target: targetVus },
      { duration: '5s',  target: 0 }
    ],
    load:   [
      { duration: '1m',  target: targetVus },
      { duration: customDuration || '5m', target: targetVus },
      { duration: '30s', target: 0 }
    ],
    stress: [
      { duration: '2m',  target: targetVus },
      { duration: customDuration || '10m', target: targetVus },
      { duration: '1m',  target: 0 }
    ],
  };

  const stages = stageProfiles[testType] || stageProfiles.smoke;

  const scenarios = {};
  for (const funcName of scenarioFuncs) {
    scenarios[funcName] = { executor: 'ramping-vus', stages, exec: funcName };
  }

  const thresholds = {
    http_req_duration: ['p(95)<2000'],
    http_req_failed:   ['rate<0.01'],
  };
  for (const name of tagNames) {
    thresholds[`http_req_duration{name:${name}}`] = [];
    thresholds[`http_reqs{name:${name}}`]         = [];
    thresholds[`http_req_failed{name:${name}}`]   = [];
  }
  for (const status of TRACKED_ERROR_STATUSES) {
    thresholds[`errors_by_status{status:${status}}`] = [];
  }

  return {
    summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'],
    scenarios,
    thresholds,
  };
}

// Reads the raw per-sample CSV that k6's CSV output writes during the test
// (configured via K6_OUT=...,csv=/results/raw_metrics.csv in docker-compose).
// Returns the file contents as a string, or null if the file is missing/unreadable.
async function readRawCsv(path) {
  try {
    const file = await fsOpen(path);
    const info = await file.stat();
    if (!info || info.size === 0) return null;
    const buf = new Uint8Array(info.size);
    let read = 0;
    while (read < info.size) {
      const n = await file.read(buf.subarray(read));
      if (n === null) break;
      read += n;
    }
    return new TextDecoder().decode(buf);
  } catch (e) {
    return null;
  }
}

// Call from each script's setup() — aborts the test before any VU starts
// if TIGER_TOKEN is missing or was not injected by the shell.
export function validateEnv() {
  const token = __ENV.TIGER_TOKEN;
  if (!token || token === 'undefined' || token.trim() === '') {
    throw new Error('TIGER_TOKEN is not set. Pass it with: -e "TIGER_TOKEN=Bearer <token>"');
  }
}

export async function handleSummary(data, scriptName) {
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
  const testType      = __ENV.TEST_TYPE    || 'smoke';
  const resultsDir    = __ENV.RESULTS_PATH || 'results';

  // Test-run duration (total elapsed time), formatted as Nsec for <60s and Nmin for >=60s.
  const runDurationMs    = (data.state && data.state.testRunDurationMs) || 0;
  const runDurationLabel = runDurationMs < 60000
    ? `${Math.round(runDurationMs / 1000)}sec`
    : `${Math.round(runDurationMs / 60000)}min`;

  // Filename prefix used for both summary outputs (CSV/HTML) and the timestamped raw CSV copy.
  // Example: TRHA_scenario_smoke_10VU_10min_t_2026-05-19_15-02-15
  const filePrefix = `${scriptName}_${testType}_${vus}VU_${runDurationLabel}_t_${fileTimestamp}`;

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
  endpoints.sort((a, b) => b.avg - a.avg);

  // Collect error counts by HTTP status code (from tagged 'errors_by_status' counter)
  const errorsByStatus = [];
  for (const [key, metric] of Object.entries(data.metrics)) {
    const m = key.match(/^errors_by_status\{status:(.+)\}$/);
    if (!m) continue;
    const count = metric.values.count || 0;
    if (count > 0) errorsByStatus.push({ status: m[1], count });
  }
  errorsByStatus.sort((a, b) => b.count - a.count);

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
│  Avg Duration   : ${fmtTime(duration).padEnd(26)} │
│  RPS            : ${rps.toFixed(2).padEnd(26)} │
│  p95            : ${fmtTime(p95).padEnd(26)} │
│  p99            : ${fmtTime(p99).padEnd(26)} │
│  Error Rate     : ${((errorRate * 100).toFixed(2) + '%').padEnd(26)} │
│  Checks Passed  : ${String(checks).padEnd(26)} │
│  Checks Failed  : ${String(fails).padEnd(26)} │
└─────────────────────────────────────────────┘
`;

  // Console: errors by status code
  if (errorsByStatus.length > 0) {
    consoleReport += '\nErrors by Status Code:\n';
    for (const e of errorsByStatus) {
      const label = e.status === '0' ? '0 (timeout/network)' : e.status;
      consoleReport += `  - status ${label}: ${e.count}\n`;
    }
  }

  // Console: per-endpoint breakdown table
  const caseEndpoints = endpoints.filter(ep => ep.name !== scriptName);
  if (caseEndpoints.length > 0) {
    const border = '─'.repeat(86);
    consoleReport += '\nEndpoint Breakdown:\n';
    consoleReport += `┌${border}┐\n`;
    consoleReport += `│  ${'Case'.padEnd(9)} ${'Description'.padEnd(24)} ${'Samples'.padStart(7)} ${'Avg'.padStart(8)} ${'p95'.padStart(8)} ${'p99'.padStart(8)} ${'RPS'.padStart(6)} ${'Err%'.padStart(6)} │\n`;
    consoleReport += `├${border}┤\n`;
    for (const ep of caseEndpoints) {
      const { caseId, caseDesc } = parseTag(displayName(ep.name));
      const id      = caseId.padEnd(9);
      const desc    = caseDesc.padEnd(24);
      const samples = String(ep.reqs).padStart(7);
      const avg     = fmtTime(ep.avg).padStart(8);
      const p95s    = fmtTime(ep.p95).padStart(8);
      const p99s    = fmtTime(ep.p99 || 0).padStart(8);
      const rate    = ep.rps.toFixed(2).padStart(6);
      const err     = ((ep.errorRate * 100).toFixed(1) + '%').padStart(6);
      consoleReport += `│  ${id} ${desc} ${samples} ${avg} ${p95s} ${p99s} ${rate} ${err} │\n`;
    }
    consoleReport += `└${border}┘\n`;
  }

  const htmlReport = generateHtml(scriptName, timestamp, testType, vus, duration, rps, p95, p99, errorRate, checks, fails, caseEndpoints, displayName, errorsByStatus);

  const outputs = {
    [`${resultsDir}/${filePrefix}.csv`]:  csvHeader + csvRows,
    [`${resultsDir}/${filePrefix}.html`]: htmlReport,
    stdout: consoleReport
  };

  // Copy the raw per-sample CSV (written live by k6's CSV output) under a
  // timestamped name so each run keeps its own history alongside the rolling latest.
  const rawCsv = await readRawCsv(`${resultsDir}/raw_metrics.csv`);
  if (rawCsv) {
    outputs[`${resultsDir}/raw_${filePrefix}.csv`] = rawCsv;
  }

  return outputs;
}
