import http from 'k6/http';
import { sleep } from 'k6';
import { validateEnv, logRequest, logResponse, checkResponse, getOptions, handleSummary as buildSummary } from '../../../generalfunctions/k6functions.js';
import { intApiCases } from '../../../testdata/TRMA/TRMA_Marcas_testdata.js';

const BASE_URL    = __ENV.BASE_URL || 'https://test--fps-integration-api.furyapps.io';
const TIGER_TOKEN = `${__ENV.TIGER_TOKEN}`;
const SCRIPT_NAME = 'TRMA_Marcas_IntAPI';

const CASE_TAGS = intApiCases.map(tc => `${SCRIPT_NAME}_${tc.id}_${tc.name}`);

export const options = getOptions(5, CASE_TAGS);

export function setup() { validateEnv(); }

export default function () {
  const tc = intApiCases[Math.floor(Math.random() * intApiCases.length)];

  const url  = `${BASE_URL}/fpsIntegrationSMU/bulk-execution`;
  const item = tc.box
    ? { user: tc.user, context: { box: tc.box } }
    : { user: tc.user };
  const payload = {
    process: 'global-smu-prod/marcas',
    smu_context_list: [item]
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
