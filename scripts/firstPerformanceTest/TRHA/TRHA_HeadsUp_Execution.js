import http from 'k6/http';
import { sleep } from 'k6';
import { validateEnv, logRequest, logResponse, checkResponse, getOptions, handleSummary as buildSummary } from '../../../generalfunctions/k6functions.js';
import { executionCases } from '../../../testdata/TRHA/TRHA_HeadsUp_testdata.js';
import { eligibleUsers } from '../../../generalfunctions/csvdata.js';

const BASE_URL    = __ENV.BASE_URL || 'https://test--fps-rule-engine.furyapps.io';
const TIGER_TOKEN = `${__ENV.TIGER_TOKEN}`;
const SCRIPT_NAME = 'TRHA_HeadsUp_Execution';

const allCases = executionCases;
const CASE_TAGS = allCases.map(tc => `${SCRIPT_NAME}_${tc.id}_${tc.name}`);

export const options = getOptions(5, CASE_TAGS);

export function setup() { validateEnv(); }

export default function () {
  const tc   = allCases[Math.floor(Math.random() * allCases.length)];
  const user = Number(eligibleUsers[Math.floor(Math.random() * eligibleUsers.length)]);

  const url     = `${BASE_URL}/reglas/bulk/env-test/headsup/global-smu-prod`;
  const payload = { input_context: { ...tc.input_context, userId: user } };

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
