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
 * 获取特定标签的文章列表
 * @param {Object} params 标签id与起始文章索引
 * @returns {AxiosPromise}
 */
export function getarticleInformationList(page, limit, id) {
  return request({
    url: '/lecture/articleUnderTag',
    method: 'get',
    params: {
      pageNum: page,
      pageSize: limit,
      tagId: id
    }
  })
}

/**
 * 获取文章评论
 * @param {Object} params 文章id与起始评论索引
 * @returns {AxiosPromise}
 */
export function getcommentList(params) {
  return request({
    url: '/lecture/articleComment',
    method: 'get',
    params
  })
}

/**
 * 删除文章
 * @param {Object} params 文章id
 * @returns {AxiosPromise}
 */
export function deleteArticleMessage(params) {
  return request({
    url: '/lecture/article',
    method: 'delete',
    params
  })
}

/**
 * 删除评论
 * @param {Object} params 评论id
 * @returns {AxiosPromise}
 */
export function deleteCommentMessage(params) {
  return request({
    url: '/lecture/articleComment',
    method: 'delete',
    params
  })
}

/**
 * 禁用文章
 * @param {Object} params 文章id
 * @returns {AxiosPromise}
 */
export function disableCommentMessage(params) {
  return request({
    url: '/lecture/article/alterStatus/disable',
    method: 'post',
    params
  })
}

/**
 * 开放文章
 * @param {Object} params 文章id
 * @returns {AxiosPromise}
 */
export function enableCommentMessage(params) {
  return request({
    url: '/lecture/article/alterStatus/enable',
    method: 'post',
    params
  })
}

/**
 * 修改封面
 * @param {Number} id 文章id
 * @param {Object} picture 图片文件
 * @returns {AxiosPromise}
 */
export function alterCover(id, picture) {
  return request({
    url: '/lecture/article/alterCover',
    method: 'post',
    params: {
      id: id,
      cover: picture
    }
  })
}
