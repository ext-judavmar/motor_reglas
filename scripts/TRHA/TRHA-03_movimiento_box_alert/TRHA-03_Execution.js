import http from 'k6/http';
import { sleep } from 'k6';
import { getOptions, handleSummary as _handleSummary, checkResponse } from '../../../generalfunctions/k6functions.js';
import { executionCases } from '../../../testdata/TRHA/TRHA-03_movimiento_box_alert.js';

const BASE_URL    = __ENV.BASE_URL || 'https://test--fps-rule-engine.furyapps.io';
const TIGER_TOKEN = `${__ENV.TIGER_TOKEN}`;
const SCRIPT_NAME = 'TRHA-03_movimiento_box_alert_Execution';

const CASE_TAGS = executionCases.map(tc => `${SCRIPT_NAME}_${tc.id}_${tc.name}`);
export let options = getOptions(5, CASE_TAGS);

export default function () {
  const tc = executionCases[Math.floor(Math.random() * executionCases.length)];

  const payload = JSON.stringify({
    input_context: {
      userId:    tc.userId,
      firstName: tc.firstName,
      lastName:  tc.lastName,
      hireDate:  tc.hireDate,
      box:       tc.box,
      metrics:   tc.metrics
    }
  });

  const params = {
    headers: {
      'Content-Type':  'application/json',
      'X-Tiger-Token': TIGER_TOKEN
    },
    tags: { name: `${SCRIPT_NAME}_${tc.id}_${tc.name}` }
  };

  console.log(`[VU ${__VU}] ${tc.id} | ${tc.name}`);

  const response = http.post(
    `${BASE_URL}/reglas/bulk/env-test/headsup/global-smu-prod`,
    payload,
    params
  );

  checkResponse(response);

  sleep(0.3);
}

export function handleSummary(data) {
  return _handleSummary(data, SCRIPT_NAME);
}
