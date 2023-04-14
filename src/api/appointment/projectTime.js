// 真实接口
import request from '@/utils/request'
export default {
  // 获取预约时间列表
  getData: (params) => {
    return request({
      url: `/appointment/v1/list`,
      method: 'post',
      data: params
    })
  },
  // 获取可预约几天后的时间
  getAbleTime: (params) => {
    const { tenantId } = params
    return request({
      url: `/appointment/v1/appointmentDate/${tenantId}`,
      method: 'get'
    })
  },
  // 修改可预约几天后的时间
  setAbleTime: (params) => {
    const { tenantId, ableTime } = params
    return request({
      url: `/appointment/v1/appointmentDate/${tenantId}/${ableTime}`,
      method: 'put'
    })
  },
  // 新增预约时间列表
  add: (params) => {
    return request({
      url: `/appointment/v1`,
      method: 'post',
      data: params
    })
  },
  // 批量修改预约时间
  batchTime: (params) => {
    return request({
      url: `/appointment/v1/appointmentDate/ids`,
      method: 'put',
      data: params
    })
  },
  // 编辑预约时间列表
  edit: (params) => {
    // const { id } = params
    return request({
      url: `/appointment/v1`,
      method: 'put',
      data: params
    })
  },
  // 删除预约时间列表
  del: (id) => {
    return request({
      url: `/appointment/v1/${id}`,
      method: 'delete'
    })
  },
  // 批量修改预约周期
  batchCircle: (params) => {
    return request({
      url: `/appointment/v1/appointmentRecurrence/ids`,
      method: 'put',
      data: params
    })
  }
}
