// ─── Valid box values for this feature ───────────────────────────────────────
export const validBoxes = [
  'OUTLIER',
  'UP AND COMER',
  'EXCEEDER',
  'ALERT',
];

// ─── IntAPI test cases ────────────────────────────────────────────────────────
// Endpoint: /fpsIntegrationSMU/bulk-execution
// Payload : { process, smu_context_list: [{ user, context: { box } }] }

export const intApiCases = [
  { id: 'TR-3225', user: '222',       box: 'OUTLIER'      }, // Generada    - outlier_meet_aligned
  { id: 'TR-3226', user: '30001420',  box: 'OUTLIER'      }, // NO_Generada - outlier_below_aligned
  { id: 'TR-3235', user: '3166',      box: 'UP AND COMER' }, // Generada    - upandcomer_meet_aligned
  { id: 'TR-3236', user: '30007513',  box: 'EXCEEDER'     }, // Generada    - exceeder_meet_aligned
  { id: 'TR-3237', user: '30004969',  box: 'OUTLIER'      }, // NO_Generada - outlier_meet_need
  { id: 'TR-3239', user: '30001420',  box: 'UP AND COMER' }, // NO_Generada - upandcomer_below_aligned
  { id: 'TR-3241', user: '30001420',  box: 'EXCEEDER'     }, // NO_Generada - exceeder_below_aligned
  { id: 'TR-3242', user: '30057203',  box: 'UP AND COMER' }, // NO_Generada - upandcomer_meet_need
  { id: 'TR-3244', user: '30004969',  box: 'EXCEEDER'     }, // NO_Generada - exceeder_meet_need
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
  { id: 'TR-3224', box: 'OUTLIER',      ...SHARED_USER, metrics: buildMetrics('ACHIEVER',         'MEET EXPECTATIONS',       'ALIGNED')          }, // NO  - prev=ACHIEVER
  { id: 'TR-3230', box: 'UP AND COMER', ...SHARED_USER, metrics: buildMetrics('ALERT',            'ABOVE EXPECTATIONS',      'ROLE MODEL')       }, // SI  - prev=ALERT
  { id: 'TR-3231', box: 'EXCEEDER',     ...SHARED_USER, metrics: buildMetrics('ALERT',            'ABOVE EXPECTATIONS',      'ROLE MODEL')       }, // SI  - prev=ALERT
  { id: 'TR-3232', box: 'OUTLIER',      ...SHARED_USER, metrics: buildMetrics('ALERT',            'MEET EXPECTATIONS',       'ROLE MODEL')       }, // SI  - prev=ALERT
  { id: 'TR-3233', box: 'OUTLIER',      ...SHARED_USER, metrics: buildMetrics('ALERT',            'ABOVE EXPECTATIONS',      'ROLE MODEL')       }, // SI  - prev=ALERT
  { id: 'TR-3234', box: 'OUTLIER',      ...SHARED_USER, metrics: buildMetrics('ALERT',            'ABOVE EXPECTATIONS',      'ALIGNED')          }, // SI  - prev=ALERT
  { id: 'TR-3238', box: 'OUTLIER',      ...SHARED_USER, metrics: buildMetrics('ALERT',            'BELOW EXPECTATIONS',      'NEED ALIGNMENT')   }, // NO  - prev=ALERT
  { id: 'TR-3240', box: 'UP AND COMER', ...SHARED_USER, metrics: buildMetrics('ALERT',            'BELOW EXPECTATIONS',      'NEED ALIGNMENT')   }, // NO  - prev=ALERT
  { id: 'TR-3243', box: 'EXCEEDER',     ...SHARED_USER, metrics: buildMetrics('ALERT',            'BELOW EXPECTATIONS',      'NEED ALIGNMENT')   }, // NO  - prev=ALERT
  { id: 'TR-3245', box: 'OUTLIER',      ...SHARED_USER, metrics: buildMetrics('TOO SOON TO RATE', 'MEET_EXPECTATIONS',       'ALIGNED')          }, // NO  - prev=TOO SOON TO RATE
  { id: 'TR-3246', box: 'ALERT',        ...SHARED_USER, metrics: buildMetrics('ALERT',            'MEET_EXPECTATIONS',       'ALIGNED')          }, // NO  - prev=ALERT  box=ALERT
  { id: 'TR-3247', box: 'OUTLIER',      ...SHARED_USER, metrics: buildMetrics('UP AND COMER',     'BELOW_EXPECTATIONS',      'NEED_ALIGNMENT')   }, // NO  - prev=UP AND COMER
  { id: 'TR-3248', box: 'ALERT',        ...SHARED_USER, metrics: buildMetrics('ALERT',            'BELOW_EXPECTATIONS',      'NEED_ALIGNMENT')   }, // NO  - prev=ALERT  box=ALERT
  { id: 'TR-3249', box: 'OUTLIER',      ...SHARED_USER, metrics: buildMetrics('OUTLIER',          'BELOW_EXPECTATIONS',      'NEED_ALIGNMENT')   }, // NO  - prev=OUTLIER
  { id: 'TR-3250', box: 'UP AND COMER', ...SHARED_USER, metrics: buildMetrics('UP AND COMER',     'MEET_EXPECTATIONS',       'ALIGNED')          }, // NO  - prev=UP AND COMER
  { id: 'TR-3251', box: 'EXCEEDER',     ...SHARED_USER, metrics: buildMetrics('EXCEEDER',         'MEET EXPECTATIONS',       'ALIGNED')          }, // NO  - prev=EXCEEDER
  { id: 'TR-3252', box: 'OUTLIER',      ...SHARED_USER, metrics: buildMetrics('null',             'MEET_EXPECTATIONS',       'ALIGNED')          }, // NO  - prev=null
  { id: 'TR-3253', box: 'null',         ...SHARED_USER, metrics: buildMetrics('ALERT',            'MEET_EXPECTATIONS',       'ALIGNED')          }, // NO  - box=null
  { id: 'TR-3254', box: 'OUTLIER',      ...SHARED_USER, metrics: buildMetrics('ALERT',            'null',                    'ALIGNED')          }, // SI  - what=null
  { id: 'TR-3255', box: 'OUTLIER',      ...SHARED_USER, metrics: buildMetrics('ALERT',            'MEET_EXPECTATIONS',       'null')             }, // SI  - how=null
  { id: 'TR-3256', box: 'OUTLIER',      ...SHARED_USER, metrics: buildMetrics('ALERT',            null,                      null)               }, // SI  - no what/how
  { id: 'TR-3257', box: 'OUTLIER',      ...SHARED_USER, metrics: buildMetrics('ALERT',            'cumplió expectativas',    'alineado')         }, // SI  - español
  { id: 'TR-3258', box: 'OUTLIER',      ...SHARED_USER, metrics: buildMetrics('ALERT',            'superó expectativas',     'modelo a seguir')  }, // SI  - español
  { id: 'TR-3259', box: 'OUTLIER',      ...SHARED_USER, metrics: buildMetrics('ALERT',            'no cumplió expectativas', 'alineado')         }, // NO  - español
  { id: 'TR-3260', box: 'OUTLIER',      ...SHARED_USER, metrics: buildMetrics('ALERT',            'cumplió expectativas',    'necesita alinearse')}, // NO  - español
];
