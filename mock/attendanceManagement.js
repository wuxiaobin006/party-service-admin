/*
 * @Author:冯伟棋
 * @Date:2020-09-08
 * @Last Modified by: 冯伟棋
 * @Last Modified time: 2020-09-08 15:28:01
 */
import Mock from 'mockjs'

const List = []
const count = 100
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    classId: '@id',
    className: '@ctitle(2, 5)',
    classTeacher: '@ctitle(3, 6)',
    Time: '@time',
    absentNum: '@natural(0, 5)',
    studentId: '@id',
    studentName: '@ctitle(2, 3)',
    sex: '@natural(0, 1)',
    address: '@ctitle(3, 6)',
    phone: '@natural(11)'
  }))
}

export default [{
  url: '/vue-admin-template/attendanceManagement/list',
  type: 'get',
  response: config => {
    const {
      classId,
      page = 1,
      limit = 20
    } = config.query

    const mockList = List.filter(item => {
      return !(classId && item.classtId.indexOf(classId) < 0)
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
}]
