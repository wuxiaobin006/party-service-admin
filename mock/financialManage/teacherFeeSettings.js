/*
* @Author: 吴晓斌
* @Date: 2020-09-11
* @Last Modified by: 吴晓斌
* @Last Modified time: 2020-09-11 13:22:22
*/

import Mock from 'mockjs'
const List = []
const count = 100

for (let i = 0; i < count; i++) {
  const index = Mock.mock({
    teacherId: '@increment',
    teacherName: '@cname',
    'teacherClass|1': ['老年大学1班', '老年大学2班', '老年大学3班'],
    startTime: '@date',
    endTime: '@date',
    'classTimeStandard|1-10': 1,
    'overtimePay|1-10000.2': 1,
    'substitutePay|1-10000.2': 1,
    'taPay|1-10000.2': 1,
    'deductions|1-10000.2': 1
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
    url: '/vue-admin-template/teacherFeeSettings/list',
    type: 'get',
    response: config => {
      const { propValue, teacherName, page = 1, limit = 20 } = config.query
      let mockList = List.filter(item => {
        if (propValue) {
          return (item.startTime <= propValue && item.endTime >= propValue)
        } else return true
      })

      mockList = mockList.filter(item => {
        return !(teacherName && item.teacherName.indexOf(teacherName) < 0)
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
    url: '/vue-admin-template/updateTeacherFeeSettings',
    type: 'post',
    response: _ => {
      return {
        code: 200,
        data: 'success'
      }
    }
  }
]
