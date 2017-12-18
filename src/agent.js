import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = '/';

const handleErrors = err => {
  return err;
};

const responseBody = res => res.body;

const tokenPlugin = req => {
  req.set('authorization', `Token`);
};

const requests = {
  del: url =>
    superagent
      .del(`${API_ROOT}${url}`)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody),
  get: url =>
    superagent
      .get(`${API_ROOT}${url}`)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody),
  put: (url, body) =>
    superagent
      .put(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody),
  post: (url, body) =>
    superagent
      .post(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody),
};


const Reports = {
  create: report =>
    requests.post('/reports', { report }),
  delete: reportId =>
    requests.del(`/reports/${reportId}`),
  get: reportId =>
    requests.get(`/reports/${reportId}`),
  update: report =>
    requests.put(`/reports/${report.id}`, { report }),
};

const ReportParams = {
  create: (reportId, param) =>
    requests.post(`/reports/${reportId}/params`, { param }),
  delete: (reportId, paramId) =>
    requests.del(`/reports/${reportId}/params/${paramId}`),
  getAll: reportId =>
    requests.get(`/reports/${reportId}/params`),
  update: (reportId, param) =>
    requests.put(`/reports/${reportId}/params/${param.id}`, { param }),
};

export default {
  Reports,
  ReportParams,
};