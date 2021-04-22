/*
* @Author:吴晓斌
* @Date:2020-06-03
 * @Last Modified by: 吴晓斌
 * @Last Modified time: 2020-09-10 15:00:20
*/

import Mock from 'mockjs'

const List = []
const count = 100
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    feedBackId: '@increment',
    userName: '@ctitle(2, 5)',
    orgName: '@ctitle(2, 5)',
    userType: '@ctitle(2, 5)',
    content: '@sentence(1, 3)',
    dateTime: '@datetime',
    status: '待回复'
  }))
}

export default [
  {
    url: '/vue-admin-template/feedBack/list',
    type: 'get',
    response: config => {
      const { userName, page = 1, limit = 20 } = config.query

      const mockList = List.filter(item => {
        return !(userName && item.userName.indexOf(userName) < 0)
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
  }
]
