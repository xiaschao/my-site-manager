import request from '@/utils/request';

export function getGlobalSettingApi() {
  return request.get('/api/setting');
}

export function setGlobalSettingApi(config) {
  return request.put('/api/setting', config);
}
