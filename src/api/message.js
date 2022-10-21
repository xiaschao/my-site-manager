import request from '@/utils/request.js';

// 删除留言
export function deleteMessageApi(messageId) {
  return request.delete('/api/message/' + messageId);
}

// 分页获取留言
export function getMessagesApi(config) {
  return request.get('/api/message', {
    params: {
      page: config.page,
      limit: config.limit,
      keyword: config.keyword,
    },
  });
}
