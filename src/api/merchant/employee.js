// 真实接口
import request from '@/utils/request'
import urls from '@/utils/prefix'
export default {
  // 员工列表
  employee: (data) => {
    return request({
      url: `${urls.user}/employee/v1/list`,
      method: 'post',
      data
    })
  },
  // 员工详情
  detail: (id) => {
    return request({
      url: `${urls.user}/employee/v1/${id}`,
      method: 'get'
    })
  },
  // 编辑员工
  edit: (data) => {
    const { id } = data
    return request({
      url: `${urls.user}/employee/v1/${id}`,
      method: 'put',
      data
    })
  },
  // 新增员工
  add: (data) => {
    return request({
      url: `${urls.user}/employee/v1`,
      method: 'post',
      data
    })
  },
  // 删除员工
  del: (id) => {
    return request({
      url: `${urls.user}/employee/v1/${id}`,
      method: 'delete'
    })
  }
}
