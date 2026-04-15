const isNumeric = (value) => /^\d+$/.test(value);

export function getOptions(defaultVus = 5) {
  const targetVusEnv = `${__ENV.TARGET_VUS}`;
  const targetVus = isNumeric(targetVusEnv) ? Number(targetVusEnv) : defaultVus;

  return {
    stages: [
      { duration: '15s', target: targetVus },
      { duration: '20s', target: targetVus },
      { duration: '5s',  target: 0 }
    ]
  };
}

export function handleSummary(data, scriptName) {
  const timestamp = new Date().toISOString();
  const vus       = data.metrics.vus_max             ? data.metrics.vus_max.values.value                  : 0;
  const duration  = data.metrics.iteration_duration  ? data.metrics.iteration_duration.values.avg         : 0;
  const rps       = data.metrics.http_reqs           ? data.metrics.http_reqs.values.rate                 : 0;
  const p95       = data.metrics.http_req_duration   ? data.metrics.http_req_duration.values['p(95)']     : 0;
  const errorRate = data.metrics.http_req_failed     ? data.metrics.http_req_failed.values.rate           : 0;
  const checks    = data.metrics.checks              ? data.metrics.checks.values.passes                  : 0;
  const fails     = data.metrics.checks              ? data.metrics.checks.values.fails                   : 0;

  const fileTimestamp = timestamp.replace('T', '_').replace(/:/g, '-').slice(0, 19);

  const header = 'timestamp,script,vus,avg_duration_ms,rps,p95_ms,error_rate,checks_passed,checks_failed\n';
  const row    = `${timestamp},${scriptName},${vus},${duration.toFixed(2)},${rps.toFixed(2)},${p95.toFixed(2)},${errorRate.toFixed(4)},${checks},${fails}\n`;

  const consoleReport = `
┌─────────────────────────────────────────────┐
│  Script   : ${scriptName.padEnd(30)} │
│  Timestamp: ${timestamp.padEnd(30)} │
├─────────────────────────────────────────────┤
│  VUs            : ${String(vus).padEnd(26)} │
│  Avg Duration   : ${(duration.toFixed(2) + ' ms').padEnd(26)} │
│  RPS            : ${rps.toFixed(2).padEnd(26)} │
│  p95            : ${(p95.toFixed(2) + ' ms').padEnd(26)} │
│  Error Rate     : ${((errorRate * 100).toFixed(2) + '%').padEnd(26)} │
│  Checks Passed  : ${String(checks).padEnd(26)} │
│  Checks Failed  : ${String(fails).padEnd(26)} │
└─────────────────────────────────────────────┘
`;

  return {
    [`/results/report_${fileTimestamp}.csv`]: header + row,
    stdout: consoleReport
  };
}
