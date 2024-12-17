let BASE_URL = ''

// production
if (import.meta.env.MODE === 'development') {
  BASE_URL = 'https://ai.hezi.com:16150'
} else {
  BASE_URL = '/api/'
}

export const TIMEOUT = 10000

// export default { BASE_URL }
export { BASE_URL }
