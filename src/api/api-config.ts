import { create } from 'apisauce'
import Resources from '../constanst/Resources';

const base_url = '/api/v1';

export const api = create({
    baseURL: base_url,
    headers: {
        Accept: 'application/json',
        'content-type': 'application/json',
        'X-Finnhub-Token':Resources.FinnhubApiKey
      },

});