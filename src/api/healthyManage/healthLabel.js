/*
* @Author:范开杰
* @Date:2020-10-22
 * @Last Modified by: 范开杰
 * @Last Modified time: 2020-11-03 15:13:22
*/

import request from '@/utils/healthyRuest'

/**
 * 获取养生讲堂内容标签
 * @returns {AxiosPromise}
 */
export function gethealthLabelList() {
  return request({
    url: '/lecture/tag',
    method: 'get'
  })
}

/**
 * 新建养生讲堂内容标签
 * @param {Object} params 标签内容与标签相关
 * @returns {AxiosPromise}
 */
export function addhealthLabel(params) {
  return request({
    url: '/lecture/tag',
    method: 'post',
    params
  })
}

/**
 * 删除养生讲堂内容标签
 * @param {Object} params 标签id
 * @returns {AxiosPromise}
 */
export function deletehealthLabel(params) {
  return request({
    url: '/lecture/tag',
    method: 'delete',
    params
  })
}

/**
 * 修改养生讲堂内容标签
 * @param {Object} params 标签id、标签名称、标签相关
 * @returns {AxiosPromise}
 */
export function edithealthLabel(params) {
  return request({
    url: '/lecture/tag',
    method: 'put',
    params
  })
}
