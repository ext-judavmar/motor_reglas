import http from 'k6/http';
import { sleep } from 'k6';
import { getOptions, handleSummary as _handleSummary, checkResponse } from '../../../generalfunctions/k6functions.js';
import { eligibleUsers } from '../../../generalfunctions/csvdata.js';
import { validBoxes } from '../../../testdata/TRHA/TRHA-01_dimension_baja_ultima_pr.js';

export let options = getOptions();

const BASE_URL    = 'https://test--fps-integration-api.furyapps.io';
const TIGER_TOKEN = `${__ENV.TIGER_TOKEN}`;
const SCRIPT_NAME = 'TRHA-01_dimension_baja_ultima_pr_IntAPI';

export default function () {
  const user = eligibleUsers[Math.floor(Math.random() * eligibleUsers.length)];
  const box  = validBoxes[Math.floor(Math.random() * validBoxes.length)];

  const payload = JSON.stringify({
    process: 'global-smu-prod/headsup',
    smu_context_list: [
      { user: user, context: { box: box } }
    ]
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'x-tiger-token': TIGER_TOKEN
    },
    tags: { name: SCRIPT_NAME }
  };

  const response = http.post(`${BASE_URL}/fpsIntegrationSMU/bulk-execution`, payload, params);

  checkResponse(response);

  sleep(0.3);
}

export function handleSummary(data) {
  return _handleSummary(data, SCRIPT_NAME);
}
