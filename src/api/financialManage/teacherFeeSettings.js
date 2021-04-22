/*
* @Author: 吴晓斌
* @Date: 2020-09-11
* @Last Modified by: 吴晓斌
* @Last Modified time: 2020-09-11 09:23:21
*/
/**
 * @desc 教师费用设置接口
 */
import request from '@/utils/request'

export function getTeacherFeeSettingsList(query) {
  return request({
    url: '/vue-admin-template/teacherFeeSettings/list',
    method: 'get',
    params: query
  })
}

export function updateTeacherFeeSettingsList(data) {
  return request({
    url: '/vue-admin-template/updateTeacherFeeSettings',
    method: 'post',
    data
  })
}
