// ─── IntAPI test cases ────────────────────────────────────────────────────────
// Endpoint: /fpsIntegrationSMU/bulk-execution
// Payload : { process, smu_context_list: [{ user, context: { box } }] }

export const intApiCases = [
  { id: 'TR-3225', name: 'SI_outlier_meet_aligned',   user: '222',       box: 'OUTLIER'      }, // Generada    - outlier_meet_aligned
  { id: 'TR-3226', name: 'NO_outlier_below_aligned',  user: '30001420',  box: 'OUTLIER'      }, // NO_Generada - outlier_below_aligned
  { id: 'TR-3235', name: 'SI_uac_meet_aligned',       user: '3166',      box: 'UP AND COMER' }, // Generada    - upandcomer_meet_aligned
  { id: 'TR-3236', name: 'SI_exc_meet_aligned',       user: '30007513',  box: 'EXCEEDER'     }, // Generada    - exceeder_meet_aligned
  { id: 'TR-3237', name: 'NO_outlier_meet_need',      user: '30004969',  box: 'OUTLIER'      }, // NO_Generada - outlier_meet_need
  { id: 'TR-3239', name: 'NO_uac_below_aligned',      user: '30001420',  box: 'UP AND COMER' }, // NO_Generada - upandcomer_below_aligned
  { id: 'TR-3241', name: 'NO_exc_below_aligned',      user: '30001420',  box: 'EXCEEDER'     }, // NO_Generada - exceeder_below_aligned
  { id: 'TR-3242', name: 'NO_uac_meet_need',          user: '30057203',  box: 'UP AND COMER' }, // NO_Generada - upandcomer_meet_need
  { id: 'TR-3244', name: 'NO_exc_meet_need',          user: '30004969',  box: 'EXCEEDER'     }, // NO_Generada - exceeder_meet_need
];

// ─── Execution test cases ─────────────────────────────────────────────────────
// Endpoint: /reglas/bulk/env-test/headsup/global-smu-prod
// Payload : { input_context: { userId, firstName, lastName, hireDate, box, metrics } }

const SHARED_USER = {
  userId: 30019959, firstName: 'ARIADNA OFELIA', lastName: 'ORTIZ', hireDate: '2021-02-02'
};

function buildMetrics(prev, what, how) {
  const yr2026Values = [
    { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 13            },
    { name: 'START_SENIORITY_DATE',                 value: '2021-02-02'  },
    { name: 'PREVIOUS_YEAR_TR_ASSESSMENT',          value: prev          }
  ];

  const yr2025Values = [
    { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 13            },
    { name: 'START_SENIORITY_DATE',                 value: '2021-02-02'  }
  ];

  if (what !== null) yr2025Values.push({ name: 'PERFORMANCE_WHAT_LAST_YEAR', value: what });
  if (how  !== null) yr2025Values.push({ name: 'PERFORMANCE_HOW_LAST_YEAR',  value: how  });

  return [
    { year: 2026, months: [{ month: 2,  values: yr2026Values }] },
    { year: 2025, months: [{ month: 12, values: yr2025Values }] }
  ];
}

export const executionCases = [
  { id: 'TR-3224', name: 'NO_prev_achiever',          box: 'OUTLIER',      ...SHARED_USER, metrics: buildMetrics('ACHIEVER',         'MEET EXPECTATIONS',       'ALIGNED')          }, // NO  - prev=ACHIEVER
  { id: 'TR-3230', name: 'SI_prev_alert_uac',          box: 'UP AND COMER', ...SHARED_USER, metrics: buildMetrics('ALERT',            'ABOVE EXPECTATIONS',      'ROLE MODEL')       }, // SI  - prev=ALERT
  { id: 'TR-3231', name: 'SI_prev_alert_exc',          box: 'EXCEEDER',     ...SHARED_USER, metrics: buildMetrics('ALERT',            'ABOVE EXPECTATIONS',      'ROLE MODEL')       }, // SI  - prev=ALERT
  { id: 'TR-3232', name: 'SI_alert_out_meet_rm',       box: 'OUTLIER',      ...SHARED_USER, metrics: buildMetrics('ALERT',            'MEET EXPECTATIONS',       'ROLE MODEL')       }, // SI  - prev=ALERT
  { id: 'TR-3233', name: 'SI_alert_out_above_rm',      box: 'OUTLIER',      ...SHARED_USER, metrics: buildMetrics('ALERT',            'ABOVE EXPECTATIONS',      'ROLE MODEL')       }, // SI  - prev=ALERT
  { id: 'TR-3234', name: 'SI_alert_out_above_aln',     box: 'OUTLIER',      ...SHARED_USER, metrics: buildMetrics('ALERT',            'ABOVE EXPECTATIONS',      'ALIGNED')          }, // SI  - prev=ALERT
  { id: 'TR-3238', name: 'NO_alert_out_below_need',    box: 'OUTLIER',      ...SHARED_USER, metrics: buildMetrics('ALERT',            'BELOW EXPECTATIONS',      'NEED ALIGNMENT')   }, // NO  - prev=ALERT
  { id: 'TR-3240', name: 'NO_alert_uac_below_need',    box: 'UP AND COMER', ...SHARED_USER, metrics: buildMetrics('ALERT',            'BELOW EXPECTATIONS',      'NEED ALIGNMENT')   }, // NO  - prev=ALERT
  { id: 'TR-3243', name: 'NO_alert_exc_below_need',    box: 'EXCEEDER',     ...SHARED_USER, metrics: buildMetrics('ALERT',            'BELOW EXPECTATIONS',      'NEED ALIGNMENT')   }, // NO  - prev=ALERT
  { id: 'TR-3245', name: 'NO_prev_toosoon',            box: 'OUTLIER',      ...SHARED_USER, metrics: buildMetrics('TOO SOON TO RATE', 'MEET_EXPECTATIONS',       'ALIGNED')          }, // NO  - prev=TOO SOON TO RATE
  { id: 'TR-3246', name: 'NO_box_alert_prev_alert',    box: 'ALERT',        ...SHARED_USER, metrics: buildMetrics('ALERT',            'MEET_EXPECTATIONS',       'ALIGNED')          }, // NO  - prev=ALERT  box=ALERT
  { id: 'TR-3247', name: 'NO_prev_uac_below_need',     box: 'OUTLIER',      ...SHARED_USER, metrics: buildMetrics('UP AND COMER',     'BELOW_EXPECTATIONS',      'NEED_ALIGNMENT')   }, // NO  - prev=UP AND COMER
  { id: 'TR-3248', name: 'NO_box_alert_below_need',    box: 'ALERT',        ...SHARED_USER, metrics: buildMetrics('ALERT',            'BELOW_EXPECTATIONS',      'NEED_ALIGNMENT')   }, // NO  - prev=ALERT  box=ALERT
  { id: 'TR-3249', name: 'NO_prev_outlier',            box: 'OUTLIER',      ...SHARED_USER, metrics: buildMetrics('OUTLIER',          'BELOW_EXPECTATIONS',      'NEED_ALIGNMENT')   }, // NO  - prev=OUTLIER
  { id: 'TR-3250', name: 'NO_prev_uac_box_uac',        box: 'UP AND COMER', ...SHARED_USER, metrics: buildMetrics('UP AND COMER',     'MEET_EXPECTATIONS',       'ALIGNED')          }, // NO  - prev=UP AND COMER
  { id: 'TR-3251', name: 'NO_prev_exc_box_exc',        box: 'EXCEEDER',     ...SHARED_USER, metrics: buildMetrics('EXCEEDER',         'MEET EXPECTATIONS',       'ALIGNED')          }, // NO  - prev=EXCEEDER
  { id: 'TR-3252', name: 'NO_prev_null',               box: 'OUTLIER',      ...SHARED_USER, metrics: buildMetrics('null',             'MEET_EXPECTATIONS',       'ALIGNED')          }, // NO  - prev=null
  { id: 'TR-3253', name: 'NO_box_null',                box: 'null',         ...SHARED_USER, metrics: buildMetrics('ALERT',            'MEET_EXPECTATIONS',       'ALIGNED')          }, // NO  - box=null
  { id: 'TR-3254', name: 'SI_what_null',               box: 'OUTLIER',      ...SHARED_USER, metrics: buildMetrics('ALERT',            'null',                    'ALIGNED')          }, // SI  - what=null
  { id: 'TR-3255', name: 'SI_how_null',                box: 'OUTLIER',      ...SHARED_USER, metrics: buildMetrics('ALERT',            'MEET_EXPECTATIONS',       'null')             }, // SI  - how=null
  { id: 'TR-3256', name: 'SI_no_what_how',             box: 'OUTLIER',      ...SHARED_USER, metrics: buildMetrics('ALERT',            null,                      null)               }, // SI  - no what/how
  { id: 'TR-3257', name: 'SI_esp_cumplio_alineado',    box: 'OUTLIER',      ...SHARED_USER, metrics: buildMetrics('ALERT',            'cumplió expectativas',    'alineado')         }, // SI  - español
  { id: 'TR-3258', name: 'SI_esp_supero_modelo',       box: 'OUTLIER',      ...SHARED_USER, metrics: buildMetrics('ALERT',            'superó expectativas',     'modelo a seguir')  }, // SI  - español
  { id: 'TR-3259', name: 'NO_esp_nocumplio',           box: 'OUTLIER',      ...SHARED_USER, metrics: buildMetrics('ALERT',            'no cumplió expectativas', 'alineado')         }, // NO  - español
  { id: 'TR-3260', name: 'NO_esp_cumplio_need',        box: 'OUTLIER',      ...SHARED_USER, metrics: buildMetrics('ALERT',            'cumplió expectativas',    'necesita alinearse')}, // NO  - español
];
