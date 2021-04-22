/*
* @Author: 卢贤睿
* @Date: 2020-07-12
* @Last Modified by: 卢贤睿
* @Last Modified time: 2020-11-13 21:19
*/

// 课程管理模块功能接口
import request from '@/utils/request'

/**
 * 获取机构下所有课程信息
 * @param {Number|null} pageNo 页数
 * @param {Number|null} pageSize 每页个数
 * @returns {Object}
 */
export function getCourseManageInfo(pageNo, pageSize) {
  return request({
    url: '/courseManage/listCourse',
    method: 'get',
    params: {
      pageNo: pageNo,
      pageSize: pageSize
    }
  })
}

/**
 * 创建课程
 * @param {String} courseName 课程名称
 * @param {Object []} courseImg 课程图片
 * @param {Number} courseType 课程类型
 * @param {String} teacherId 教师id
 * @param {String} teacherName 教师姓名
 * @param {Number} coursePrice 课程费用
 * @param {String} courseContent 课程内容
 * @param {String} courseBasicIntroduction 课程介绍
 * @param {String} courseLabel 课程标签
 * @param {String} courseSpecificIntroduction 课程简介
 * @returns {Object}
 */
export function createCourse(data) {
  return request({
    url: '/courseManage/create',
    method: 'post',
    // params: {
    //   courseName,
    //   courseImg,
    //   courseType,
    //   teacherId,
    //   teacherName,
    //   coursePrice,
    //   courseContent,
    //   courseBasicIntroduction,
    //   courseLabel,
    //   courseSpecificIntroduction
    // }
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: data
  })
}

/**
 * 删除课程
 * @param {Number} courseId 课程Id
 * @returns {Object}
 */
export function deleteCourse(courseId) {
  return request({
    url: '/courseManage/deleteCourse',
    method: 'delete',
    params: {
      courseId: courseId
    }
  })
}

/**
 * 获取课程详情
 * @param {*} courseId
 * @return {Object}
 */
export function getCourseDetail(courseId) {
  return request({
    url: '/courseManage/getCourseById',
    method: 'get',
    params: {
      courseId: courseId
    }
  })
}

/**
 * 修改课程
 * @param {Number} courseId 课程id
 * @param {String} courseName 课程名称
 * @param {Object []} courseImg 课程图片
 * @param {Number} courseType 课程类型
 * @param {Nmuber} teacherId 教师Id
 * @param {String} teacherName 教师姓名
 * @param {Number} coursePrice 课程费用
 * @param {String} courseContent 课程内容
 * @param {String} courseBasicIntroduction 课程介绍
 * @param {String} courseLabel 课程标签
 * @param {String} courseSpecificIntroduction 课程简介
 * @returns {Object}
 */
export function editCourseInfo(data) {
  return request({
    url: '/courseManage/updateCourse',
    method: 'post',
    // params: {
    //   courseId,
    //   courseName,
    //   courseImg,
    //   courseType,
    //   teacherId,
    //   teacherName,
    //   coursePrice,
    //   courseContent,
    //   courseBasicIntroduction,
    //   courseLabel,
    //   courseSpecificIntroduction
    // }
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: data
  })
}

/**
 * 上传课程封面文件接口
 * @param {Number} courseId 课程Id
 * @param {Object []} courseImg 课程图片
 * @returns {Object}
 */
export function uploadCourseImg(data) {
  return request({
    method: 'post',
    url: '/courseManage/uploadCourseImg',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: data
  })
}

/**
 * 获取购买了某课程的学生列表
 * @param {Number} courseId 课程Id
 * @returns {Object}
 */
export function getStudentByCourseId(courseId) {
  return request({
    url: '/courseManage/getStudentByCourseId',
    method: 'get',
    params: {
      courseId: courseId
    }
  })
}

/**
 * 获取机构所有教师
 * @returns {Object}
 */
export function getAllTeacherInfo() {
  return request({
    url: '/courseManage/getAllTeacher',
    method: 'get'
  })
}

/**
 * 查询课程信息（模糊搜索）
 * @param {String} courseName 课程名称
 * @returns {Object}
 */
export function getCourseInfo(courseName) {
  return request({
    url: '/courseManage/getCourseInfo',
    method: 'get',
    params: {
      courseName: courseName
    }
  })
}
