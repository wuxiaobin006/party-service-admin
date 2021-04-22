/*
* @Author: 杨志杰
* @Date: 2020-06-09
* @Last Modified by: 杨志杰
* @Last Modified time: 2020-06-09 18:18:01
*/

import Mock from 'mockjs'

const List = []
const count = 100
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    province: '@province',
    city: '@city',
    organizeName: '@ctitle(2, 5)',
    weChat: '@word(3, 5)',
    iphone: '@natural(11)'
  }))
}

export default [
  {
    url: '/vue-admin-template/getOrganizeManage',
    type: 'get',
    response: config => {
      const { organizeName, page = 1, limit = 20 } = config.query

      const mockList = List.filter(item => {
        return !(organizeName && item.organizeName.indexOf(organizeName) < 0)
      })
      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      return {
        code: 200,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },
  {
    url: '/vue-element-admin/createOrganizeManage',
    type: 'post',
    response: _ => {
      return {
        code: 200,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/updateOrganizeManage',
    type: 'post',
    response: _ => {
      return {
        code: 200,
        data: 'success'
      }
    }
  }
]
