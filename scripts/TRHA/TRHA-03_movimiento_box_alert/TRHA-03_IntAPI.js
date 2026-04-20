import http from 'k6/http';
import { sleep } from 'k6';
import { getOptions, handleSummary as _handleSummary, checkResponse } from '../../../generalfunctions/k6functions.js';
import { intApiCases } from '../../../testdata/TRHA/TRHA-03_movimiento_box_alert.js';
import { eligibleUsers } from '../../../generalfunctions/csvdata.js';

const BASE_URL    = __ENV.BASE_URL || 'https://test--fps-integration-api.furyapps.io';
const TIGER_TOKEN = `${__ENV.TIGER_TOKEN}`;
const SCRIPT_NAME = 'TRHA-03_movimiento_box_alert_IntAPI';

const CASE_TAGS = intApiCases.map(tc => `${SCRIPT_NAME}_${tc.id}_${tc.name}`);
export let options = getOptions(5, CASE_TAGS);

export default function () {
  const tc   = intApiCases[Math.floor(Math.random() * intApiCases.length)];
  const user = eligibleUsers[Math.floor(Math.random() * eligibleUsers.length)];

  const payload = JSON.stringify({
    process: 'global-smu-prod/headsup',
    smu_context_list: [
      { user: user, context: tc.box !== null ? { box: tc.box } : {} }
    ]
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'x-tiger-token': TIGER_TOKEN
    },
    tags: { name: `${SCRIPT_NAME}_${tc.id}_${tc.name}` }
  };

  console.log(`[VU ${__VU}] ${tc.id} | ${tc.name} | user:${user}`);

  const response = http.post(`${BASE_URL}/fpsIntegrationSMU/bulk-execution`, payload, params);

  checkResponse(response);

  sleep(0.3);
}

export function handleSummary(data) {
  return _handleSummary(data, SCRIPT_NAME);
}
