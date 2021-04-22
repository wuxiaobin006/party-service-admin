/*
* @Author:吴晓斌
* @Date:2020-07-20
 * @Last Modified by: 吴晓斌
 * @Last Modified time: 2020-07-20 14:33:01
*/

import Mock from 'mockjs'

const List = []
const count = 100
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    fileName: '@ctitle(2, 5)',
    teacherName: '@cname',
    'class|1': ['老年大学1班', '老年大学2班', '老年大学3班'],
    'fileType|1': ['共享文件', '私有文件'],
    dateTime: '@datetime'
  }))
}

export default [
  {
    url: '/vue-admin-template/resource/list',
    type: 'get',
    response: config => {
      const { fileName, page = 1, limit = 20 } = config.query

      const mockList = List.filter(item => {
        return !(fileName && item.fileName.indexOf(fileName) < 0)
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
