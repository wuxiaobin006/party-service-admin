/*
* @Author:范开杰
* @Date:2020-09-08
 * @Last Modified by: 范开杰
 * @Last Modified time: 2020-09-08 16:51:10
*/

import Mock from 'mockjs'

let searchYear = 2020
const data = Mock.mock({
  options: [{ // 左上选择框选项
    value: '未缴费',
    label: '未缴费',
    children: [{
      value: '陶瓷绘画',
      label: '陶瓷绘画'
    }, {
      value: '聪明脑训练草场社区',
      label: '聪明脑训练草场社区'
    }, {
      value: '时间沙漏',
      label: '时间沙漏'
    }]
  }, {
    value: '已缴费',
    label: '已缴费',
    children: [{
      value: '陶瓷绘画',
      label: '陶瓷绘画'
    }, {
      value: '聪明脑训练草场社区',
      label: '聪明脑训练草场社区'
    }, {
      value: '时间沙漏',
      label: '时间沙漏'
    }]
  }, {
    value: '已退费',
    label: '已退费',
    children: [{
      value: '陶瓷绘画',
      label: '陶瓷绘画'
    }, {
      value: '聪明脑训练草场社区',
      label: '聪明脑训练草场社区'
    }, {
      value: '时间沙漏',
      label: '时间沙漏'
    }]
  }],
  'list|70-100': [{ // 列表数据
    'studentID|+1': 1,
    studentName: '@cname', // 学生姓名
    'refundAmount|1-100.2': 1, // 实收/退费金额
    'className|1': ['陶瓷绘画', '聪明脑训练草场社区', '时间沙漏'], // 班级名称
    operator: '@cname', // 操作员
    paymentTime: '@datetime', // 缴费时间
    'paymentState|1': ['未缴费', '已缴费', '已取消缴费'], // 缴费状态
    'refundState|1': ['未申请退费', '已申请退费', '已退费'] // 退费申请状态
  }],
  courseList: [ // 班级列表
    { label: '陶瓷绘画', value: '陶瓷绘画' },
    { label: '聪明脑训练草场社区', value: '聪明脑训练草场社区' },
    { label: '时间沙漏', value: '时间沙漏' }
  ],
  'formYear_options|10': [{ // 年份选择框选项
    value: function() {
      return searchYear + '年'
    },
    label: function() {
      return searchYear-- + '年'
    }
  }]
})

export default [
  {
    url: '/vue-admin-template/PaymentInformation/list',
    type: 'get',
    response: config => {
      const options = data.options
      const list = data.list
      const courseList = data.courseList
      const formYear_options = data.formYear_options

      const { options_value, searchData, page = 1, limit = 10 } = config.query
      const optionsState = list.filter(item => {
        return !(options_value && !item.paymentState.includes(options_value[0]) && !item.refundState.includes(options_value[0])) // 缴费状态类型
      })
      const optionslist = optionsState.filter(item => {
        return !(options_value && !item.className.includes(options_value[1])) // 搜索类型
      })
      const searchlist = optionslist.filter(item => {
        return !(searchData && !item.className.includes(searchData)) // 搜索班级名称
      })
      const pagelist = searchlist.filter((item, index) =>
        index < page * limit && index >= limit * (page - 1) // 分页
      )
      return {
        code: 200,
        data: {
          options: options,
          total: searchlist.length,
          list: pagelist,
          courseList: courseList,
          formYear_options: formYear_options
        }
      }
    }
  }
]
