import Mock from 'mockjs'
import { param2Obj } from '../src/utils'

import user from './user'
import table from './table'
import classStatistics from './ClassStatistics'
import organizeManage from './schoolManage/organizeManage'
import courseTime from './schoolManage/courseTime'
import feedBack from './feedBack'
import resourceManagement from './resourceManagement'
import attendManagement from './attendanceManagement'
import courseFee from './financialManage/courseFee'
import paymentInformation from './financialManage/paymentInformation'
import refundRecord from './financialManage/refundRecord'
import feeSettlement from './financialManage/feeSettlement'
import teacherFeeSettings from './financialManage/teacherFeeSettings'
import teacherFeeStatistics from './financialManage/teacherFeeStatistics'
import courseManage from './courseManage'

const mocks = [
  ...user,
  ...table,
  ...classStatistics,
  ...organizeManage,
  ...feedBack,
  ...resourceManagement,
  ...courseTime,
  ...courseFee,
  ...resourceManagement,
  ...attendManagement,
  ...paymentInformation,
  ...refundRecord,
  ...feeSettlement,
  ...teacherFeeSettings,
  ...teacherFeeStatistics,
  ...courseManage
]

// for front mock
// please use it cautiously, it will redefine XMLHttpRequest,
// which will cause many of your third-party libraries to be invalidated(like progress event).
export function mockXHR() {
  // mock patch
  // https://github.com/nuysoft/Mock/issues/300
  Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
  Mock.XHR.prototype.send = function() {
    if (this.custom.xhr) {
      this.custom.xhr.withCredentials = this.withCredentials || false

      if (this.responseType) {
        this.custom.xhr.responseType = this.responseType
      }
    }
    this.proxy_send(...arguments)
  }

  function XHR2ExpressReqWrap(respond) {
    return function(options) {
      let result = null
      if (respond instanceof Function) {
        const { body, type, url } = options
        // https://expressjs.com/en/4x/api.html#req
        result = respond({
          method: type,
          body: JSON.parse(body),
          query: param2Obj(url)
        })
      } else {
        result = respond
      }
      return Mock.mock(result)
    }
  }

  for (const i of mocks) {
    Mock.mock(new RegExp(i.url), i.type || 'get', XHR2ExpressReqWrap(i.response))
  }
}

// for mock server
const responseFake = (url, type, respond) => {
  return {
    url: new RegExp(`${process.env.VUE_APP_BASE_API}${url}`),
    type: type || 'get',
    response(req, res) {
      console.log('request invoke:' + req.path)
      res.json(Mock.mock(respond instanceof Function ? respond(req, res) : respond))
    }
  }
}

export default mocks.map(route => {
  return responseFake(route.url, route.type, route.response)
})
