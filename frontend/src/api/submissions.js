/**
 * api/submissions.js
 * Submissions & user progress API calls.
 */

import client from './client';

export const submissionsApi = {
  submit: (data) => client.post('/submit', data),
  getProgress: () => client.get('/user/progress'),
  getProfile: () => client.get('/user/profile'),
};
