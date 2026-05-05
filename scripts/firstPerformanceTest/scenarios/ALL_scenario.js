import http from 'k6/http';
import { sleep } from 'k6';
import { validateEnv, logRequest, logResponse, checkResponse, getScenariosOptions, handleSummary as buildSummary } from '../../../generalfunctions/k6functions.js';
import { executionCases as trhaExec, intApiCases as trhaIntApi } from '../../../testdata/TRHA/TRHA_HeadsUp_testdata.js';
import { executionCases as trhsExec, intApiCases as trhsIntApi } from '../../../testdata/TRHS/TRHS_HeadsUp_Succession_testdata.js';
import { executionCases as trmaExec, intApiCases as trmaIntApi } from '../../../testdata/TRMA/TRMA_Marcas_testdata.js';
import { eligibleUsers } from '../../../generalfunctions/csvdata.js';

const EXEC_BASE_URL  = __ENV.BASE_URL   || 'https://test--fps-rule-engine.furyapps.io';
const INTAPI_BASE_URL = __ENV.INTAPI_URL || 'https://test--fps-integration-api.furyapps.io';
const TIGER_TOKEN     = `${__ENV.TIGER_TOKEN}`;
const SCRIPT_NAME     = 'ALL_scenario';

const HEADERS = { 'Content-Type': 'application/json', 'X-Tiger-Token': TIGER_TOKEN };

const ALL_TAGS = [
  ...trhaExec.map(tc   => `${SCRIPT_NAME}_TRHA-exec_${tc.id}_${tc.name}`),
  ...trhaIntApi.map(tc  => `${SCRIPT_NAME}_TRHA-intapi_${tc.id}_${tc.name}`),
  ...trhsExec.map(tc   => `${SCRIPT_NAME}_TRHS-exec_${tc.id}_${tc.name}`),
  ...trhsIntApi.map(tc  => `${SCRIPT_NAME}_TRHS-intapi_${tc.id}_${tc.name}`),
  ...trmaExec.map(tc   => `${SCRIPT_NAME}_TRMA-exec_${tc.id}_${tc.name}`),
  ...trmaIntApi.map(tc  => `${SCRIPT_NAME}_TRMA-intapi_${tc.id}_${tc.name}`),
];

export const options = getScenariosOptions(5, [
  'trha_execution', 'trha_intapi',
  'trhs_execution', 'trhs_intapi',
  'trma_execution', 'trma_intapi',
], ALL_TAGS);

export function setup() { validateEnv(); }

export function trha_execution() {
  const tc      = trhaExec[Math.floor(Math.random() * trhaExec.length)];
  const user    = Number(eligibleUsers[Math.floor(Math.random() * eligibleUsers.length)]);
  const url     = `${EXEC_BASE_URL}/reglas/bulk/env-test/headsup/global-smu-prod`;
  const payload = { input_context: { ...tc.input_context, userId: user } };
  logRequest(url, payload);
  const response = http.post(url, JSON.stringify(payload), { headers: HEADERS, tags: { name: `${SCRIPT_NAME}_TRHA-exec_${tc.id}_${tc.name}` } });
  logResponse(response);
  checkResponse(response);
  sleep(0.3);
}

export function trha_intapi() {
  const tc      = trhaIntApi[Math.floor(Math.random() * trhaIntApi.length)];
  const url     = `${INTAPI_BASE_URL}/fpsIntegrationSMU/bulk-execution`;
  const payload = { process: 'global-smu-prod/headsup', smu_context_list: [{ user: tc.user, context: { box: tc.box } }] };
  logRequest(url, payload);
  const response = http.post(url, JSON.stringify(payload), { headers: HEADERS, tags: { name: `${SCRIPT_NAME}_TRHA-intapi_${tc.id}_${tc.name}` } });
  logResponse(response);
  checkResponse(response);
  sleep(0.3);
}

export function trhs_execution() {
  const tc      = trhsExec[Math.floor(Math.random() * trhsExec.length)];
  const user    = Number(eligibleUsers[Math.floor(Math.random() * eligibleUsers.length)]);
  const url     = `${EXEC_BASE_URL}/reglas/bulk/env-test/headsup-succession/global-smu-prod`;
  const payload = { input_context: { ...tc.input_context, userId: user } };
  logRequest(url, payload);
  const response = http.post(url, JSON.stringify(payload), { headers: HEADERS, tags: { name: `${SCRIPT_NAME}_TRHS-exec_${tc.id}_${tc.name}` } });
  logResponse(response);
  checkResponse(response);
  sleep(0.3);
}

export function trhs_intapi() {
  const tc      = trhsIntApi[Math.floor(Math.random() * trhsIntApi.length)];
  const url     = `${INTAPI_BASE_URL}/fpsIntegrationSMU/bulk-execution`;
  const payload = { process: 'global-smu-prod/headsup-succession', smu_context_list: [{ user: tc.user, context: { box: tc.box } }] };
  logRequest(url, payload);
  const response = http.post(url, JSON.stringify(payload), { headers: HEADERS, tags: { name: `${SCRIPT_NAME}_TRHS-intapi_${tc.id}_${tc.name}` } });
  logResponse(response);
  checkResponse(response);
  sleep(0.3);
}

export function trma_execution() {
  const tc      = trmaExec[Math.floor(Math.random() * trmaExec.length)];
  const user    = Number(eligibleUsers[Math.floor(Math.random() * eligibleUsers.length)]);
  const url     = `${EXEC_BASE_URL}/reglas/bulk/env-test/marcas/global-smu-prod`;
  const payload = { input_context: { ...tc.input_context, userId: user } };
  logRequest(url, payload);
  const response = http.post(url, JSON.stringify(payload), { headers: HEADERS, tags: { name: `${SCRIPT_NAME}_TRMA-exec_${tc.id}_${tc.name}` } });
  logResponse(response);
  checkResponse(response);
  sleep(0.3);
}

export function trma_intapi() {
  const tc   = trmaIntApi[Math.floor(Math.random() * trmaIntApi.length)];
  const item = tc.box ? { user: tc.user, context: { box: tc.box } } : { user: tc.user };
  const url  = `${INTAPI_BASE_URL}/fpsIntegrationSMU/bulk-execution`;
  const payload = { process: 'global-smu-prod/marcas', smu_context_list: [item] };
  logRequest(url, payload);
  const response = http.post(url, JSON.stringify(payload), { headers: HEADERS, tags: { name: `${SCRIPT_NAME}_TRMA-intapi_${tc.id}_${tc.name}` } });
  logResponse(response);
  checkResponse(response);
  sleep(0.3);
}

export function handleSummary(data) {
  return buildSummary(data, SCRIPT_NAME);
}
