let AI_BASE_URL = ''
let PLUGIN_BASE_URL = ''

// production
if (import.meta.env.MODE === 'development') {
  AI_BASE_URL = 'https://ai.hezi.com:16150'
  PLUGIN_BASE_URL = "https://127.0.0.1:14567"
} else {
  AI_BASE_URL = '/api/'
  PLUGIN_BASE_URL = '/api/'
}

export const TIMEOUT = 10000

export { AI_BASE_URL, PLUGIN_BASE_URL }
