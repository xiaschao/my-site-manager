import request from '@/utils/request.js';

export function getAboutUrlApi() {
  return request.get('/api/about');
}

export function setAboutUrlApi(url) {
  return request.post('/api/about', { url });
}
