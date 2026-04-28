/**
 * api/questions.js
 * Questions API calls.
 */

import client from './client';

export const questionsApi = {
  list: (params) => client.get('/questions', { params }),
  get: (id) => client.get(`/questions/${id}`),
};
