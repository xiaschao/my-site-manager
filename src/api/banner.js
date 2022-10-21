import request from '@/utils/request.js';

export function getBannersApi() {
  return request.get('/api/banner');
}

export function editBannersApi(banners) {
  return request.post('/api/banner', banners);
}
