/*
* @Author:范开杰
* @Date:2020-07-23
 * @Last Modified by: 范开杰
 * @Last Modified time: 2020-07-23 15:13:22
*/

import request from '@/utils/request'

/**
 * 课程收费
 * @param {Object} params 获取课程收费数据所需参数
 * @returns {AxiosPromise}
 */
export function getcourseFeeList(params) {
  return request({
    url: '/costManage/getCourseChargeByOrgId',
    method: 'get',
    params
  })
}
