import formatBr from './formatBr'

const install = function(Vue) {
  Vue.directive('formatbr', formatBr)
}

if (window.Vue) {
  window.formatBr = formatBr
  Vue.use(install); // eslint-disable-line
}

formatBr.install = install
export default formatBr
