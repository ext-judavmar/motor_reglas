import http from 'k6/http';
import { sleep } from 'k6';
import { validateEnv, logRequest, logResponse, checkResponse, getOptions, handleSummary as buildSummary } from '../../../generalfunctions/k6functions.js';
import { intApiCases } from '../../../testdata/TRHS/TRHS_HeadsUp_Succession_testdata.js';

const BASE_URL    = __ENV.BASE_URL || 'https://test--fps-integration-api.furyapps.io';
const TIGER_TOKEN = `${__ENV.TIGER_TOKEN}`;
const SCRIPT_NAME = 'TRHS_HeadsUp_Succession_IntAPI';

const CASE_TAGS = intApiCases.map(tc => `${SCRIPT_NAME}_${tc.id}_${tc.name}`);

export const options = getOptions(5, CASE_TAGS);

export function setup() { validateEnv(); }

export default function () {
  const tc = intApiCases[Math.floor(Math.random() * intApiCases.length)];

  const url     = `${BASE_URL}/fpsIntegrationSMU/bulk-execution`;
  const payload = {
    process: 'global-smu-prod/headsup-succession',
    smu_context_list: [{ user: tc.user, context: { box: tc.box } }]
  };

  const params = {
    headers: {
      'Content-Type':  'application/json',
      'X-Tiger-Token': TIGER_TOKEN
    },
    tags: { name: `${SCRIPT_NAME}_${tc.id}_${tc.name}` }
  };

  logRequest(url, payload);
  const response = http.post(url, JSON.stringify(payload), params);
  logResponse(response);
  checkResponse(response);

  sleep(0.3);
}

export function handleSummary(data) {
  return buildSummary(data, SCRIPT_NAME);
}
