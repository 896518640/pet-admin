// 真实接口
import request from '@/utils/request'
export default {
  // 部门列表
  department: (data) => {
    return request({
      url: `/department/v1/list`,
      method: 'post',
      data
    })
  },
  // 部门详情
  detail: (id) => {
    return request({
      url: `/department/v1/${id}`,
      method: 'get'
    })
  },
  // 编辑
  edit: (data) => {
    const { id } = data
    return request({
      url: `/department/v1/${id}`,
      method: 'put',
      data
    })
  },
  // 新增部门
  add: (data) => {
    return request({
      url: `/department/v1`,
      method: 'post',
      data
    })
  },
  // 删除部门
  del: (id) => {
    return request({
      url: `/department/v1/${id}`,
      method: 'delete'
    })
  },
  // 获取部门员工
  employee: (id) => {
    return request({
      url: `/department/v1/${id}/employee`,
      method: 'get'
    })
  },
  // 新增部门员工
  addEmployee: (data) => {
    const { departmentId } = data
    return request({
      url: `/department/v1/${departmentId}/employee`,
      method: 'post',
      data
    })
  }
}
