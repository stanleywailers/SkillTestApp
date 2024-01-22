import { create } from 'apisauce'

const base_url = '/api/v1';

export const api = create({
    baseURL: base_url,
    headers: {
        Accept: 'application/json',
        'content-type': 'application/json',
      },

});