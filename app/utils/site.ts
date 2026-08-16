export const siteConfig = {
  siteUrl: 'https://docs.daqiqerp.com',
  siteName: 'daqiq API Documentation',
  dashboardUrl: 'https://app.daqiqerp.com',
  apiBaseUrl: 'https://api.daqiqerp.com/api',
  apiDevBaseUrl: 'https://api-dev.goerp.net/api',
} as const

export function apiExampleUrl(path: string, useDev = false) {
  const base = useDev ? siteConfig.apiDevBaseUrl : siteConfig.apiBaseUrl
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}
