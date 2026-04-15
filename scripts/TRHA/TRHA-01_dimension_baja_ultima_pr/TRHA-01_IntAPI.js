import http from 'k6/http';
import { check, sleep } from 'k6';
import { getOptions, handleSummary as _handleSummary } from '../../../generalfunctions/k6functions.js';
import { intApiCases } from '../../../testdata/TRHA/TRHA-01_dimension_baja_ultima_pr.js';

export let options = getOptions();

const BASE_URL    = 'https://test--fps-integration-api.furyapps.io';
const TIGER_TOKEN = `${__ENV.TIGER_TOKEN}`;
const SCRIPT_NAME = 'TRHA-01_dimension_baja_ultima_pr_IntAPI';

export default function () {
  const tc = intApiCases[Math.floor(Math.random() * intApiCases.length)];

  const payload = JSON.stringify({
    process: 'global-smu-prod/headsup',
    smu_context_list: [
      { user: tc.user, context: tc.box ? { box: tc.box } : {} }
    ]
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'x-tiger-token': TIGER_TOKEN
    },
    tags: { name: `${SCRIPT_NAME}_${tc.id}` }
  };

  const response = http.post(`${BASE_URL}/fpsIntegrationSMU/bulk-execution`, payload, params);

  check(response, { 'status is 200': (r) => r.status === 200 });

  sleep(0.3);
}

export function handleSummary(data) {
  return _handleSummary(data, SCRIPT_NAME);
}
