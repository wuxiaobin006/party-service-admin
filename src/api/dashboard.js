/*
* @Author:范开杰
* @Date:2020-11-09
 * @Last Modified by: 范开杰
 * @Last Modified time: 2020-11-10 17:13:22
*/

// 主页面图表相关接口
import request from '@/utils/request'

/**
 * 获取收益最近统计数据
 * @returns {AxiosPromise}
 */
export function getEarningsStatistics() {
  return request({
    url: '/statistics/getEarningsStatistics',
    method: 'get'
  })
}

/**
 * 获取人员/订单统计数据
 * @returns {AxiosPromise}
 */
export function getMemberStatistics() {
  return request({
    url: '/statistics/getMemberStatistics',
    method: 'get'
  })
}

/**
 * 获取订单最近统计数据
 * @returns {AxiosPromise}
 */
export function getOrderStatistics() {
  return request({
    url: '/statistics/getOrderStatistics',
    method: 'get'
  })
}
