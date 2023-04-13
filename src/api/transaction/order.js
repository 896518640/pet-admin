import request from '@/utils/request'
import urls from '@/utils/prefix'
// import request from '@/utils/mock'
export default {
  // 获取预约挂号列表
  getData(params) {
    return request({
      url: `${urls.user}/order/v1/list`,
      method: 'post',
      data: params
    })
  },
  // 获取订单状态信息
  getStatus() {
    return request({
      url: `${urls.user}/order/appointment/v1/status`,
      method: 'get'
    })
  },
  // 编辑预约订单信息
  edit(params) {
    const { id } = params
    return request({
      url: `${urls.user}/order/v1/${id}`,
      method: 'put',
      data: params
    })
  },
  // 取消预约订单信息
  cancel(id) {
    return request({
      url: `${urls.user}/order/v1/cancel/${id}`,
      method: 'put'
    })
  }
}
