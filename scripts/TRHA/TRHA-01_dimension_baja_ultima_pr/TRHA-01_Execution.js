import http from 'k6/http';
import { check, sleep } from 'k6';
import { getOptions, handleSummary as _handleSummary } from '../../../generalfunctions/k6functions.js';
import { executionCases } from '../../../testdata/TRHA/TRHA-01_dimension_baja_ultima_pr.js';

export let options = getOptions();

const BASE_URL    = 'https://test--fps-rule-engine.furyapps.io';
const TIGER_TOKEN = `${__ENV.TIGER_TOKEN}`;
const SCRIPT_NAME = 'TRHA-01_dimension_baja_ultima_pr_Execution';

export default function () {
  const tc = executionCases[Math.floor(Math.random() * executionCases.length)];

  const payload = JSON.stringify({ input_context: tc.input_context });

  const params = {
    headers: {
      'Content-Type':  'application/json',
      'X-Tiger-Token': TIGER_TOKEN
    },
    tags: { name: `${SCRIPT_NAME}_${tc.id}` }
  };

  const response = http.post(
    `${BASE_URL}/reglas/bulk/env-test/headsup/global-smu-prod`,
    payload,
    params
  );

  check(response, { 'status is 200': (r) => r.status === 200 });

  sleep(0.3);
}

export function handleSummary(data) {
  return _handleSummary(data, SCRIPT_NAME);
}
