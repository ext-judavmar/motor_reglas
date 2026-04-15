// ─── IntAPI test cases ────────────────────────────────────────────────────────
// Endpoint: /fpsIntegrationSMU/bulk-execution
// Payload : { process, smu_context_list: [{ user, context: { box } }] }

export const intApiCases = [
  { id: 'TR-3179', user: '1155',      box: 'OUTLIER'          }, // Generada    - 2Condiciones_Outlier
  { id: 'TR-3180', user: '2294',      box: 'TOO SOON TO RATE' }, // NO_Generada - 2Condiciones_TooSoonToRate
  { id: 'TR-3181', user: '30035517',  box: 'UP AND COMER'     }, // Generada    - What_UpAndComer
  { id: 'TR-3182', user: '50052',     box: 'EXCEEDER'         }, // Generada    - How_Exceeder
  { id: 'TR-3189', user: '30010678',  box: 'UP AND COMER'     }, // Generada    - 2Condiciones_UpAndComer
  { id: 'TR-3190', user: '30048953',  box: 'TOO SOON TO RATE' }, // Generada    - 2Condiciones_TooSoonToRate
  { id: 'TR-3191', user: '30097306',  box: 'EXCEEDER'         }, // Generada    - 2Condiciones_Exceeder
  { id: 'TR-3192', user: '30030634',  box: 'ACHIEVER'         }, // Generada    - 2Condiciones_Achiever
  { id: 'TR-3193', user: '2429',      box: 'OUTLIER'          }, // NO_Generada - 2Condiciones_Outlier
  { id: 'TR-3194', user: '2741',      box: 'EXCEEDER'         }, // NO_Generada - 2Condiciones_Exceeder
  { id: 'TR-3195', user: '30002566',  box: 'ACHIEVER'         }, // NO_Generada - 2Condiciones_Achiever
  { id: 'TR-3196', user: '30003279',  box: 'UP AND COMER'     }, // NO_Generada - 2Condiciones_UpAndComer
  { id: 'TR-3197', user: '30006034',  box: 'TOO SOON TO RATE' }, // NO_Generada - 2Condiciones_TooSoonToRate
  { id: 'TR-3198', user: '30006443',  box: null               }, // NO_Generada - NoBox (empty context)
];

// ─── Execution test cases ─────────────────────────────────────────────────────
// Endpoint: /reglas/bulk/env-test/headsup/global-smu-prod
// Payload : { input_context: { userId, firstName, lastName, hireDate, box, metrics } }
//
// Both cases share the same user and metrics structure.
// Only PERFORMANCE_WHAT_LAST_YEAR and PERFORMANCE_HOW_LAST_YEAR differ.

const SHARED_USER = {
  userId: 30035517, firstName: 'PETHRA', lastName: 'VARGAS FERRAZ',
  hireDate: '2022-01-17', box: 'ACHIEVER'
};

function buildMetrics(performanceWhat, performanceHow) {
  return [
    { year: 2025, months: [{ month: 12, values: [
      { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP',        value: 16            },
      { name: 'START_SENIORITY_DATE',                        value: '2022-01-17'  },
      { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 18            },
      { name: 'TIM_DATE',                                    value: '2025-12-31'  },
      { name: 'COUNT_TURNOVER_VOLUNTARY_NON_OPS_YTD',        value: 10.0          },
      { name: 'EXCEPTION_FLAG_ATTENDANCE',                   value: 'NO'          },
      { name: 'PERFORMANCE_HOW_LAST_YEAR',                   value: performanceHow  },
      { name: 'ALERT_CONECTIVITY_COUNT',                     value: 2.0           },
      { name: 'TURNOVER_VOLUNTARY_NON_OPS_DIRECT',           value: 0.0           },
      { name: 'ALERT_ATTENDANCE_COUNT',                      value: 3.0           },
      { name: 'HEADCOUNT_AVG_YTD',                           value: 75.0          },
      { name: 'TARGET_PERCENTAGE_ATTENDANCE_DAYS_3MONTHS',   value: 0.4           },
      { name: 'DIVISION_ATTENDANCE',                         value: 'MARKETING'   },
      { name: 'COUNT_TURNOVER_VOLUNTARY_NON_OPS_DIRECT_YTD', value: 0.0           },
      { name: 'TURNOVER_VOLUNTARY_YTD',                      value: 13.3          },
      { name: 'CONNECTIVITY_TAG',                            value: 'NA'          },
      { name: 'ANNUAL_SALARY_STATUS_PENDING',                value: 'TRUE'        },
      { name: 'PERCENTAGE_ATTENDANCE_DAYS_3MONTHS',          value: 0.42          },
      { name: 'TURNOVER_VOLUNTARY_NON_OPS_YTD',              value: 13.3          },
      { name: 'ATTENDANCE_DAYS_3MONTHS',                     value: 24.0          },
      { name: 'TARGET_NON_OPS_MONTH',                        value: 7.0           },
      { name: 'COUNT_TURNOVER_VOLUNTARY_NON_OPS',            value: 2.0           },
      { name: 'NEW_HIRE_ATTENDANCE',                         value: 'NO'          },
      { name: 'ANNUAL_SALARY_ABOVE_BUDGET',                  value: 'TRUE'        },
      { name: 'PERFORMANCE_WHAT_LAST_YEAR',                  value: performanceWhat },
      { name: 'HEADCOUNT_DIRECT_AVG_YTD',                    value: 6.5           },
      { name: 'ANNUAL_SALARY_LAST_UPDATE',                   value: '2026-01-22'  }
    ]}]},
    { year: 2026, months: [
      { month: 1, values: [
        { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP',        value: 16           },
        { name: 'START_SENIORITY_DATE',                        value: '2022-01-17' },
        { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 18           },
        { name: 'TIM_DATE',                                    value: '2026-01-31' },
        { name: 'TURNOVER_VOLUNTARY_NON_OPS_YTD',              value: 1.3          },
        { name: 'ALERT_CONECTIVITY_COUNT',                     value: 0.0          },
        { name: 'TARGET_PERCENTAGE_ATTENDANCE_DAYS_3MONTHS',   value: 0.4          },
        { name: 'DIVISION_ATTENDANCE',                         value: 'MARKETING'  },
        { name: 'EXCEPTION_FLAG_ATTENDANCE',                   value: 'NO'         },
        { name: 'COUNT_TURNOVER_VOLUNTARY_NON_OPS_DIRECT_YTD', value: 0.0          },
        { name: 'CONNECTIVITY_TAG',                            value: 'NA'         },
        { name: 'PERCENTAGE_ATTENDANCE_DAYS_3MONTHS',          value: 0.37         },
        { name: 'COUNT_TURNOVER_VOLUNTARY_NON_OPS_YTD',        value: 1.0          },
        { name: 'HEADCOUNT_AVG_YTD',                           value: 80.0         },
        { name: 'HEADCOUNT_DIRECT_AVG_YTD',                    value: 5.0          },
        { name: 'NEW_HIRE_ATTENDANCE',                         value: 'NO'         },
        { name: 'ALERT_ATTENDANCE_COUNT',                      value: 4.0          },
        { name: 'TURNOVER_VOLUNTARY_YTD',                      value: 1.3          },
        { name: 'TURNOVER_VOLUNTARY_NON_OPS_DIRECT',           value: 0.0          },
        { name: 'TARGET_NON_OPS_MONTH',                        value: 0.6          },
        { name: 'COUNT_TURNOVER_VOLUNTARY_NON_OPS',            value: 1.0          },
        { name: 'ATTENDANCE_DAYS_3MONTHS',                     value: 17.0         }
      ]},
      { month: 2, values: [
        { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP',        value: 16           },
        { name: 'START_SENIORITY_DATE',                        value: '2022-01-17' },
        { name: 'JOB_CLASSIFICATION_EQUIVALENCE_GROUP_LEADER', value: 18           },
        { name: 'TIM_DATE',                                    value: '2026-02-28' },
        { name: 'CONNECTIVITY_TAG',                            value: 'NA'         },
        { name: 'CURRENT_YEAR_TR_ASSESSMENT',                  value: 'ALERT'      },
        { name: 'DIVISION_ATTENDANCE',                         value: 'MARKETING'  },
        { name: 'TARGET_NON_OPS_MONTH',                        value: 1.2          },
        { name: 'COUNT_TURNOVER_VOLUNTARY_NON_OPS_DIRECT_YTD', value: 0.0          },
        { name: 'ALERT_ATTENDANCE_COUNT',                      value: 7.0          },
        { name: 'PERCENTAGE_ATTENDANCE_DAYS_3MONTHS',          value: 0.37         },
        { name: 'HEADCOUNT_DIRECT_AVG_YTD',                    value: 5.0          },
        { name: 'NEW_HIRE_ATTENDANCE',                         value: 'NO'         },
        { name: 'ALERT_CONECTIVITY_COUNT',                     value: 1.0          },
        { name: 'COUNT_TURNOVER_VOLUNTARY_NON_OPS',            value: 0.0          },
        { name: 'HEADCOUNT_AVG_YTD',                           value: 80.5         },
        { name: 'TARGET_PERCENTAGE_ATTENDANCE_DAYS_3MONTHS',   value: 0.4          },
        { name: 'TURNOVER_VOLUNTARY_YTD',                      value: 1.2          },
        { name: 'PREVIOUS_2_YEARS_TR_ASSESSMENT',              value: 'ACHIEVER'   },
        { name: 'TURNOVER_VOLUNTARY_NON_OPS_DIRECT',           value: 0.0          },
        { name: 'COUNT_TURNOVER_VOLUNTARY_NON_OPS_YTD',        value: 1.0          },
        { name: 'EXCEPTION_FLAG_ATTENDANCE',                   value: 'NO'         },
        { name: 'ATTENDANCE_DAYS_3MONTHS',                     value: 17.0         },
        { name: 'TURNOVER_VOLUNTARY_NON_OPS_YTD',              value: 1.2          },
        { name: 'PREVIOUS_YEAR_TR_ASSESSMENT',                 value: 'ACHIEVER'   }
      ]}
    ]}
  ];
}

export const executionCases = [
  { id: 'TR-3199', input_context: { ...SHARED_USER, metrics: buildMetrics('NO ALCANZÓ EXPECTATIVAS', 'ALINEADO')    } }, // Generada
  { id: 'TR-3200', input_context: { ...SHARED_USER, metrics: buildMetrics('ALCANZÓ EXPECTATIVAS',    'alineado')    } }, // NO_Generada
];
