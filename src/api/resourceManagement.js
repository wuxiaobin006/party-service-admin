/*
* @Author:吴晓斌
* @Date:2020-07-20
 * @Last Modified by: 吴晓斌
 * @Last Modified time: 2020-11-09 14:30:52
*/
import request from '@/utils/request'

/**
 * 获取所有资源
 * @param {Number|null} pageNo 页数
 * @param {Number|null} pageSize 每页个数
 * @returns {Object}
 */
export function getResourceList(pageNo, pageSize) {
  return request({
    url: '/resourcesManage/getAllResource',
    method: 'get',
    params: {
      pageNo: pageNo,
      pageSize: pageSize
    }
  })
}

/**
 * 根据名字搜索资源
 * @param {String} resourceName 资源名称
 * @param {Number|null} pageNo 页数
 * @param {Number|null} pageSize 每页个数
 * @returns {Object}
 */
export function getResourceByName(resourceName, pageNo, pageSize) {
  return request({
    url: '/resourcesManage/getResourceByName',
    method: 'get',
    params: {
      resourceName: resourceName,
      pageNo: pageNo,
      pageSize: pageSize
    }
  })
}

/**
 * 根据课程Id搜索资源
 * @param {Number} courseId 课程Id
 * @param {Number|null} pageNo 页数
 * @param {Number|null} pageSize 每页个数
 * @returns {Object}
 */
export function getResourceByCourseId(courseId, pageNo, pageSize) {
  return request({
    url: '/resourcesManage/getResourceByCourseId',
    method: 'get',
    params: {
      courseId: courseId,
      pageNo: pageNo,
      pageSize: pageSize
    }
  })
}

/**
 * 删除资源
 * @param {String} resourceId 资源Id
 * @returns {Object}
 */
export function deleteResourceById(resourceId) {
  return request({
    url: '/resourcesManage/deleteResourceById',
    method: 'delete',
    params: {
      resourceId: resourceId
    }
  })
}

/**
 * 上传资源
 * @param {Number} courseId 课程Id
 * @param {Number} seq 课时
 * @returns {Object}
 */
export function upload(formData) {
  return request({
    url: 'resourcesManage/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data;boundary=' + new Date().getTime()
    },
    data: formData,
    params: {
      courseId: formData.get('courseId'),
      seq: formData.get('seq')
    }
  })
}

/**
 * 添加下载次数接口
 * @param {String} resourceId 资源Id
 * @returns {Object}
 */
export function increaseDownTimes(resourceId) {
  return request({
    url: 'resourcesManage/increaseDownTimes',
    method: 'post',
    params: {
      resourceId: resourceId
    }
  })
}
