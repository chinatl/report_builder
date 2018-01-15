import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import MD5 from 'js-md5';
const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = '';

const handleErrors = err => {
  return err;
};

const responseBody = res => res.body;

const tokenPlugin = req => {
  req.set('authorization', `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIxNjEwMDQxMiIsInN5cyI6ImVjayIsImV4cCI6MTQ5NzM0MDg5NzUxM30.ewgPR1J7c0fdrSQpZW4BEPlR9itfoz1l-5UP6LDn6Ls`);
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
      .post(`${API_ROOT}${url}`,body)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody),
};
const Auth = {
  login: (email, password) =>
    requests.post('/api/eck/test/users/validate', { 'id': email, "password" : MD5(password)})
    ,
  register: (username, email, password) =>
    requests.post('/users', { user: { username, email, password } }),
  save: user =>
    requests.put('/user', { user })
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
const Tables = {
	post:(url,param)=>
	 	requests.post(url, param)
}
export default {
  Reports,
  ReportParams,
  Auth,
  Tables
};