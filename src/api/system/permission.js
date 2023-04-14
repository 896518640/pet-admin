import request from '@/utils/request'
// 获取权限树
export function getPermissionTree(query) {
  return request({
    url: `/permission/v1/tree`,
    method: 'get',
    params: query
  })
}

// 查询权限列表
export function getPermissionList(data) {
  return request({
    url: `/permission/v1/list`,
    method: 'post',
    data
  })
}

// 添加权限信息
export function addPermission(data) {
  return request({
    url: `/permission/v1`,
    method: 'post',
    data
  })
}

// 修改权限信息
export function editPermission(data) {
  const { id } = data
  return request({
    url: `/permission/v1/${id}`,
    method: 'put',
    data
  })
}

// 删除权限信息
export function delPermission(id) {
  return request({
    url: `/permission/v1/${id}`,
    method: 'delete'
  })
}

// 修改权限状态
export function editPermissionStatus(data) {
  const { id, action } = data
  return request({
    url: `/permission/v1/${id}/${action}`,
    method: 'put',
    data
  })
}
