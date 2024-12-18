import type { AxiosRequestConfig, AxiosResponse } from 'axios'

// 针对AxiosRequestConfig配置进行拓展
export interface AIInterceptors<T = AxiosResponse> {
  requestSuccessFn?: (config: AxiosRequestConfig) => AxiosRequestConfig
  requestFailureFn?: (err: any) => any
  responseSuccessFn?: (res: T) => T
  responseFailureFn?: (err: any) => any
}

export interface AIRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: AIInterceptors<T>
}



export interface PluginInterceptors<T = AxiosResponse> {
  requestSuccessFn?: (config: AxiosRequestConfig) => AxiosRequestConfig
  requestFailureFn?: (err: any) => any
  responseSuccessFn?: (res: T) => T
  responseFailureFn?: (err: any) => any
}

export interface PluginRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: PluginInterceptors<T>
}
