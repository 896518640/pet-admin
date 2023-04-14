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
    url: '/department/v1/list',
    type: 'post',
    response: _ => {
      return {
        'success': true,
        'code': 0,
        'message': 'success',
        'data': {
          'list': [
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
          'total': 3,
          'pageSize': 10,
          'pageNum': 1
        }
      }
    }
  },
  // 更新商家
  {
    url: '/department/v1/[1-9]',
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
    url: '/department/v1/[1-9]',
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
  },

  // 新增员工
  {
    url: '/department/v1/[1-9]/employee',
    type: 'post',
    response: _ => {
      return {
        'success': true,
        'code': 0,
        'message': '新增员工xxx'
      }
    }
  },
  // 部门员工
  {
    url: '/department/v1/[1-9]/employee',
    type: 'get',
    response: _ => {
      return {
        'success': true,
        'code': 0,
        'message': '部门员工',
        'data': [
          {
            'id': 1,
            'tenantId': 0,
            'name': '张三丰',
            'status': 0,
            'createTime': '2022-09-17 13:28:45',
            'updateTime': '2022-09-17 13:28:45',
            'avatar': '',
            'gender': 0,
            'telephone': '0',
            'description': '武当山扛把子',
            'experience': 0,
            'departmentId': 0,
            'sort': 0
          },
          {
            'id': 2,
            'tenantId': 0,
            'name': '张三',
            'status': 0,
            'createTime': '2022-09-17 13:30:39',
            'updateTime': '2022-09-17 13:30:39',
            'avatar': '',
            'gender': 0,
            'telephone': '0',
            'description': '太极拳',
            'experience': 0,
            'departmentId': 0,
            'sort': 0
          }
        ]
      }
    }
  },
  // 部门详情
  {
    url: '/department/v1/[1-9]',
    type: 'get',
    response: _ => {
      // console.log(_)
      return {
        'success': true,
        'code': 0,
        'message': '部门详情',
        'data': {
          'id': 1,
          'tenantId': 0,
          'name': '外科',
          'createTime': '2022-09-17 11:52:28',
          'updateTime': '2022-09-17 14:20:26',
          'leader': '院长',
          'icon': 'http://xxx',
          'description': '这是全科的描述',
          'status': 0,
          'sort': 0,
          'employees': [
            {
              'id': 1,
              'tenantId': 0,
              'name': '张三丰',
              'status': 0,
              'createTime': '2022-09-17 13:28:45',
              'updateTime': '2022-09-17 13:28:45',
              'avatar': '',
              'gender': 0,
              'telephone': '0',
              'weixin': null,
              'description': '武当山扛把子',
              'title': null,
              'experience': 0,
              'tags': null,
              'departmentId': 0,
              'additionInfo': null,
              'sort': 0
            },
            {
              'id': 2,
              'tenantId': 0,
              'name': '张三',
              'status': 0,
              'createTime': '2022-09-17 13:30:39',
              'updateTime': '2022-09-17 13:30:39',
              'avatar': '',
              'gender': 0,
              'telephone': '0',
              'weixin': null,
              'description': '太极拳',
              'title': null,
              'experience': 0,
              'tags': null,
              'departmentId': 0,
              'additionInfo': null,
              'sort': 0
            }
          ]
        }
      }
    }
  },
  // 新增商家
  {
    url: '/department/v1',
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
  }
]
