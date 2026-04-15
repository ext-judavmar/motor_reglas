import http from 'k6/http';
import { check, sleep } from 'k6';
import { getOptions, handleSummary as _handleSummary } from '../generalfunctions/k6functions.js';

export let options = getOptions();

const BASE_URL = 'https://test--fps-integration-api.furyapps.io';
const TIGER_TOKEN = `${__ENV.TIGER_TOKEN}`;
const SCRIPT_NAME = 'TR-3226_movimiento_box_alert';

export default function () {
  const url = `${BASE_URL}/fpsIntegrationSMU/bulk-execution`;

  const payload = JSON.stringify({
    "process": "global-smu-prod/headsup",
    "smu_context_list": [
      {
        "user": "30001420",
        "context": {
          "box": "OUTLIER"
        }
      }
    ]
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'x-tiger-token': TIGER_TOKEN
    },
    tags: { name: 'TR-3226_IntAPI_movimiento_box_alert_NO_Generada_outlier_below_aligned' }
  };

  const response = http.post(url, payload, params);

  check(response, {
    'status is 200': (r) => r.status === 200
  });

  sleep(0.3);
}

export function handleSummary(data) {
  return _handleSummary(data, SCRIPT_NAME);
}
