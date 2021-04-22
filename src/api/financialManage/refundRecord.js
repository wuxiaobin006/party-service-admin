/*
* @Author:范开杰
* @Date:2020-09-09
 * @Last Modified by: 范开杰
 * @Last Modified time: 2020-09-09 15:13:22
*/

import request from '@/utils/request'

/**
 * 获取退费记录
 * @param {Object} params 获取退费记录所需参数
 * @returns {AxiosPromise}
 */
export function getrefundRecordList(params) {
  return request({
    url: '/costManage/queryStudentRefundRecord',
    method: 'get',
    params
  })
}

/**
 * 删除退费记录
 * @param {Number} id 删除退费记录所需Id号
 * @returns {AxiosPromise}
 */
export function deleterefundRecord(id) {
  return request({
    url: '/costManage/deleteRefundBill',
    method: 'delete',
    params: {
      refoundId: id
    }
  })
}
