/*
* @Author:范开杰
* @Date:2021-01-08
 * @Last Modified by: 范开杰
 * @Last Modified time: 2021-01-08 17:13:22
*/

// 学习评估相关接口
import request from '@/utils/request'

/**
 * 获取能力报告分析
 * @param {string} studentId 学生ID
 * @param {string} courseId 课程ID
 * @returns {AxiosPromise}
 */
export function getElderStatistics(studentId, courseId) {
  return request({
    url: '/statistics/getElderStatistics',
    method: 'get',
    params: {
      studentId: studentId,
      courseId: courseId
    }
  })
}

