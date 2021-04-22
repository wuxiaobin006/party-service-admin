/*
 * @Author:冯伟棋
 * @Date:2020-09-08
 * @Last Modified by: 冯伟棋
 * @Last Modified time: 2020-09-08 15:28:01
 */

import request from '@/utils/request'

export function getattendanceList(params) {
  return request({
    url: '/vue-admin-template/attendanceManagement/list',
    method: 'get',
    params
  })
}
