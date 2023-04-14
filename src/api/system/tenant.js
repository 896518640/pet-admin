import request from '@/utils/request'
// import urls from '@/utils/prefix'
// 获取租户信息
export function getTenantList(data) {
  return request({
    url: `/tenant/v1/list`,
    method: 'post',
    data
  })
}

// 添加租户信息
export function addTenant(data) {
  return request({
    url: `/tenant/v1`,
    method: 'post',
    data
  })
}

// 编辑租户信息
export function editTenant(data) {
  const { id } = data
  return request({
    url: `/tenant/v1/${id}`,
    method: 'put',
    data
  })
}

// 删除租户信息
export function delTenant(data) {
  const { id } = data
  return request({
    url: `/tenant/v1/${id}`,
    method: 'delete'
  })
}

// 审核租户状态/禁用租户状态
export function editTenantStatus(data) {
  const { action, id } = data
  return request({
    url: `/tenant/v1/${id}/${action}`,
    method: 'put',
    data
  })
}

// 新增租户服务
export function addTenantServer(data) {
  const { id } = data
  return request({
    url: `/tenant/v1/${id}/server`,
    method: 'post',
    data
  })
}

// 修改租户服务
export function editTenantServer(data) {
  const { id } = data
  return request({
    url: `/tenant/v1/${id}/server`,
    method: 'put',
    data
  })
}
