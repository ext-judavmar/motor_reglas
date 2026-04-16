import http from 'k6/http';
import { sleep } from 'k6';
import { getOptions, checkResponse } from '../generalfunctions/k6functions.js';

export let options = getOptions();

export default function () {
  const response = http.get("https://pokeapi.co/api/v2/pokemon/ditto", 
    {headers: {Accepts: "application/json"}});
  checkResponse(response);
  sleep(.300);
};