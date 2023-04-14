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
    'account': `@cname(2,3)`,
    'name': `@cname(2,3)宠物店`,
    'leader': '@cname(2,3)',
    'phone': '@phone',
    'wx': '@string(3,5)',
    'business': ['宠物洗护', '宠物主粮', '宠物酒店'],
    'status|-1-5': 0,
    'server': ['交易管理', '运营管理', '用户管理', '系统管理']
  }))
}

module.exports = [
  {
    url: '/tenant/v1/list',
    type: 'post',
    response: config => {
      return {
        code: 0,
        message: 'success',
        data: {
          list: [
            {
              'id': 1,
              'tenantId': 0,
              'name': '外科',
              'createTime': '2022-09-17 11:52:28',
              'updateTime': '2022-09-17 14:20:26',
              'leader': '院长',
              'icon': 'http://xxx',
              'description': '这是全科的描述',
              'status': 0,
              'sort': 0
            },
            {
              'id': 2,
              'tenantId': 0,
              'name': '皮肤科',
              'createTime': '2022-09-17 11:56:21',
              'updateTime': '2022-09-17 14:23:57',
              'leader': '科长',
              'icon': 'http://p.com/p1',
              'description': '这是皮肤科的描述',
              'status': 0,
              'sort': 0
            },
            {
              'id': 3,
              'tenantId': 0,
              'name': '内科',
              'createTime': '2022-09-17 11:56:38',
              'updateTime': '2022-09-17 14:26:42',
              'leader': '科长',
              'icon': 'http://p.com/p1',
              'description': '这是内科的描述',
              'status': 0,
              'sort': 0
            }
          ],
          total: 3,
          pageSize: 10,
          pageNum: 1
        }
      }
    }
  },
  { // 新增租户
    url: '/account_api/tenant/v1',
    type: 'post',
    response: _ => {
      return {
        code: 0,
        data: 'success'
      }
    }
  },
  { // 修改租户
    url: '/account_api/tenant/v1/[1-9]',
    type: 'put',
    response: _ => {
      console.log(_.body)
      return {
        code: 0,
        data: 'success'
      }
    }
  },
  { // 删除
    url: '/account_api/tenant/v1/[0-9a-z]',
    type: 'delete',
    response: _ => {
      return {
        code: 0,
        data: 'success'
      }
    }
  },
  { // 修改租户状态
    url: '/account_api/tenant/v1/[a-z1-9]/[a-z1-9]',
    method: 'put',
    response: _ => {
      return {
        code: 0,
        data: 'success'
      }
    }
  },
  { // 新增租户服务
    url: /^\/account_api\/tenant\/v1\/(.*)\/server$/,
    method: 'post',
    response: _ => {
      return {
        code: 0,
        data: 'success'
      }
    }
  },
  { // 修改租户服务
    url: /^\/account_api\/tenant\/v1\/(.*)\/server$/,
    method: 'put',
    response: _ => {
      return {
        code: 0,
        data: 'success'
      }
    }
  }
]

