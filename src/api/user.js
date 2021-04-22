import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/elderAdmin/login',
    method: 'post',
    params: data
  })
}

export function getInfo() {
  return request({
    url: '/elderAdmin/getInfo',
    method: 'post'
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
