import request from '@/utils/request';

// 获取验证码
export default async function () {
  return await request.get('/res/captcha');
}
