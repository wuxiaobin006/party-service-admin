/*
* @Author:范开杰
* @Date:2020-07-23
 * @Last Modified by: 范开杰
 * @Last Modified time: 2020-08-18 16:04:10
*/

import Mock from 'mockjs'
let searchYear = 2020
const data = Mock.mock({
  'searchtype_options|10': [{ // 年份选择框选项
    value: function() {
      return searchYear + '年'
    },
    label: function() {
      return searchYear-- + '年'
    }
  }],
  'list|25-50': [{ // 课程收费列表数据
    'classID|+1': 1,
    'className|1': ['树叶', '小小科学家', '手摇发电机', '光控路灯', '人体导电', '集成测试课程'],
    'courseName|1': ['树叶', '小小科学家', '手摇发电机', '光控路灯', '人体导电', '集成测试课程'],
    createTime: '@datetime',
    'coursePrice|1-100.2': 1,
    expiryDate: '@date',
    'actualPrice|1-100.2': 1,
    'listYear|1': ['2020年', '2019年', '2018年']
  }]
})

export default [
  {
    url: '/vue-admin-template/courseFee/list',
    type: 'get',
    response: config => {
      const searchtype_options = data.searchtype_options
      const list = data.list

      const { searchYear, searchData, page = 1, limit = 10 } = config.query
      const listyear = list.filter(item => {
        return !(searchYear && !item.listYear.includes(searchYear)) // 搜索年份
      })
      const searchlist = listyear.filter(item => {
        return !(searchData && !item.className.includes(searchData)) // 搜索班级名称
      })
      const pagelist = searchlist.filter((item, index) =>
        index < page * limit && index >= limit * (page - 1) // 分页
      )
      return {
        code: 200,
        data: {
          searchtype_options: searchtype_options,
          searchYear: searchYear,
          total: searchlist.length,
          list: pagelist
        }
      }
    }
  }
]
