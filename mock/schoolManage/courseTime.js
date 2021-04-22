/*
* @Author: 杨志杰
* @Date: 2020-07-17
* @Last Modified by: 杨志杰
* @Last Modified time: 2020-07-28 18:18:01
*/

import Mock from 'mockjs'

const List = []
const count = 25
for (let i = 0; i < count; i++) {
  const index = Mock.mock({
    courseId: '@increment',
    startTime: '@time',
    endTime: '@time'
  })
  // 返回开始时间早于等于结束时间的对象
  if (judgeTime(index.startTime, index.endTime)) {
    List.push(index)
  }
}

// 把字符字符串转换为时间数组
function parseTime(time) {
  return time.split(':').map(currentValue => parseInt(currentValue))
}

// 判断时间大小
function judgeTime(x, y) {
  const [t1, t2] = [parseTime(x), parseTime(y)]
  if (t1[0] < t2[0]) return true
  else if (t1[0] === t2[0]) {
    if (t1[1] < t2[1]) return true
    else if (t1[1] === t2[1]) return t1[2] <= t2[2]
    else return false
  } else return false
}

export default [
  {
    url: '/vue-admin-template/getCourseTime',
    type: 'get',
    response: config => {
      const { courseName, page = 1, limit = 20 } = config.query

      const mockList = List.filter(item => {
        return !(courseName && item.courseName.indexOf(courseName) < 0)
      })
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
  {
    url: '/vue-element-admin/creatCourseTime',
    type: 'post',
    response: _ => {
      return {
        code: 200,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/updateCourseTime',
    type: 'post',
    response: _ => {
      return {
        code: 200,
        data: 'success'
      }
    }
  }
]
