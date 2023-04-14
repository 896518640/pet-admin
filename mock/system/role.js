const Mock = require('mockjs')
// 模拟数据列表
const List = []
// 模拟数据的数量
const count = 100
// 拓展mockjs 模拟手机号
Mock.Random.extend({
  phone: function () {
    const phonePrefixs = ['132', '135', '189'] // 自己写前缀哈
    return this.pick(phonePrefixs) + Mock.mock(/\d{8}/) // Number()
  }
})
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    'name': '@cname(2,3)',
    'key|1': ['admin', 'common'],
    'sort|+1': 1,
    'create_time': [Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')],
    'status|1': [1, 0],
    'permission': [
      {
        'menu_id': 1,
        'label': '系统菜单',
        'children': [
          {
            'id': 2,
            'label': '商家管理'
          }
        ]
      }
    ]
  }))
}

module.exports = [
  {
    url: '/account_api/role/v1/list',
    method: 'get',
    response: config => {
      const {
        name,
        key,
        status,
        create_time,
        pageNum = 1,
        pageSize = 10,
        sortKey
      } = config.query
      console.log(config.query)
      console.log(List)
      let mockList = List.filter(item => {
        if (name && name !== item.name) return false
        if (key && key !== item.key) return false
        if (status && status != item.status) return false
        if (create_time && create_time[0] !== item.create_time[0]) return false
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
  { // 新增角色
    url: '/account_api/role/v1',
    type: 'post',
    response: _ => {
      return {
        code: 0,
        data: 'success'
      }
    }
  },
  { // 修改角色信息
    url: /^\/account_api\/account\/v1\/(.*)$/,
    type: 'put',
    response: _ => {
      return {
        code: 0,
        data: 'success'
      }
    }
  },
  { // 删除角色
    url: '/account_api/account/v1',
    type: 'delete',
    response: _ => {
      return {
        code: 0,
        data: 'success'
      }
    }
  },
  { // 修改角色状态
    url: /^\/account_api\/account\/v1\/(.*)\/(.*)$/,
    method: 'put',
    response: _ => {
      return {
        code: 0,
        data: 'success'
      }
    }
  }
]

