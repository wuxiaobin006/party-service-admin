/*
* @Author: 吴晓斌
* @Date: 2020-09-14
* @Last Modified by: 吴晓斌
* @Last Modified time: 2020-10-23 10:23:21
*/

// 财务管理-教师费用统计相关接口
import request from '@/utils/request'

/**
 * 获取教师收入统计列表
 * @param {Number|null} teacherName 教师姓名
 * @param {Number|null} pageNo 页数
 * @param {Number|null} pageSize 每页个数
 * @returns {Object}
 */
export function getTeacherTotalIncome(teacherName, pageNo, pageSize) {
  return request({
    url: '/costManage/getTeacherTotalIncome',
    method: 'get',
    params: {
      teacherName: teacherName,
      pageNo: pageNo,
      pageSize: pageSize
    }
  })
}

/**
 * 获取某教师各课程收入
 * @param {Number|null} teacherId 教师Id
 * @returns {Object}
 */
export function getTeacherDetailIncomeInfo(teacherId) {
  return request({
    url: '/costManage/getTeacherDetailIncomeInfo',
    method: 'get',
    params: {
      teacherId: teacherId
    }
  })
}
