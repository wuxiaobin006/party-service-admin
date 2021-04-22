/*
* @Author:范开杰
* @Date:2020-07-06
 * @Last Modified by: 范开杰
 * @Last Modified time: 2020-08-18 16:51:10
*/

import Mock from 'mockjs'

const data = Mock.mock({
  options: [{
    value: '搜索班级',
    label: '搜索班级',
    children: [{
      value: '老年班',
      label: '老年班'
    }, {
      value: '棋艺班',
      label: '棋艺班'
    }]
  }
  ],
  'list|70-100': [{ // 班级列表数据
    'classID|+1': 1,
    id: '@guid',
    'className|1': ['老年1班', '老年2班', '老年3班', '棋艺1班', '棋艺2班', '棋艺3班'],
    'semester|1-4': 1,
    teacherName: '@cname',
    options_value: function() {
      return this.className.replace(/[0-9]/ig, '')
    },
    'classMember|50-60': [ // 学生名单
      { 'studentID|+1': 1,
        name: '@cname',
        'sex|1': ['男', '女'],
        phone: /\d{11}/,
        IdCard: /\d{6}/
      }
    ]
  }]
})

export default [
  {
    url: '/vue-admin-template/ClassStatistics/list',
    type: 'get',
    response: config => {
      const options = data.options
      const list = data.list

      const { options_value, searchData, page = 1, limit = 10 } = config.query
      const optionslist = list.filter(item => {
        return !(options_value && !item.options_value.includes(options_value[1])) // 搜索类型
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
          list: pagelist
        }
      }
    }
  }
]
