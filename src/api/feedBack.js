/*
* @Author:吴晓斌
* @Date:2020-06-03
 * @Last Modified by: 吴晓斌
 * @Last Modified time: 2020-10-10 14:58:22
*/
import request from '@/utils/request'

/**
 * 获取所有用户反馈信息
 * @param {Number|null} pageNo 页数
 * @param {Number|null} pageSize 每页个数
 * @returns {Object}
 */
export function getFeedbackList(pageNo, pageSize) {
  return request({
    url: '/feedbackManage/getAllFeedback',
    method: 'get',
    params: {
      pageNo: pageNo,
      pageSize: pageSize
    }
  })
}

/**
 * 获取反馈详情
 * @param {Number} feedbackId 反馈Id
 * @param {0|1} userType 用户类型
 * @returns {Object}
 */
export function getFeedbackDetail(feedbackId, userType) {
  return request({
    url: '/feedbackManage/getFeedbackDetail',
    method: 'get',
    params: {
      feedbackId: feedbackId,
      userType: userType
    }
  })
}

/**
 * 删除反馈
 * @param {Number} feedbackId 反馈Id
 * @returns {Object}
 */
export function deleteFeedback(feedbackId) {
  return request({
    url: '/feedbackManage/deleteFeedback',
    method: 'delete',
    params: {
      feedbackId: feedbackId
    }
  })
}

/**
 * 单独删除反馈回复
 * @param {Number} answerId 回复Id
 * @returns {Object}
 */
export function deleteFeedbackAnswer(answerId) {
  return request({
    url: '/feedbackManage/deleteFeedbackAnswer',
    method: 'delete',
    params: {
      answerId: answerId
    }
  })
}

/**
 * 回复反馈
 * @param {Number} feedbackId 反馈Id
 * @param {String} answerContent 回复内容
 * @returns {Object}
 */
export function answerFeedback(feedbackId, answerContent) {
  return request({
    url: '/feedbackManage/answerFeedback',
    method: 'post',
    params: {
      feedbackId: feedbackId,
      answerContent: answerContent
    }
  })
}
