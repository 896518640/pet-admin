import request from '@/utils/request'

// 获取角色信息
export function getRoleList(data) {
  return request({
    url: `/role/v1/list`,
    method: 'post',
    data
  })
}

// 添加角色信息
export function addRole(data) {
  return request({
    url: `/role/v1`,
    method: 'post',
    data
  })
}

// 修改角色信息
export function editRole(data) {
  const { id } = data
  return request({
    url: `/role/v1/${id}`,
    method: 'put',
    data
  })
}

// 获取角色详情
export function getRoleInfo(id) {
  return request({
    url: `/role/v1/${id}`,
    method: 'get'
  })
}

// 分配权限
export function assignPermission(data) {
  const { id } = data
  return request({
    url: `/role/v1/${id}/permission`,
    method: 'post',
    data
  })
}

// 更新权限
export function updatePermission(data) {
  const { id } = data
  return request({
    url: `/role/v1/${id}/permission`,
    method: 'patch',
    data
  })
}

// 删除角色信息
export function delRole(id) {
  return request({
    url: `/role/v1/${id}`,
    method: 'delete'
  })
}

// 修改角色状态
export function editRoleStatus(data) {
  const { id, action } = data
  return request({
    url: `/role/v1/${id}/${action}`,
    method: 'put',
    data
  })
}
