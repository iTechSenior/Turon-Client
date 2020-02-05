import axios from 'axios';
import _ from 'lodash';
import jwt_decode from 'jwt-decode';

const api = process.env.REACT_APP_CONTACTS_API_URL;

const getHeaders = () => {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  if(localStorage.getItem('token')){
    headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
  }

  return headers;
}

export const getMyProfile = () => axios({
  url: `${api}/me`,
  method: 'GET',
  headers: getHeaders()
}).catch((e) => {
    throw Error(e.response && e.response.data && e.response.data.message ? e.response.data.message : e.message)
});

export const request2faToken = () => axios({
  url: `${api}/me/2fa`,
  method: 'GET',
  headers: getHeaders()
}).catch((e) => {
  throw Error(e.response && e.response.data && e.response.data.message ? e.response.data.message : e.message)
});

export const confirm2faToken = (token) => axios({
  url: `${api}/me/2fa`,
  method: 'POST',
  data: {token},
  headers: getHeaders()
}).catch((e) => {
  throw Error(e.response && e.response.data && e.response.data.message ? e.response.data.message : e.message)
});

export const login = payload => axios({
  url: `${api}/auth/login`,
  method: 'POST',
  headers: getHeaders(),
  data: payload
}).catch((e) => {
  throw Error(e.response && e.response.data && e.response.data.message ? e.response.data.message : e.message)
});

export const signup = payload => axios({
  url: `${api}/auth/signup`,
  method: 'POST',
  headers: getHeaders(),
  data: payload
}).catch((e) => {
  throw Error(e.response && e.response.data && e.response.data.message ? e.response.data.message : e.message)
});

export const update = payload => axios({
  url: `${api}/me/update`,
  method: 'PUT',
  headers: getHeaders(),
  data: payload
}).catch((e) => {
  throw Error(e.response && e.response.data && e.response.data.message ? e.response.data.message : e.message)
});

export const getColleges = () => axios({
  url: `${api}/college`,
  method: 'GET',
  headers: getHeaders()
}).catch((e) => {
  throw Error(e.response && e.response.data && e.response.data.message ? e.response.data.message : e.message)
});

export const getTutors = ({query = '', schools = '', limit = 100, filters = {}}) => {
  const filtersQuery = Object.entries(filters).map(([key, val]) => {
    if(key === 'schedule'){
      const scheduleString = _.join(_.map(val, v => v.unavailable ? '-' : `${v.startTime}-${v.endTime}`), '|');
      return `${key}=${scheduleString}`;
    }
    return `${key}=${val}`;
  }).join('&');

  return axios({
    url: `${api}/tutors?q=${query}&schools=${schools}&limit=${limit}&${filtersQuery}`,
    method: 'GET',
    headers: getHeaders()
  }).catch((e) => {
    throw Error(e.response && e.response.data && e.response.data.message ? e.response.data.message : e.message)
  });
}

export const getTutor = (id) => axios({
  url: `${api}/tutors/${id}`,
  method: 'GET',
  headers: getHeaders()
}).catch((e) => {
  throw Error(e.response && e.response.data && e.response.data.message ? e.response.data.message : e.message)
});

export const getReviews = (id) => axios({
  url: `${api}/reviews/${id}`,
  method: 'GET',
  headers: getHeaders()
}).catch((e) => {
  throw Error(e.response && e.response.data && e.response.data.message ? e.response.data.message : e.message)
})

export const postReview = (id, review) => axios({
  url: `${api}/reviews/${id}`,
  method: 'POST',
  headers: getHeaders(),
  data: review
}).catch((e) => {
  throw Error(e.response && e.response.data && e.response.data.message ? e.response.data.message : e.message)
});

export const deleteTutor = (data) => axios({
  url: `${api}/tutors/${data}`,
  method: 'DELETE',
  headers: getHeaders()
}).catch((e) => {
  throw Error(e.response && e.response.data && e.response.data.message ? e.response.data.message : e.message)
});

export const becomeTutor = (id, data) => axios({
  url: `${api}/tutors/${id}`,
  method: 'POST',
  headers: getHeaders(),
  data: data
}).catch((e) => {
  throw Error(e.response && e.response.data && e.response.data.message ? e.response.data.message : e.message)
});

export const getSubjects = (data) => axios({
  url: `${api}/subjects/?q=${data}`,
  method: 'GET',
  headers: getHeaders()
}).catch((e) => {
  throw Error(e.response && e.response.data && e.response.data.message ? e.response.data.message : e.message)
});

export const getCoursesBySubject = (data) => axios({
  url: `${api}/subjects/${data}`,
  method: 'GET',
  headers: getHeaders()
}).catch((e) => {
  throw Error(e.response && e.response.data && e.response.data.message ? e.response.data.message : e.message)
});

export const getCoursesByTeacherId = (data) => axios({
  url: `${api}/tutors/${data}/courses`,
  method: 'GET',
  headers: getHeaders()
}).catch((e) => {
  throw Error(e.response && e.response.data && e.response.data.message ? e.response.data.message : e.message)
});

export const postDemoRequest = (data) => axios({
  url: `${api}/demo`,
  method: 'POST',
  headers: getHeaders(),
  data: data
}).catch((e) => {
  throw Error(e.response && e.response.data && e.response.data.message ? e.response.data.message : e.message)
});

export const createSession = (data) => axios({
  url: `${api}/sessions`,
  method: 'POST',
  headers: getHeaders(),
  data: data
}).catch((e) => {
  throw Error(e.response && e.response.data && e.response.data.message ? e.response.data.message : e.message)
});

export const getSessions = () => axios({
  url: `${api}/sessions`,
  method: 'GET',
  headers: getHeaders()
}).catch((e) => {
  throw Error(e.response && e.response.data && e.response.data.message ? e.response.data.message : e.message)
});

export const getSession = (id) => axios({
  url: `${api}/sessions/${id}`,
  method: 'GET',
  headers: getHeaders()
}).catch((e) => {
  throw Error(e.response && e.response.data && e.response.data.message ? e.response.data.message : e.message)
});

export const updateSession = (id, data) => axios({
  url: `${api}/sessions/${id}`,
  data: data,
  method: 'PUT',
  headers: getHeaders()
}).catch((e) => {
  throw Error(e.response && e.response.data && e.response.data.message ? e.response.data.message : e.message)
});

export const acceptSession = (id, data) => axios({
  url: `${api}/sessions/${id}/accept`,
  data: data,
  method: 'POST',
  headers: getHeaders()
}).catch((e) => {
  throw Error(e.response && e.response.data && e.response.data.message ? e.response.data.message : e.message)
});

export const cancelSession = (id) => axios({
  url: `${api}/sessions/${id}/cancel`,
  method: 'POST',
  headers: getHeaders()
}).catch((e) => {
  throw Error(e.response && e.response.data && e.response.data.message ? e.response.data.message : e.message)
});

export const createToken = () => axios({
  url: `${api}/transactions`,
  method: 'GET',
  headers: getHeaders()
}).catch((e) => {
  throw Error(e.response && e.response.data && e.response.data.message ? e.response.data.message : e.message)
});

export const getPayments = () => axios({
  url: `${api}/transactions/payments`,
  method: 'GET',
  headers: getHeaders()
}).catch((e) => {
  throw Error(e.response && e.response.data && e.response.data.message ? e.response.data.message : e.message)
});

export const requestPayout = () => axios({
  url: `${api}/transactions/payout`,
  method: 'GET',
  headers: getHeaders()
}).catch(e => {
  throw Error(e.response && e.response.data && e.response.data.message ? e.response.data.message : e.message)
})

export const getPaid = (data) => axios({
  url: `${api}/transactions/payout`,
  method: 'POST',
  data: data,
  headers: getHeaders()
}).catch(e => {
  throw Error(e.response && e.response.data && e.response.data.message ? e.response.data.message : e.message)
})