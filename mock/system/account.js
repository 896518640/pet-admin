const Mock = require('mockjs')
// 模拟数据列表
const List = []
// 模拟数据的数量
const count = 100
// 拓展mockjs 模拟手机号
Mock.Random.extend({
  phone: function() {
    const phonePrefixs = ['132', '135', '189'] // 自己写前缀哈
    return this.pick(phonePrefixs) + Mock.mock(/\d{8}/) // Number()
  }
})
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    'account': `@name(3,5)`,
    'icon': Mock.Random.image('100x100', '#FF6600'),
    'name': '@cname(2,3)',
    'phone': '@phone',
    'roles': ['admin', 'super_admin'],
    'status|1': [1, 0]
  }))
}

module.exports = [
  {
    url: '/account/v1/list',
    method: 'get',
    response: config => {
      const {
        account,
        status,
        phone,
        pageNum = 1,
        pageSize = 10,
        sortKey
      } = config.query
      console.log(config.query)
      console.log(List)
      let mockList = List.filter(item => {
        if (account && account !== item.account) return false
        if (status && status !== item.status) return false
        if (phone && phone !== item.phone) return false
        return true
      })
      console.log(mockList)
      // 默认按照create_time 字段返回
      if (sortKey && sortKey[0].sort === 'desc') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < pageSize * pageNum && index >= pageSize * (pageNum - 1))

      return {
        code: 0,
        message: 'success',
        data: {
          list: pageList,
          total: mockList.length,
          pageNum,
          pageSize
        }
      }
    }
  },
  { // 新增账户
    url: '/account/v1',
    type: 'post',
    response: _ => {
      return {
        code: 0,
        data: 'success'
      }
    }
  },
  { // 修改账号信息
    url: '/account/v1/[1-9a-zA-Z]/',
    type: 'put',
    response: _ => {
      return {
        code: 0,
        data: 'success'
      }
    }
  },
  { // 删除
    url: '/account_api/account/v1/[1-9]/',
    type: 'delete',
    response: _ => {
      return {
        code: 0,
        data: 'success'
      }
    }
  },
  { // 修改账号状态
    url: /^\/account_api\/account\/v1\/(.*)\/(.*)$/,
    method: 'put',
    response: _ => {
      return {
        code: 0,
        data: 'success'
      }
    }
  },
  { // 重置账号密码
    url: /^\/account_api\/account\/v1\/(.*)\/password$/,
    method: 'put',
    response: _ => {
      return {
        code: 0,
        data: 'success'
      }
    }
  },
  { // 分配角色
    url: /^\/account_api\/account\/v1\/(.*)\/role$/,
    method: 'post',
    response: _ => {
      return {
        code: 0,
        data: 'success'
      }
    }
  }
]

