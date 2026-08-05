export const siteConfig = {
  dashboardUrl: 'https://app.daqiqerp.com',
  apiBaseUrl: 'https://api.daqiqerp.com/api',
  apiDevBaseUrl: 'https://api-dev.goerp.net/api',
  swaggerUrl: 'https://api.daqiqerp.com/api/swagger-ui/index.html',
  swaggerDevUrl: 'https://api-dev.goerp.net/api/swagger-ui/index.html',
} as const

export function apiExampleUrl(path: string, useDev = false) {
  const base = useDev ? siteConfig.apiDevBaseUrl : siteConfig.apiBaseUrl
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}
