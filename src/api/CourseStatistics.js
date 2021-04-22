/*
* @Author:范开杰
* @Date:2020-07-06
 * @Last Modified by: 范开杰
 * @Last Modified time: 2020-10-14 17:13:22
*/

import request from '@/utils/request'

/**
 * 获取课程列表
 * @param {Object} query 获取课程所需参数
 * @returns {AxiosPromise}
 */
export function getClassStatisticsList(query) {
  return request({
    url: '/courseManage/listCourse',
    method: 'get',
    params: query
  })
}

/**
 * 获取学生列表
 * @param {Object} query 获取学生列表所需参数
 * @returns {AxiosPromise}
 */
export function getStudentList(query) {
  return request({
    url: '/courseManage/getStudentByCourseId',
    method: 'get',
    params: query
  })
}

/**
 * 删除课程
 * @param {Object} query 删除课程所需参数
 * @returns {AxiosPromise}
 */
export function deleteCourseMessage(query) {
  return request({
    url: '/courseManage/deleteCourse',
    method: 'get',
    params: query
  })
}
