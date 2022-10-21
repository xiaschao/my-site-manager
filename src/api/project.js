import request from '@/utils/request';

// 获取所有项目
export function getAllProjectsApi() {
  return request.get('/api/project');
}

// 修改项目
export function reviseProjectApi(projectId, data) {
  return request.put('/api/project/' + projectId, {
    description: data.description,
    name: data.name,
    url: data.url,
    github: data.github,
    thumb: data.thumb,
    order: data.order,
  });
}

// 新增项目
export function addProjectApi(data) {
  return request.post('/api/project', data);
}

// 删除项目
export function deleteProjectApi(projectId) {
  return request.delete('/api/project/' + projectId);
}
