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
    'date': `@cdate(2,3)`,
    'name': `@cname(2,3)项目`,
    'doctor': '@cname(1)医生',
    'ableTime': '10:00-12:00',
    'number': '@cname(3,5)',
    'circle': ['宠物洗护', '宠物主粮', '宠物酒店'],
    'recurence': [0, 1]
  }))
}

module.exports = [
  // 查询订单列表
  {
    url: '/order/v1/list',
    type: 'post',
    response: _ => {
      return {
        'success': true,
        'code': 0,
        'message': '获取列表成功',
        'data': {
          'list': [
            {
              id: 111,
              user: '王医生',
              phone: '17605589076',
              date: ['10:00', '12:00'],
              time: '111',
              project: '111',
              doctor: '111',
              pet: '111',
              age: '10',
              vaccineInfo: '111',
              neuteringInfo: '111',
              price: '111',
              status: 0
            },
            {
              id: 1121,
              user: '王医生',
              phone: '17605589076',
              date: ['10:00', '12:00'],
              time: '111',
              project: '111',
              doctor: '111',
              pet: '111',
              age: '10',
              vaccineInfo: '111',
              neuteringInfo: '111',
              price: '111',
              status: 0
            },
            {
              id: 1112,
              user: '王医生',
              phone: '17605589076',
              date: ['10:00', '12:00'],
              time: '111',
              project: '111',
              doctor: '111',
              pet: '111',
              age: '10',
              vaccineInfo: '111',
              neuteringInfo: '111',
              price: '111',
              status: 0
            },
            {
              id: 333,
              user: '王医生',
              phone: '17605589076',
              date: ['10:00', '12:00'],
              time: '111',
              project: '111',
              doctor: '111',
              pet: '111',
              age: '10',
              vaccineInfo: '111',
              neuteringInfo: '111',
              price: '111',
              status: 0
            },
            {
              id: 1122,
              user: '王医生',
              phone: '17605589076',
              date: ['10:00', '12:00'],
              time: '111',
              project: '111',
              doctor: '111',
              pet: '111',
              age: '10',
              vaccineInfo: '111',
              neuteringInfo: '111',
              price: '111',
              status: 0
            },
            {
              id: 444,
              user: '王医生',
              phone: '17605589076',
              date: ['10:00', '12:00'],
              time: '111',
              project: '111',
              doctor: '111',
              pet: '111',
              age: '10',
              vaccineInfo: '111',
              neuteringInfo: '111',
              price: '111',
              status: 0
            },
            {
              id: 555,
              user: '王医生',
              phone: '17605589076',
              date: ['10:00', '12:00'],
              time: '111',
              project: '111',
              doctor: '111',
              pet: '111',
              age: '10',
              vaccineInfo: '111',
              neuteringInfo: '111',
              price: '111',
              status: 0
            }
          ],
          'total': 7,
          'pageSize': 10,
          'pageNum': 1
        }
      }
    }
  },
  // 编辑订单
  {
    url: '/order/v1/[1-9]',
    type: 'put',
    response: _ => {
      return {
        'success': true,
        'code': 0,
        'message': '编辑成功'
      }
    }
  },
  // 退款 取消订单
  {
    url: '/order/v1/cancel/[1-9]',
    type: 'put',
    response: _ => {
      return {
        'success': true,
        'code': 0,
        'message': '取消成功'
      }
    }
  }
]
