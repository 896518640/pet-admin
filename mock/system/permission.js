const Mock = require('mockjs')
// 模拟数据列表
const List = []
// 模拟数据的数量
const count = 5
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
    parentId: 1,
    'resource': '系统管理',
    'icon': Mock.Random.image('100x100', '#FF6600'),
    'sort|+1': 1,
    'permission_key': 'system:user:list',
    'router': 'system/user/index',
    'status|1': [1, 0],
    'create_time': [Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')],
    'children': [
      {
        'id': 2,
        'resource': '用户管理',
        'icon': Mock.Random.image('100x100', '#FF6600'),
        'sort': 1,
        'premission_key': 'system:user:list',
        'router': 'system/user/index',
        'status|1': [1, 0],
        'create_time': [Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')]
      }
    ]
  }))
}

module.exports = [
  {
    url: '/account_api/permission/v1/tree',
    method: 'get',
    response: config => {
      const {
        menu,
        status,
        pageNum = 1,
        pageSize = 10,
        sortKey
      } = config.query
      console.log(config.query)
      console.log(List)
      let mockList = List.filter(item => {
        if (menu && menu !== item.menu) return false
        if (status && status !== item.status) return false
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
  { // 新增权限
    url: '/permission/v1',
    type: 'post',
    response: _ => {
      return {
        code: 0,
        data: 'success'
      }
    }
  },
  { // 修改权限
    url: /^\/account_api\/permission\/v1\/(.*)$/,
    type: 'put',
    response: _ => {
      return {
        code: 0,
        data: 'success'
      }
    }
  },
  { // 删除权限
    url: /\/account_api\/permission\/v1\/(.*)/,
    type: 'delete',
    response: _ => {
      return {
        code: 0,
        data: 'success'
      }
    }
  },
  { // 修改权限状态
    url: /^\/account_api\/permission\/v1\/(.*)\/(.*)$/,
    method: 'put',
    response: _ => {
      return {
        code: 0,
        data: 'success'
      }
    }
  }
]

