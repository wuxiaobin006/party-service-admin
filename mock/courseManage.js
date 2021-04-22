/*
* @Author: 卢贤睿
* @Date: 2020-07-12
* @Last Modified by: 卢贤睿
* @Last Modified time: 2020-09-16 10:57
*/

import Mock from 'mockjs'

const List = []
const count = 25
for(let i = 0; i < count; i++) {
  List.push(Mock.mock({
      id: '@id',
      courseName: '@ctitle',
      courseFees: '@natural(100, 200)',
      courseTimes: '@natural(10, 20)',
      courseTotalFees: '@natural(1000,4000)',
      enrollment: '@natural(10, 40)'
  }))
}

export default [
  {
    url: '/vue-admin-template/getCourseManageInfo',
    type: 'get',
    response: config => {
      const { courseName, page = 1, limit = 10} = config.query

      const mockList = List.filter(item => {
        return !(courseName && item.courseName.indexOf(courseName) < 0)
      })

      // if(sort === '-id') {
      //   mockList = mockList.reverse()
      // }

      const pageList = List.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      return {
        code: 200,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },
  // {
  //   url: '/vue-element-admin/searchCourse',
  //   type: 'post',
  //   response: _ => {
  //     return {
  //       code: 200,
  //       data: 'success'
  //     }
  //   }
  // },
  // {
  //   url: '/vue-element-admin/checkCourseInfo',
  //   type: 'get',
  //   response: config => {
  //     const {id} = config.query
  //     for(const member of data.items) {
  //       if(member.id === +id) {
  //         return {
  //           code: 200,
  //           data: member
  //         }
  //       }
  //     }
  //   }
  // },
  // {
  //   url: '/vue-element-admin/createCourse',
  //   type: 'post',
  //   response: _ => {
  //     return {
  //       code: 200,
  //       data: 'success'
  //     }
  //   }
  // }
]
