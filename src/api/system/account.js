import request from '@/utils/request'
// 查询账号信息
export function getAccountList(params) {
  return request({
    url: `/account/v1/list`,
    method: 'post',
    data: params
  })
}

// 添加账号信息
export function addAccount(data) {
  return request({
    url: `/account/v1`,
    method: 'post',
    data
  })
}

// 修改账号信息
export function editAccount(data) {
  const { id } = data
  return request({
    url: `/account/v1/${id}`,
    method: 'put',
    data
  })
}

// 删除账号信息
export function delAccount(id) {
  return request({
    url: `/account/v1/${id}`,
    method: 'delete'
  })
}

// 修改账号状态
export function editAccountStatus(data) {
  const { id, action } = data
  return request({
    url: `/account/v1/${id}/${action}`,
    method: 'put',
    data
  })
}

// 重置账号密码
export function resetAccountPassword(data) {
  const { id } = data
  return request({
    url: `/account/v1/${id}/password`,
    method: 'put',
    data
  })
}

// 分配角色
export function AssignRoles(data) {
  const { id } = data
  return request({
    url: `/account/v1/${id}/role`,
    method: 'post',
    data
  })
}

// 获取用户信息
export function getInfo(token) {
  return request({
    url: `/account/v1/info`,
    method: 'get'
    // params: { token }
  })
}

// 获取角色信息
export function getRoles() {
  return request({
    url: `/role/v1/assignable`,
    method: 'get'
  })
}

