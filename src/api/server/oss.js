import request from '@/utils/request'
import urls from '@/utils/prefix'
export default {
  // 获取oss服务token
  token: () => {
    return request({
      url: `${urls.user}/oss/v1/token`,
      method: 'get'
    })
  }
}
