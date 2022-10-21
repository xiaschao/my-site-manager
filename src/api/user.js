import request from '@/utils/request';

export function loginApi(data) {
  return request({
    url: '/api/admin/login',
    method: 'post',
    data,
  });
}

export function getInfoApi() {
  return request({
    url: '/api/admin/whoami',
    method: 'get',
  });
}

export function reviseAccountApi(data) {
  return request.put('/api/admin', data);
}
