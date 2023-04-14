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
  // 查询商家列表
  {
    url: '/merchant/v1/list',
    type: 'post',
    response: _ => {
      return {
        'code': 0, // 请求成功为0，失败为错误码
        'message': 'success', // 请求成功为 success，失败为具体错误信息
        'data': {
          'list': [{
            'id': 1,
            'name': '上海XXXX宠物医院',
            'type': 1, // 有专门的类型字典
            'icon': 'icon link url',
            'leader': '院长',
            'description': '这是一家非常厉害的宠物医院',
            'telephone': '021-88888888',
            'official_account': '公众号链接',
            'address': '上海市闵行区XXX号',
            'map_address': [40, 120],
            'pictures': ['http://p1.com', 'http://p2.com'],
            'status': 1,
            'create_time': '2022-08-22 09:02:19'
          }],
          'page_num': 1, // 代表第1页
          'page_size': 10, // 代表每页10条数据
          'total': 100 // 代表一共100条数据
        }
      }
    }
  },
  // 新增商家
  {
    url: '/merchant/v1',
    type: 'post',
    response: _ => {
      // console.log(_)
      return {
        code: 0,
        message: '添加成功',
        success: true,
        data: 0
      }
    }
  },
  // 更新商家
  {
    url: '/merchant/v1/[1-9]',
    type: 'put',
    response: _ => {
      // console.log(_)
      return {
        code: 0,
        message: '修改成功',
        success: true,
        data: 0
      }
    }
  }, // 删除商家
  {
    url: '/merchant/v1/[1-9]',
    type: 'del',
    response: _ => {
      // console.log(_)
      return {
        code: 0,
        message: '删除成功',
        success: true,
        data: 0
      }
    }
  }, // 商家详情
  {
    url: '/merchant/v1/[1-9]',
    type: 'get',
    response: _ => {
      // console.log(_)
      return {
        'success': true,
        'code': 0,
        'message': 'success',
        'data': [{
          'id': 1,
          'tenantId': 0,
          'name': '上海XXXX宠物医院',
          'type': 1,
          'leader': '院长',
          'description': '这是一家非常厉害的宠物医院',
          'icon': 'icon link url',
          'telephone': '021-88888888',
          'officialAccount': '公众号链接',
          'address': '上海市闵行区XXX号',
          'mapAddress': [
            40,
            120
          ],
          'pictures': [
            'http://p1.com',
            'http://p2.com'
          ],
          'status': 0,
          'updateTime': '2022-09-17 09:31:11',
          'departments': [
            {
              'id': 1,
              'tenantId': 0,
              'name': '全科',
              'createTime': '2022-09-17 11:52:28',
              'updateTime': '2022-09-17 11:52:28',
              'leader': '院长',
              'icon': 'http://p.com/p1',
              'description': '这是全科的描述',
              'status': 0,
              'sort': 0
            },
            {
              'id': 3,
              'tenantId': 0,
              'name': '内科',
              'createTime': '2022-09-17 11:56:38',
              'updateTime': '2022-09-17 11:56:38',
              'leader': '科长',
              'icon': 'http://p.com/p1',
              'description': '这是内科的描述',
              'status': 0,
              'sort': 0
            }
          ]
        }]
      }
    }
  },
  // 商家部门
  {
    url: '/merchant_api/merchant/v1/[1-9]/department',
    type: 'get',
    response: _ => {
      return {
        'success': true,
        'code': 0,
        'message': '商家部门',
        'data': [
          {
            'id': 1,
            'tenantId': 0,
            'name': '全科',
            'createTime': '2022-09-17 11:52:28',
            'updateTime': '2022-09-17 11:52:28',
            'leader': '院长',
            'icon': 'http://p.com/p1',
            'description': '这是全科的描述',
            'status': 0,
            'sort': 0
          },
          {
            'id': 3,
            'tenantId': 0,
            'name': '内科',
            'createTime': '2022-09-17 11:56:38',
            'updateTime': '2022-09-17 11:56:38',
            'leader': '科长',
            'icon': 'http://p.com/p1',
            'description': '这是内科的描述',
            'status': 0,
            'sort': 0
          }
        ]
      }
    }
  },
  // 新增部门
  {
    url: '/merchant/v1/[1-9]/department',
    type: 'post',
    response: _ => {
      return {
        'success': true,
        'code': 0,
        'message': '新增部门'
      }
    }
  }

]
