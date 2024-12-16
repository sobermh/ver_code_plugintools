let BASE_URL = ''

// production
if (import.meta.env.MODE === 'development') {
  BASE_URL = 'http://localhost:3001/'
} else {
  BASE_URL = '/api/'
}

export const TIMEOUT = 10000

// export default { BASE_URL }
export { BASE_URL }
