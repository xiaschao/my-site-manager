import request from '@/utils/request.js';

// 添加分类
export function addBlogTypeApi(info) {
  return request.post('/api/blogtype', info);
}

// 获取一个分类
export function getBlogTypeApi(blogId) {
  return request.get('/api/blogtype/' + blogId);
}

// 删除分类
export function deleteBlogTypeApi(blogId) {
  return request.delete('/api/blogtype/' + blogId);
}

// 修改分类
export function reviseBlogTypeApi(data) {
  return request.put('/api/blogtype/' + data.typeId, {
    name: data.name,
    order: data.order,
  });
}

// 获取所有分类
export function getAllBlogTypeApi() {
  return request.get('/api/blogtype');
}

// 发布文章
export function publishBlogApi(content) {
  return request.post('/api/blog', content);
}

// 修改文章
export function reviseBlogApi(blogId, blogContent) {
  return request.put('/api/blog/' + blogId, blogContent);
}

// 删除文章
export function deleteBlogApi(blogId) {
  return request.delete('/api/blog/' + blogId);
}

// 分页获取文章
export function getBlogApi(config) {
  return request.get('/api/blog', {
    params: {
      page: config.page,
      limit: config.limit,
      keyword: config.keyword,
      categoryId: config.categoryId,
    },
  });
}

// 获取单个文章
export function getSingleBlogApi(blogId) {
  return request.get('/api/blog/' + blogId);
}

// 删除评论
export function deleteCommentApi(commentId) {
  return request.delete('/api/comment/' + commentId);
}

// 分页获取评论
export function getCommentsApi(config) {
  return request.get('/api/comment', {
    params: {
      page: config.page,
      limit: config.limit,
      blogid: config.blogId,
      keyword: config.keyword,
    },
  });
}
