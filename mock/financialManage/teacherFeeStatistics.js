/*
* @Author: 吴晓斌
* @Date: 2020-09-11
* @Last Modified by: 吴晓斌
* @Last Modified time: 2020-09-11 15:10:22
*/

import Mock from 'mockjs'
const List = []
const count = 100
const searchData = {
  termOptions: [{
    value: '春夏',
    label: '春夏'
  }, {
    value: '秋冬',
    label: '秋冬'
  }]
}

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    teacherName: '@cname',
    'className|1': ['老年大学1班', '老年大学2班', '老年大学3班'],
    billingMode: '小时',
    'payment|5000-15000': 1
  }))
}

export default [
  {
    url: '/vue-admin-template/teacherFeeStatistics/list',
    type: 'get',
    response: config => {
      const { teacherName, page = 1, limit = 20 } = config.query

      const mockList = List.filter(item => {
        return !(teacherName && item.teacherName.indexOf(teacherName) < 0)
      })
      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      return {
        code: 200,
        data: {
          termOptions: searchData.termOptions,
          total: mockList.length,
          items: pageList
        }
      }
    }
  }
]
