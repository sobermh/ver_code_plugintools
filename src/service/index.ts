import { BASE_URL, TIMEOUT } from './config'
import MHRequest from './requests'

const mhRequest = new MHRequest({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
})

export default mhRequest
