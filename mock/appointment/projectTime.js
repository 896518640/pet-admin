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
  // 查询商家列表
  {
    url: '/appointment/v1/list',
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
              doctor: '王医生',
              name: '绝育',
              time: ['10:00', '12:00'],
              number: '111',
              circle: '111',
              recurrence: [0, 1, 2, 3, 4, 5]
            },
            {
              id: 111,
              doctor: '王医生',
              name: '增高',
              time: ['12:00', '14:00'],
              number: '111',
              circle: '111',
              recurrence: [0, 1]
            },
            {
              id: 111,
              doctor: '王医生',
              name: '增高',
              time: ['14:00', '16:00'],
              number: '111',
              circle: '111',
              recurrence: [0, 1]
            },
            {
              id: 222,
              doctor: '王医生',
              name: '增高',
              time: ['12:00', '14:00'],
              number: '111',
              circle: '111',
              recurrence: [0, 1]
            },
            {
              id: 222,
              doctor: '王医生',
              name: '增高',
              time: ['14:00', '16:00'],
              number: '111',
              circle: '111',
              recurrence: [0, 1]
            },
            {
              id: 222,
              doctor: '王医生',
              name: '增高',
              time: ['12:00', '14:00'],
              number: '111',
              circle: '111',
              recurrence: [0, 1]
            },
            {
              id: 333,
              doctor: '王医生',
              name: '增高',
              time: ['14:00', '16:00'],
              number: '111',
              circle: '111',
              recurrence: [0, 1]
            }
          ],
          'total': 7,
          'pageSize': 10,
          'pageNum': 1
        }
      }
    }
  },
  // 获取可预约几天后的时间
  {
    url: '/appointment/v1/appointmentDate/[0-9]',
    type: 'get',
    response: _ => {
      // console.log(_)
      return {
        code: 0,
        message: '获取可预约时间成功',
        success: true,
        data: {
          ableTime: '3'
        }
      }
    }
  },
  // 修改可预约几天后的时间
  {
    url: '/appointment/v1/able/[1-9]',
    type: 'put',
    response: _ => {
      // console.log(_)
      return {
        code: 0,
        message: '修改可预约几天后的时间成功',
        success: true,
        data: 0
      }
    }
  },

  // 新增预约时间
  {
    url: '/appointment/v1',
    type: 'post',
    response: _ => {
      return {
        'success': true,
        'code': 0,
        'message': '新增成功'
      }
    }
  },
  // 编辑预约时间
  {
    url: '/appointment/v1/[1-9]',
    type: 'put',
    response: _ => {
      return {
        'success': true,
        'code': 0,
        'message': '编辑成功'
      }
    }
  },
  // 删除预约时间
  {
    url: '/appointment/v1/[1-9]',
    type: 'delete',
    response: _ => {
      return {
        'success': true,
        'code': 0,
        'message': '删除成功'
      }
    }
  },
  // 批量修改预约时间
  {
    url: '/appointment/v1/bulkAppointment',
    type: 'put',
    response: _ => {
      // console.log(_)
      return {
        code: 0,
        message: '批量修改预约时间成功',
        success: true,
        data: 0
      }
    }
  },
  // 批量修改重复周期
  {
    url: '/appointment/v1/bulkCircle',
    type: 'put',
    response: _ => {
      // console.log(_)
      return {
        code: 0,
        message: '批量修改预约周期成功',
        success: true,
        data: 0
      }
    }
  }
]
