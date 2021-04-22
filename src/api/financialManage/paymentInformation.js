/*
* @Author:范开杰
* @Date:2020-09-08
 * @Last Modified by: 范开杰
 * @Last Modified time: 2020-09-08 15:13:22
*/

import request from '@/utils/request'

/**
 * 获取缴费信息
 * @param {Object} params 获取缴费信息所需参数
 * @returns {AxiosPromise}
 */
export function getPaymentInformationList(params) {
  return request({
    url: '/costManage/queryCourseCost',
    method: 'get',
    params
  })
}

/**
 * 新增缴费信息
 * @param {Object} params 新增缴费信息所需数据
 * @returns {AxiosPromise}
 */
export function addPaymentInformation(params) {
  return request({
    url: '/costManage/insertBill',
    method: 'post',
    params
  })
}
