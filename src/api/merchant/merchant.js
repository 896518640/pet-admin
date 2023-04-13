// 真实接口
import request from '@/utils/request'
import urls from '@/utils/prefix'
export default {
  // 商家列表
  merchant: (data) => {
    return request({
      url: `${urls.user}/v1/list`,
      method: 'post',
      data
    })
  },
  // 商家详情
  detail: (id) => {
    return request({
      url: `${urls.user}/v1/${id}`,
      method: 'get'
    })
  },
  // 编辑
  edit: (data) => {
    const { id } = data
    return request({
      url: `${urls.user}/v1/${id}`,
      method: 'put',
      data
    })
  },
  // 新增商家
  add: (data) => {
    return request({
      url: `${urls.user}/v1`,
      method: 'post',
      data
    })
  },
  // 删除商家
  del: (id) => {
    return request({
      url: `${urls.user}/v1/${id}`,
      method: 'delete'
    })
  },
  // 获取商家部门
  department: (id) => {
    return request({
      url: `${urls.user}/v1/${id}/department`,
      method: 'get'
    })
  },
  // 新增商家部门
  addDepartment: (id) => {
    return request({
      url: `${urls.user}/v1/${id}/department`,
      method: 'post'
    })
  },
  certification: (data) => {
    return request({
      url: `${urls.user}/v1/certification`,
      method: 'post',
      data
    })
  }
}
