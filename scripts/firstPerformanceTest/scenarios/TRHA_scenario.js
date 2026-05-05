import http from 'k6/http';
import { sleep } from 'k6';
import { validateEnv, logRequest, logResponse, checkResponse, getScenariosOptions, handleSummary as buildSummary } from '../../../generalfunctions/k6functions.js';
import { executionCases, intApiCases } from '../../../testdata/TRHA/TRHA_HeadsUp_testdata.js';
import { eligibleUsers } from '../../../generalfunctions/csvdata.js';

const EXEC_URL    = `${__ENV.BASE_URL    || 'https://test--fps-rule-engine.furyapps.io'}/reglas/bulk/env-test/headsup/global-smu-prod`;
const INTAPI_URL  = `${__ENV.INTAPI_URL  || 'https://test--fps-integration-api.furyapps.io'}/fpsIntegrationSMU/bulk-execution`;
const TIGER_TOKEN = `${__ENV.TIGER_TOKEN}`;
const SCRIPT_NAME = 'TRHA_scenario';

const EXEC_TAGS   = executionCases.map(tc => `${SCRIPT_NAME}_exec_${tc.id}_${tc.name}`);
const INTAPI_TAGS = intApiCases.map(tc => `${SCRIPT_NAME}_intapi_${tc.id}_${tc.name}`);

export const options = getScenariosOptions(5, ['execution', 'intapi'], [...EXEC_TAGS, ...INTAPI_TAGS]);

export function setup() { validateEnv(); }

export function execution() {
  const tc      = executionCases[Math.floor(Math.random() * executionCases.length)];
  const user    = Number(eligibleUsers[Math.floor(Math.random() * eligibleUsers.length)]);
  const payload = { input_context: { ...tc.input_context, userId: user } };
  const params  = {
    headers: { 'Content-Type': 'application/json', 'X-Tiger-Token': TIGER_TOKEN },
    tags:    { name: `${SCRIPT_NAME}_exec_${tc.id}_${tc.name}` }
  };
  logRequest(EXEC_URL, payload);
  const response = http.post(EXEC_URL, JSON.stringify(payload), params);
  logResponse(response);
  checkResponse(response);
  sleep(0.3);
}

export function intapi() {
  const tc      = intApiCases[Math.floor(Math.random() * intApiCases.length)];
  const payload = {
    process: 'global-smu-prod/headsup',
    smu_context_list: [{ user: tc.user, context: { box: tc.box } }]
  };
  const params = {
    headers: { 'Content-Type': 'application/json', 'X-Tiger-Token': TIGER_TOKEN },
    tags:    { name: `${SCRIPT_NAME}_intapi_${tc.id}_${tc.name}` }
  };
  logRequest(INTAPI_URL, payload);
  const response = http.post(INTAPI_URL, JSON.stringify(payload), params);
  logResponse(response);
  checkResponse(response);
  sleep(0.3);
}

export function handleSummary(data) {
  return buildSummary(data, SCRIPT_NAME);
}
