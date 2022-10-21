import axios from 'axios';
import { Message } from 'element-ui';
import { getToken, setToken } from '@/utils/auth';

// create an axios instance
const service = axios.create({
  timeout: 5000, // request timeout
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent
    const token = getToken();
    if (token) config.headers['Authorization'] = 'Bearer ' + token;
    return config;
  },
  (error) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  (response) => {
    const token = response.headers.authentication;
    if (token) setToken(token);
    const res = response.data;
    if (res.code && res.code !== 0) {
      Message({
        message: res.msg,
        type: 'error',
      });
    }
    return res;
  },
  (error) => {
    console.log('err' + error); // for debug
    Message({
      message: error.message,
      type: 'error',
    });
    return Promise.reject(error);
  }
);

export default service;
