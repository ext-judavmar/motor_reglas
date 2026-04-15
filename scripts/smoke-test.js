import http from 'k6/http';
import { check, sleep } from "k6";
import { getOptions } from '../generalfunctions/k6functions.js';

export let options = getOptions();

export default function () {
  const response = http.get("https://pokeapi.co/api/v2/pokemon/ditto", 
    {headers: {Accepts: "application/json"}});
  check(response, { "status is 200": (r) => r.status === 200 });
  sleep(.300);
};