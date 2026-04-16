import { SharedArray } from 'k6/data';

// Loads all eligible users from CSV once at init time, shared across all VUs.
// Source: testdata/tr_elegible.csv (23k+ user_SSFF_IDs)
export const eligibleUsers = new SharedArray('eligibleUsers', function () {
  return open('/testdata/tr_elegible.csv')
    .split('\n')
    .slice(1)                            // skip header row
    .filter(line => line.trim() !== '')  // remove empty lines
    .map(line => line.replace(/"/g, '').trim());
});
