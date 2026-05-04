// ─── IntAPI test cases ────────────────────────────────────────────────────────
// Endpoint: /fpsIntegrationSMU/bulk-execution
// Payload : { process, smu_context_list: [{ user, context: { box } }] }

export const intApiCases = [
  { id: 'TRHS-01-SI', name: 'SI_achiever', user: '30039519', box: 'ACHIEVER' }, // Generada   - sucesor ACHIEVER
  { id: 'TRHS-01-NO', name: 'NO_alert',    user: '30031577', box: 'ALERT'    }, // NO_Generada - sucesor ALERT
];

// ─── Execution test cases ─────────────────────────────────────────────────────
// Endpoint: /reglas/bulk/env-test/headsup-succession/global-smu-prod
// Payload : { input_context: { userId, firstName, lastName, hireDate, box, metrics } }
//
// Both cases share the same user and full metrics history (2017–2026).
// Only box differs.

const SHARED_USER = {
  userId: 30002966, firstName: 'GABRIEL', lastName: 'BORGES NOGUEIRA SUAKI', hireDate: '2017-12-11'
};

const SHARED_METRICS = [
  { year: 2017, months: [
    { month: 12, values: [
      { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP',        value: 10            },
      { name: 'START_SENIORITY_DATE',                        value: '2022-03-01'  },
      { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 11            },
      { name: 'TIM_DATE',                                    value: '2017-12-31'  },
      { name: 'START_DATE_ROTATION',                         value: '2017-12-11'  }
    ]}
  ]},
  { year: 2018, months: [
    { month: 1,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 9  }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 11 }, { name: 'TIM_DATE', value: '2018-01-31' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 2,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 9  }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 12 }, { name: 'TIM_DATE', value: '2018-02-28' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 3,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 9  }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 12 }, { name: 'TIM_DATE', value: '2018-03-31' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 4,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 9  }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 11 }, { name: 'TIM_DATE', value: '2018-04-30' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 5,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 9  }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 11 }, { name: 'TIM_DATE', value: '2018-05-31' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 6,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 9  }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 11 }, { name: 'TIM_DATE', value: '2018-06-30' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 7,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 9  }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 11 }, { name: 'TIM_DATE', value: '2018-07-31' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 8,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 9  }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 11 }, { name: 'TIM_DATE', value: '2018-08-31' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 9,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 9  }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 11 }, { name: 'TIM_DATE', value: '2018-09-30' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 10, values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 9  }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 11 }, { name: 'TIM_DATE', value: '2018-10-31' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 11, values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 9  }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 11 }, { name: 'TIM_DATE', value: '2018-11-30' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 12, values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 9  }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 11 }, { name: 'TIM_DATE', value: '2018-12-31' }, { name: 'SIN METRICAS', value: 0.0 }] }
  ]},
  { year: 2019, months: [
    { month: 1,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 9  }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 11 }, { name: 'TIM_DATE', value: '2019-01-31' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 2,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 10 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 11 }, { name: 'TIM_DATE', value: '2019-02-28' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 3,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 10 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 11 }, { name: 'TIM_DATE', value: '2019-03-31' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 4,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 10 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 11 }, { name: 'TIM_DATE', value: '2019-04-30' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 5,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 10 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 11 }, { name: 'TIM_DATE', value: '2019-05-31' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 6,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 10 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 11 }, { name: 'TIM_DATE', value: '2019-06-30' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 7,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 10 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 11 }, { name: 'TIM_DATE', value: '2019-07-31' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 8,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 10 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 11 }, { name: 'TIM_DATE', value: '2019-08-31' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 9,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 10 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 11 }, { name: 'TIM_DATE', value: '2019-09-30' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 10, values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 10 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 11 }, { name: 'TIM_DATE', value: '2019-10-31' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 11, values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 10 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 11 }, { name: 'TIM_DATE', value: '2019-11-30' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 12, values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 10 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 11 }, { name: 'TIM_DATE', value: '2019-12-31' }, { name: 'SIN METRICAS', value: 0.0 }] }
  ]},
  { year: 2020, months: [
    { month: 1,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 10 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 11 }, { name: 'TIM_DATE', value: '2020-01-31' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 2,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 10 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 11 }, { name: 'TIM_DATE', value: '2020-02-29' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 3,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 10 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 11 }, { name: 'TIM_DATE', value: '2020-03-31' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 4,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 10 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 11 }, { name: 'TIM_DATE', value: '2020-04-30' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 5,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 10 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 11 }, { name: 'TIM_DATE', value: '2020-05-31' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 6,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 10 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 11 }, { name: 'TIM_DATE', value: '2020-06-30' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 7,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 10 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 11 }, { name: 'TIM_DATE', value: '2020-07-31' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 8,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 10 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 11 }, { name: 'TIM_DATE', value: '2020-08-31' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 9,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 11 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 12 }, { name: 'TIM_DATE', value: '2020-09-30' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 10, values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 11 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 12 }, { name: 'TIM_DATE', value: '2020-10-31' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 11, values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 11 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 12 }, { name: 'TIM_DATE', value: '2020-11-30' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 12, values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 11 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 12 }, { name: 'TIM_DATE', value: '2020-12-31' }, { name: 'SIN METRICAS', value: 0.0 }] }
  ]},
  { year: 2021, months: [
    { month: 1,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 11 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 12 }, { name: 'TIM_DATE', value: '2021-01-31' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 2,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 11 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 12 }, { name: 'TIM_DATE', value: '2021-02-28' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 3,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 11 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 12 }, { name: 'TIM_DATE', value: '2021-03-31' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 4,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 11 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 12 }, { name: 'TIM_DATE', value: '2021-04-30' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 5,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 11 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 12 }, { name: 'TIM_DATE', value: '2021-05-31' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 6,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 11 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 12 }, { name: 'TIM_DATE', value: '2021-06-30' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 7,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 11 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 12 }, { name: 'TIM_DATE', value: '2021-07-31' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 8,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 11 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 12 }, { name: 'TIM_DATE', value: '2021-08-31' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 9,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 11 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2021-09-30' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 10, values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 11 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2021-10-31' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 11, values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 11 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2021-11-30' }, { name: 'SIN METRICAS', value: 0.0 }] },
    { month: 12, values: [
      { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP',        value: 11                      },
      { name: 'START_SENIORITY_DATE',                        value: '2022-03-01'            },
      { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13                      },
      { name: 'TIM_DATE',                                    value: '2021-12-31'            },
      { name: 'PERFORMANCE_WHAT_PREVIOUS_FOUR_YEARS',        value: 'SUPERÓ EXPECTATIVAS'  },
      { name: 'PERFORMANCE_HOW_PREVIOUS_FOUR_YEARS',         value: 'MODELO A SEGUIR'      }
    ]}
  ]},
  { year: 2022, months: [
    { month: 1,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 11 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2022-01-31' }, { name: 'CONNECTIVITY_TAG', value: 'MID'      }] },
    { month: 2,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 11 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2022-02-28' }, { name: 'CONNECTIVITY_TAG', value: 'MID'      }] },
    { month: 3,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2022-03-31' }, { name: 'CONNECTIVITY_TAG', value: 'MID'      }] },
    { month: 4,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2022-04-30' }, { name: 'CONNECTIVITY_TAG', value: 'MID'      }] },
    { month: 5,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2022-05-31' }, { name: 'CONNECTIVITY_TAG', value: 'MID'      }] },
    { month: 6,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2022-06-30' }, { name: 'CONNECTIVITY_TAG', value: 'MID'      }] },
    { month: 7,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2022-07-31' }, { name: 'CONNECTIVITY_TAG', value: 'MID'      }] },
    { month: 8,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2022-08-31' }, { name: 'CONNECTIVITY_TAG', value: 'MID'      }] },
    { month: 9,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2022-09-30' }, { name: 'CONNECTIVITY_TAG', value: 'MID - HIGH' }] },
    { month: 10, values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2022-10-31' }, { name: 'CONNECTIVITY_TAG', value: 'MID - HIGH' }] },
    { month: 11, values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2022-11-30' }, { name: 'CONNECTIVITY_TAG', value: 'MID - HIGH' }] },
    { month: 12, values: [
      { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP',        value: 12                    },
      { name: 'START_SENIORITY_DATE',                        value: '2022-03-01'          },
      { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13                    },
      { name: 'TIM_DATE',                                    value: '2022-12-31'          },
      { name: 'PERFORMANCE_WHAT_PREVIOUS_THREE_YEARS',       value: 'ALCANZÓ EXPECTATIVAS'},
      { name: 'PERFORMANCE_HOW_PREVIOUS_THREE_YEARS',        value: 'MODELO A SEGUIR'    },
      { name: 'CONNECTIVITY_TAG',                            value: 'MID'                }
    ]}
  ]},
  { year: 2023, months: [
    { month: 1,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2023-01-31' }, { name: 'CONNECTIVITY_TAG', value: 'MID' }] },
    { month: 2,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2023-02-28' }, { name: 'CONNECTIVITY_TAG', value: 'MID' }] },
    { month: 3,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2023-03-31' }, { name: 'CONNECTIVITY_TAG', value: 'MID' }] },
    { month: 4,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2023-04-30' }, { name: 'CONNECTIVITY_TAG', value: 'NA'  }] },
    { month: 5,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2023-05-31' }, { name: 'CONNECTIVITY_TAG', value: 'MID' }] },
    { month: 6,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2023-06-30' }, { name: 'CONNECTIVITY_TAG', value: 'MID' }] },
    { month: 7,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2023-07-31' }, { name: 'CONNECTIVITY_TAG', value: 'MID' }] },
    { month: 8,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2023-08-31' }, { name: 'CONNECTIVITY_TAG', value: 'MID' }] },
    { month: 9,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2023-09-30' }, { name: 'CONNECTIVITY_TAG', value: 'MID' }] },
    { month: 10, values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2023-10-31' }, { name: 'CONNECTIVITY_TAG', value: 'MID' }] },
    { month: 11, values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2023-11-30' }, { name: 'CONNECTIVITY_TAG', value: 'MID' }] },
    { month: 12, values: [
      { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP',        value: 12                    },
      { name: 'START_SENIORITY_DATE',                        value: '2022-03-01'          },
      { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13                    },
      { name: 'TIM_DATE',                                    value: '2023-12-31'          },
      { name: 'PERFORMANCE_WHAT_PREVIOUS_TWO_YEARS',         value: 'ALCANZÓ EXPECTATIVAS'},
      { name: 'PERFORMANCE_HOW_PREVIOUS_TWO_YEARS',          value: 'ALINEADO'           },
      { name: 'CONNECTIVITY_TAG',                            value: 'HIGH'               }
    ]}
  ]},
  { year: 2024, months: [
    { month: 1,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2024-01-31' }, { name: 'NEW_HIRE_ATTENDANCE', value: 'NO' }, { name: 'PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.15                }, { name: 'ATTENDANCE_DAYS_3MONTHS', value: 9.0  }, { name: 'CONNECTIVITY_TAG', value: 'MID'  }, { name: 'EXCEPTION_FLAG_ATTENDANCE', value: 'NO' }, { name: 'DIVISION_ATTENDANCE', value: 'IT' }] },
    { month: 2,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2024-02-29' }, { name: 'NEW_HIRE_ATTENDANCE', value: 'NO' }, { name: 'PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.17307692307692307 }, { name: 'ATTENDANCE_DAYS_3MONTHS', value: 9.0  }, { name: 'CONNECTIVITY_TAG', value: 'MID'  }, { name: 'EXCEPTION_FLAG_ATTENDANCE', value: 'NO' }, { name: 'DIVISION_ATTENDANCE', value: 'IT' }] },
    { month: 3,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2024-03-31' }, { name: 'NEW_HIRE_ATTENDANCE', value: 'NO' }, { name: 'PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.25                }, { name: 'ATTENDANCE_DAYS_3MONTHS', value: 13.0 }, { name: 'CONNECTIVITY_TAG', value: 'HIGH' }, { name: 'EXCEPTION_FLAG_ATTENDANCE', value: 'NO' }, { name: 'DIVISION_ATTENDANCE', value: 'IT' }] },
    { month: 4,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2024-04-30' }, { name: 'NEW_HIRE_ATTENDANCE', value: 'NO' }, { name: 'PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.25                }, { name: 'ATTENDANCE_DAYS_3MONTHS', value: 13.0 }, { name: 'CONNECTIVITY_TAG', value: 'MID'  }, { name: 'EXCEPTION_FLAG_ATTENDANCE', value: 'NO' }, { name: 'DIVISION_ATTENDANCE', value: 'IT' }, { name: 'TARGET_PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.2 }] },
    { month: 5,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2024-05-31' }, { name: 'NEW_HIRE_ATTENDANCE', value: 'NO' }, { name: 'PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.23333333333333334 }, { name: 'ATTENDANCE_DAYS_3MONTHS', value: 14.0 }, { name: 'CONNECTIVITY_TAG', value: 'MID'  }, { name: 'EXCEPTION_FLAG_ATTENDANCE', value: 'NO' }, { name: 'DIVISION_ATTENDANCE', value: 'IT' }, { name: 'TARGET_PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.2 }] },
    { month: 6,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2024-06-30' }, { name: 'NEW_HIRE_ATTENDANCE', value: 'NO' }, { name: 'PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.21666666666666667 }, { name: 'ATTENDANCE_DAYS_3MONTHS', value: 13.0 }, { name: 'CONNECTIVITY_TAG', value: 'MID'  }, { name: 'EXCEPTION_FLAG_ATTENDANCE', value: 'NO' }, { name: 'DIVISION_ATTENDANCE', value: 'IT' }, { name: 'TARGET_PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.2 }] },
    { month: 7,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2024-07-31' }, { name: 'NEW_HIRE_ATTENDANCE', value: 'NO' }, { name: 'PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.21818181818181817 }, { name: 'ATTENDANCE_DAYS_3MONTHS', value: 12.0 }, { name: 'CONNECTIVITY_TAG', value: 'MID'  }, { name: 'EXCEPTION_FLAG_ATTENDANCE', value: 'NO' }, { name: 'DIVISION_ATTENDANCE', value: 'IT' }, { name: 'TARGET_PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.2 }] },
    { month: 8,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2024-08-31' }, { name: 'NEW_HIRE_ATTENDANCE', value: 'NO' }, { name: 'PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.2727272727272727  }, { name: 'ATTENDANCE_DAYS_3MONTHS', value: 15.0 }, { name: 'CONNECTIVITY_TAG', value: 'MID'  }, { name: 'EXCEPTION_FLAG_ATTENDANCE', value: 'NO' }, { name: 'DIVISION_ATTENDANCE', value: 'IT' }, { name: 'TARGET_PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.2 }] },
    { month: 9,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2024-09-30' }, { name: 'NEW_HIRE_ATTENDANCE', value: 'NO' }, { name: 'PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.2909090909090909  }, { name: 'ATTENDANCE_DAYS_3MONTHS', value: 16.0 }, { name: 'CONNECTIVITY_TAG', value: 'MID'  }, { name: 'EXCEPTION_FLAG_ATTENDANCE', value: 'NO' }, { name: 'DIVISION_ATTENDANCE', value: 'IT' }, { name: 'TARGET_PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.2 }] },
    { month: 10, values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2024-10-31' }, { name: 'NEW_HIRE_ATTENDANCE', value: 'NO' }, { name: 'PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.21666666666666667 }, { name: 'ATTENDANCE_DAYS_3MONTHS', value: 13.0 }, { name: 'CONNECTIVITY_TAG', value: 'MID'  }, { name: 'EXCEPTION_FLAG_ATTENDANCE', value: 'NO' }, { name: 'DIVISION_ATTENDANCE', value: 'IT' }, { name: 'TARGET_PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.2 }] },
    { month: 11, values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2024-11-30' }, { name: 'NEW_HIRE_ATTENDANCE', value: 'NO' }, { name: 'PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.16326530612244897 }, { name: 'ATTENDANCE_DAYS_3MONTHS', value: 8.0  }, { name: 'CONNECTIVITY_TAG', value: 'NA'   }, { name: 'EXCEPTION_FLAG_ATTENDANCE', value: 'NO' }, { name: 'DIVISION_ATTENDANCE', value: 'IT' }, { name: 'TARGET_PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.2 }] },
    { month: 12, values: [
      { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP',        value: 12                    },
      { name: 'START_SENIORITY_DATE',                        value: '2022-03-01'          },
      { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13                    },
      { name: 'TIM_DATE',                                    value: '2024-12-31'          },
      { name: 'PERFORMANCE_WHAT_PREVIOUS_YEAR',              value: 'ALCANZÓ EXPECTATIVAS'},
      { name: 'PERFORMANCE_HOW_PREVIOUS_YEAR',               value: 'ALINEADO'           },
      { name: 'NEW_HIRE_ATTENDANCE',                         value: 'NO'                 },
      { name: 'PERCENTAGE_ATTENDANCE_DAYS_3MONTHS',          value: 0.20408163265306123  },
      { name: 'ATTENDANCE_DAYS_3MONTHS',                     value: 10.0                 },
      { name: 'CONNECTIVITY_TAG',                            value: 'MID'                },
      { name: 'EXCEPTION_FLAG_ATTENDANCE',                   value: 'NO'                 },
      { name: 'TARGET_PERCENTAGE_ATTENDANCE_DAYS_3MONTHS',   value: 0.2                  },
      { name: 'DIVISION_ATTENDANCE',                         value: 'IT'                 }
    ]}
  ]},
  { year: 2025, months: [
    { month: 1,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2025-01-31' }, { name: 'NEW_HIRE_ATTENDANCE', value: 'NO' }, { name: 'PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.24489795918367346 }, { name: 'ATTENDANCE_DAYS_3MONTHS', value: 12.0 }, { name: 'CONNECTIVITY_TAG', value: 'MID' }, { name: 'EXCEPTION_FLAG_ATTENDANCE', value: 'NO' }, { name: 'DIVISION_ATTENDANCE', value: 'IT' }, { name: 'TARGET_PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.2 }] },
    { month: 2,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2025-02-28' }, { name: 'NEW_HIRE_ATTENDANCE', value: 'NO' }, { name: 'PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.25                }, { name: 'ATTENDANCE_DAYS_3MONTHS', value: 15.0 }, { name: 'CONNECTIVITY_TAG', value: 'MID' }, { name: 'EXCEPTION_FLAG_ATTENDANCE', value: 'NO' }, { name: 'DIVISION_ATTENDANCE', value: 'IT' }, { name: 'TARGET_PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.2 }] },
    { month: 3,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2025-03-31' }, { name: 'NEW_HIRE_ATTENDANCE', value: 'NO' }, { name: 'PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.2                 }, { name: 'ATTENDANCE_DAYS_3MONTHS', value: 10.0 }, { name: 'CONNECTIVITY_TAG', value: 'NA'  }, { name: 'EXCEPTION_FLAG_ATTENDANCE', value: 'NO' }, { name: 'DIVISION_ATTENDANCE', value: 'IT' }, { name: 'TARGET_PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.2 }] },
    { month: 4,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2025-04-30' }, { name: 'NEW_HIRE_ATTENDANCE', value: 'NO' }, { name: 'PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.18                }, { name: 'ATTENDANCE_DAYS_3MONTHS', value: 9.0  }, { name: 'CONNECTIVITY_TAG', value: 'MID' }, { name: 'EXCEPTION_FLAG_ATTENDANCE', value: 'NO' }, { name: 'DIVISION_ATTENDANCE', value: 'IT' }, { name: 'TARGET_PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.2 }] },
    { month: 5,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13 }, { name: 'TIM_DATE', value: '2025-05-31' }, { name: 'NEW_HIRE_ATTENDANCE', value: 'NO' }, { name: 'PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.2                 }, { name: 'ATTENDANCE_DAYS_3MONTHS', value: 10.0 }, { name: 'CONNECTIVITY_TAG', value: 'MID' }, { name: 'EXCEPTION_FLAG_ATTENDANCE', value: 'NO' }, { name: 'DIVISION_ATTENDANCE', value: 'IT' }, { name: 'TARGET_PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.2 }] },
    { month: 6,  values: [
      { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP',        value: 12                    },
      { name: 'START_SENIORITY_DATE',                        value: '2022-03-01'          },
      { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 13                    },
      { name: 'TIM_DATE',                                    value: '2025-06-30'          },
      { name: 'NEW_HIRE_ATTENDANCE',                         value: 'NO'                 },
      { name: 'PERCENTAGE_ATTENDANCE_DAYS_3MONTHS',          value: 0.2833333333333333   },
      { name: 'ATTENDANCE_DAYS_3MONTHS',                     value: 17.0                 },
      { name: 'CONNECTIVITY_TAG',                            value: 'MID'                },
      { name: 'EXCEPTION_FLAG_ATTENDANCE',                   value: 'NO'                 },
      { name: 'DIVISION_ATTENDANCE',                         value: 'IT'                 },
      { name: 'TARGET_PERCENTAGE_ATTENDANCE_DAYS_3MONTHS',   value: 0.2                  },
      { name: 'CURRENT_YEAR_CHECK_ENG_LEADER',               value: 96.0                 },
      { name: 'CURRENT_YEAR_CHECK_TARGET_EXE_LEADER',        value: 85.0                 },
      { name: 'CURRENT_YEAR_CHECK_LEADER',                   value: 3.0024252E7          },
      { name: 'CURRENT_YEAR_CHECK_TARGET_ENG_LEADER',        value: 85.0                 },
      { name: 'CURRENT_YEAR_CHECK_EXE_LEADER',               value: 94.0                 }
    ]},
    { month: 7,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 14 }, { name: 'TIM_DATE', value: '2025-07-31' }, { name: 'NEW_HIRE_ATTENDANCE', value: 'NO' }, { name: 'PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.31666666666666665 }, { name: 'ATTENDANCE_DAYS_3MONTHS', value: 19.0 }, { name: 'CONNECTIVITY_TAG', value: 'MID' }, { name: 'EXCEPTION_FLAG_ATTENDANCE', value: 'NO' }, { name: 'DIVISION_ATTENDANCE', value: 'IT' }, { name: 'TARGET_PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.2 }] },
    { month: 8,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 14 }, { name: 'TIM_DATE', value: '2025-08-31' }, { name: 'NEW_HIRE_ATTENDANCE', value: 'NO' }, { name: 'PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.3                 }, { name: 'ATTENDANCE_DAYS_3MONTHS', value: 18.0 }, { name: 'CONNECTIVITY_TAG', value: 'MID' }, { name: 'EXCEPTION_FLAG_ATTENDANCE', value: 'NO' }, { name: 'DIVISION_ATTENDANCE', value: 'IT' }, { name: 'TARGET_PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.2 }] },
    { month: 9,  values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 14 }, { name: 'TIM_DATE', value: '2025-09-30' }, { name: 'NEW_HIRE_ATTENDANCE', value: 'NO' }, { name: 'PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.21666666666666667 }, { name: 'ATTENDANCE_DAYS_3MONTHS', value: 13.0 }, { name: 'CONNECTIVITY_TAG', value: 'MID' }, { name: 'EXCEPTION_FLAG_ATTENDANCE', value: 'NO' }, { name: 'DIVISION_ATTENDANCE', value: 'IT' }, { name: 'TARGET_PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.2 }] },
    { month: 10, values: [
      { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP',        value: 12                    },
      { name: 'START_SENIORITY_DATE',                        value: '2022-03-01'          },
      { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 14                    },
      { name: 'TIM_DATE',                                    value: '2025-10-31'          },
      { name: 'NEW_HIRE_ATTENDANCE',                         value: 'NO'                 },
      { name: 'PERCENTAGE_ATTENDANCE_DAYS_3MONTHS',          value: 0.24                 },
      { name: 'ATTENDANCE_DAYS_3MONTHS',                     value: 12.0                 },
      { name: 'CONNECTIVITY_TAG',                            value: 'MID'                },
      { name: 'EXCEPTION_FLAG_ATTENDANCE',                   value: 'NO'                 },
      { name: 'DIVISION_ATTENDANCE',                         value: 'IT'                 },
      { name: 'TARGET_PERCENTAGE_ATTENDANCE_DAYS_3MONTHS',   value: 0.2                  },
      { name: 'CURRENT_YEAR_ANNUAL_LEADER',                  value: 3.0005249E7          },
      { name: 'CURRENT_YEAR_ANNUAL_EXE_LEADER',              value: 95.0                 },
      { name: 'CURRENT_YEAR_ANNUAL_TARGET_ENG_LEADER',       value: 85.0                 },
      { name: 'CURRENT_YEAR_ANNUAL_ENG_LEADER',              value: 97.0                 },
      { name: 'CURRENT_YEAR_ANNUAL_TARGET_EXE_LEADER',       value: 85.0                 }
    ]},
    { month: 11, values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 14 }, { name: 'TIM_DATE', value: '2025-11-30' }, { name: 'NEW_HIRE_ATTENDANCE', value: 'NO' }, { name: 'PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.24 }, { name: 'ATTENDANCE_DAYS_3MONTHS', value: 11.0 }, { name: 'CONNECTIVITY_TAG', value: 'MID' }, { name: 'EXCEPTION_FLAG_ATTENDANCE', value: 'NO' }, { name: 'DIVISION_ATTENDANCE', value: 'IT' }, { name: 'TARGET_PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.2 }] },
    { month: 12, values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 14 }, { name: 'TIM_DATE', value: '2025-12-31' }, { name: 'NEW_HIRE_ATTENDANCE', value: 'NO' }, { name: 'PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.22 }, { name: 'ATTENDANCE_DAYS_3MONTHS', value: 10.0 }, { name: 'CONNECTIVITY_TAG', value: 'MID' }, { name: 'EXCEPTION_FLAG_ATTENDANCE', value: 'NO' }, { name: 'DIVISION_ATTENDANCE', value: 'IT' }, { name: 'TARGET_PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.2 }] }
  ]},
  { year: 2026, months: [
    { month: 1, values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 14 }, { name: 'TIM_DATE', value: '2026-01-31' }, { name: 'NEW_HIRE_ATTENDANCE', value: 'NO' }, { name: 'PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.18 }, { name: 'ATTENDANCE_DAYS_3MONTHS', value: 10.0 }, { name: 'CONNECTIVITY_TAG', value: 'MID' }, { name: 'EXCEPTION_FLAG_ATTENDANCE', value: 'NO' }, { name: 'DIVISION_ATTENDANCE', value: 'IT' }, { name: 'TARGET_PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.2 }] },
    { month: 2, values: [{ name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP', value: 12 }, { name: 'START_SENIORITY_DATE', value: '2022-03-01' }, { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 14 }, { name: 'TIM_DATE', value: '2026-02-28' }, { name: 'NEW_HIRE_ATTENDANCE', value: 'NO' }, { name: 'PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.2  }, { name: 'ATTENDANCE_DAYS_3MONTHS', value: 12.0 }, { name: 'CONNECTIVITY_TAG', value: 'MID' }, { name: 'EXCEPTION_FLAG_ATTENDANCE', value: 'NO' }, { name: 'DIVISION_ATTENDANCE', value: 'IT' }, { name: 'TARGET_PERCENTAGE_ATTENDANCE_DAYS_3MONTHS', value: 0.2 }] }
  ]}
];

export const executionCases = [
  { id: 'TRHS-01-SI', name: 'SI_achiever',  input_context: { ...SHARED_USER, box: 'ACHIEVER', metrics: SHARED_METRICS } }, // Generada   - box=ACHIEVER
  { id: 'TRHS-01-NO', name: 'NO_exceeder',  input_context: { ...SHARED_USER, box: 'EXCEEDER', metrics: SHARED_METRICS } }, // NO_Generada - box=EXCEEDER
];
