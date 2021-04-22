import request from '@/utils/request'

export function getListCourse() {
  return request({
    url: '/courseManage/listCourse',
    method: 'get'
  })
}

export function getEvaluationByCourseId(params) {
  return request({
    url: '/evaluation/getEvaluationByCourseId',
    method: 'get',
    params: { courseId: params }
  })
}

export function getEvaluationByCourseName(params) {
  return request({
    url: '/evaluation/getEvaluationByCourseName',
    method: 'get',
    params: { evaluationName: params }
  })
}

export function updateEvaluation(params) {
  return request({
    url: '/evaluation/updateEvaluation',
    method: 'post',
    data: params
  })
}

export function deleteEvaluationById(params) {
  return request({
    url: '/evaluation/deleteEvaluationById',
    method: 'delete',
    params
  })
}
