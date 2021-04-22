import defaultSettings from '@/settings'

const title = defaultSettings.title || '健康书院后台管理端'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
