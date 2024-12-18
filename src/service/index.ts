import { AI_BASE_URL, PLUGIN_BASE_URL, TIMEOUT } from './config'
import { AIRequest } from './requests'

const aiRequest = new AIRequest({
  baseURL: AI_BASE_URL,
  timeout: TIMEOUT,
})

const pluginRequest = new AIRequest({
  baseURL: PLUGIN_BASE_URL,
  timeout: TIMEOUT,
})

export { aiRequest, pluginRequest }
