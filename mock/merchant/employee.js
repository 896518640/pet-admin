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
  // 员工列表
  {
    url: '/employee/v1/list',
    type: 'post',
    response: _ => {
      return {
        'success': true,
        'code': 0,
        'message': '员工列表',
        'data': {
          'list': [
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
          ],
          'total': 2,
          'pageSize': 10,
          'pageNum': 1
        }
      }
    }
  },
  // 修改员工
  {
    url: '/employee/v1/[1-9]',
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
  }, // 删除员工
  {
    url: '/employee/v1/[1-9]',
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
  // 员工详情
  {
    url: '/employee/v1/[1-9]',
    type: 'get',
    response: _ => {
      // console.log(_)
      return {
        'success': true,
        'code': 0,
        'message': 'success',
        'data': {
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
        }
      }
    }
  },
  // 新增员工
  {
    url: '/employee/v1',
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
