/*
* @Author:范开杰
* @Date:2020-09-09
 * @Last Modified by: 范开杰
 * @Last Modified time: 2020-09-09 16:04:10
*/

import Mock from 'mockjs'
const data = Mock.mock({
  'list|25-50': [{ // 退款记录列表数据
    'studentID|+1': 1,
    studentName: '@cname',
    'year|1': ['2020年', '2019年', '2018年'],
    'semester|1': ['春夏', '秋冬'],
    'className|1': ['树叶', '小小科学家', '手摇发电机', '光控路灯', '人体导电', '集成测试课程'],
    'refundAmount|1-100.2': 1,
    operator: '@cname',
    operatingTime: '@datetime'
  }]
})

export default [
  {
    url: '/vue-admin-template/refundRecord/list',
    type: 'get',
    response: config => {
      const list = data.list

      const { searchData, page = 1, limit = 10 } = config.query
      const searchlist = list.filter(item => {
        return !(searchData && !item.className.includes(searchData)) // 搜索班级名称
      })
      const pagelist = searchlist.filter((item, index) =>
        index < page * limit && index >= limit * (page - 1) // 分页
      )
      return {
        code: 200,
        data: {
          total: searchlist.length,
          list: pagelist
        }
      }
    }
  }
]
