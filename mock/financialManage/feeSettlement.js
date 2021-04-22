/*
* @Author: 吴晓斌
* @Date: 2020-09-09
* @Last Modified by: 吴晓斌
* @Last Modified time: 2020-09-09 15:10:22
*/

import Mock from 'mockjs'
const List = []
const count = 100
const searchData = {
  yearOptions: [{
    value: '2020',
    label: '2020'
  }, {
    value: '2019',
    label: '2019'
  }, {
    value: '2018',
    label: '2018'
  }, {
    value: '2017',
    label: '2017'
  }],
  termOptions: [{
    value: '春夏',
    label: '春夏'
  }, {
    value: '秋冬',
    label: '秋冬'
  }],
  classOptions: [{
    value: '老年大学1班',
    label: '老年大学1班'
  }, {
    value: '老年大学2班',
    label: '老年大学2班'
  }, {
    value: '老年大学3班',
    label: '老年大学3班'
  }]
}

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    'className|1': ['老年大学1班', '老年大学2班', '老年大学3班'],
    'payable|1-10000.2': 1,
    'receipts|1-10000.2': 1,
    'enrollment|1-1000': 1,
    'regressed|1-1000': 1,
    'reality|1-1000': 1,
    'year|1': ['2020', '2019', '2018', '2017'],
    'term|1': ['春夏', '秋冬']
  }))
}

export default [
  {
    url: '/vue-admin-template/feeSettlement/list',
    type: 'get',
    response: config => {
      const { searchYear, searchTerm, searchClass, className, page = 1, limit = 20 } = config.query

      let mockList = List.filter(item => {
        return !(searchYear && item.year.indexOf(searchYear) < 0)
      })
      mockList = mockList.filter(item => {
        return !(searchTerm && item.term.indexOf(searchTerm) < 0)
      })
      mockList = mockList.filter(item => {
        return !(searchClass && item.className.indexOf(searchClass) < 0)
      })
      mockList = mockList.filter(item => {
        return !(className && item.className.indexOf(className) < 0)
      })
      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      return {
        code: 200,
        data: {
          yearOptions: searchData.yearOptions,
          termOptions: searchData.termOptions,
          classOptions: searchData.classOptions,
          total: mockList.length,
          items: pageList
        }
      }
    }
  }
]
