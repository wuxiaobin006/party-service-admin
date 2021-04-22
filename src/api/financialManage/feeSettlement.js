/*
* @Author: 吴晓斌
* @Date: 2020-09-09
* @Last Modified by: 吴晓斌
* @Last Modified time: 2020-10-21 15:00:05
*/

// 财务管理-收费结算相关接口
import request from '@/utils/request'

/**
 * 获取收费结算
 * @param {Number|null} pageNo 页数
 * @param {Number|null} pageSize 每页个数
 * @returns {Object}
 */
export function queryCourseTotalRevenue(pageNo, pageSize) {
  return request({
    url: '/costManage/queryCourseTotalRevenue',
    method: 'get',
    params: {
      pageNo: pageNo,
      pageSize: pageSize
    }
  })
}
