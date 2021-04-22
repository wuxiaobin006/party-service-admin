/*
 * @Author: 杨志杰
 * @Date: 2020-06-09
 * @Last Modified by: 杨志杰
 * @Last Modified time: 2020-09-23 20:18:01
 */

// 机构管理详细信息相关接口
import request from '@/utils/request'

/**
 * 获取机构管理列表信息
 * @param {String|null} keyword 关键词
 * @param {Number|null} pages 页数
 * @param {Number|null} limit 限制个数
 * @returns {AxiosPromise}
 */
export function getOrg(keyword, pages, limit) {
  return request({
    url: '/organization/getAllOrganization',
    method: 'get',
    params: {
      keyword,
      pageNo: pages,
      pageSize: limit
    }
  })
}

/**
 * 更新机构管理信息
 * @param {Sting} provinceName 省份名称
 * @param {Sting} cityName 城市名称
 * @param {Sting} orgName 机构名称
 * @param {Sting} wechatID 微信号
 * @param {Sting} contact 联系方式
 * @param {Number} orgId 机构ID
 * @returns {AxiosPromise}
 */
export function updateOrg(provinceName, cityName, orgName, wechatID, contact, orgId) {
  return request({
    url: '/organization/updateOrg',
    method: 'post',
    params: {
      provinceName,
      cityName,
      orgName,
      wechatID,
      contact,
      orgId
    }
  })
}

/**
 * 新增机构管理信息
 * @param {Sting} provinceName 省份名称
 * @param {Sting} cityName 城市名称
 * @param {Sting} orgName 机构名称
 * @param {Sting} wechatID 微信号
 * @param {Sting} contact 联系方式
 * @returns {AxiosPromise}
 */
export function createOrg(provinceName, cityName, orgName, wechatID, contact) {
  return request({
    url: '/organization/insertOrg',
    method: 'post',
    params: {
      provinceName,
      cityName,
      orgName,
      wechatID,
      contact
    }
  })
}

/**
 * 删除机构管理信息
 * @param {Array} orgIdList 省份名称
 * @returns {AxiosPromise}
 */
export function deleteOrg(orgId) {
  return request({
    url: '/organization/deleteOrgByOrgId',
    method: 'delete',
    params: {
      orgId
    }
  })
}

/**
 * 获取所有省份
 * @returns {AxiosPromise}
 */
export function getAllProvince() {
  return request({
    url: '/organization/getAllProvince',
    method: 'get'
  })
}

/**
 * 根据省份获取所属城市
 * @param {String} provinceName 省份名称
 * @returns {AxiosPromise}
 */
export function getCityByProvince(provinceName) {
  return request({
    url: '/organization/getCityByProvince',
    method: 'get',
    params: { provinceName }
  })
}
