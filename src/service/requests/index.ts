import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { AIRequestConfig, PluginRequestConfig } from './type'

// 拦截器：蒙版Loding/token/修改配置

// 两个难点：
//   1.拦截器进行精细控制
//     > 全局拦截器
//     > 实例拦截器
//     > 单次请求拦截器
//   2.响应结果的类型处理（泛型）

class AIRequest {
  instance: AxiosInstance

  // request实例 =》axios实例
  constructor(config: AIRequestConfig) {
    this.instance = axios.create(config)

    // 每个instance实例都添加拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // loading/token
        console.log('全局请求成功拦截')
        return config
      },
      (err) => {
        console.log('全局请求失败拦截')
        return err
      },
    )

    this.instance.interceptors.response.use(
      (res) => {
        console.log('全局响应成功拦截')
        return res.data
      },
      (err) => {
        console.log('全局响应失败拦截')
        return err
      },
    )

    // 针对特定的AIrequest实例添加拦截器
    this.instance.interceptors.request.use(
      config.interceptors?.requestSuccessFn as any,
      config.interceptors?.requestFailureFn,
    )
    this.instance.interceptors.response.use(
      config.interceptors?.responseSuccessFn,
      config.interceptors?.responseFailureFn,
    )
  }

  request<T = any>(config: AIRequestConfig<T>) {
    //单次请求的成功拦截处理
    if (config.interceptors?.requestSuccessFn) {
      config = config.interceptors?.requestSuccessFn(config)
    }
    // 返回Promise
    return new Promise<T>((resolve, reject) => {
      this.instance
        .request<any, T>(config)
        .then((res) => {
          // 单次响应的成功拦截处理
          if (config.interceptors?.responseSuccessFn) {
            res = config.interceptors?.responseSuccessFn(res)
          }
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  get<T = any>(config: AIRequestConfig<T>) {
    return this.request({ ...config, method: 'GET' })
  }
  post<T = any>(config: AIRequestConfig<T>) {
    return this.request({ ...config, method: 'POST' })
  }
  delete<T = any>(config: AIRequestConfig<T>) {
    return this.request({ ...config, method: 'DELETE' })
  }
  patch<T = any>(config: AIRequestConfig<T>) {
    return this.request({ ...config, method: 'PATCH' })
  }
}

class PluginRequest {
  instance: AxiosInstance

  // request实例 =》axios实例
  constructor(config: PluginRequestConfig) {
    this.instance = axios.create(config)

    // 每个instance实例都添加拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // loading/token
        console.log('全局请求成功拦截')
        return config
      },
      (err) => {
        console.log('全局请求失败拦截')
        return err
      },
    )

    this.instance.interceptors.response.use(
      (res) => {
        console.log('全局响应成功拦截')
        return res.data
      },
      (err) => {
        console.log('全局响应失败拦截')
        return err
      },
    )

    // 针对特定的PluginRequest实例添加拦截器
    this.instance.interceptors.request.use(
      config.interceptors?.requestSuccessFn as any,
      config.interceptors?.requestFailureFn,
    )
    this.instance.interceptors.response.use(
      config.interceptors?.responseSuccessFn,
      config.interceptors?.responseFailureFn,
    )
  }

  request<T = any>(config: PluginRequestConfig<T>) {
    //单次请求的成功拦截处理
    if (config.interceptors?.requestSuccessFn) {
      config = config.interceptors?.requestSuccessFn(config)
    }
    // 返回Promise
    return new Promise<T>((resolve, reject) => {
      this.instance
        .request<any, T>(config)
        .then((res) => {
          // 单次响应的成功拦截处理
          if (config.interceptors?.responseSuccessFn) {
            res = config.interceptors?.responseSuccessFn(res)
          }
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  get<T = any>(config: PluginRequestConfig<T>) {
    return this.request({ ...config, method: 'GET' })
  }
  post<T = any>(config: PluginRequestConfig<T>) {
    return this.request({ ...config, method: 'POST' })
  }
  delete<T = any>(config: PluginRequestConfig<T>) {
    return this.request({ ...config, method: 'DELETE' })
  }
  patch<T = any>(config: PluginRequestConfig<T>) {
    return this.request({ ...config, method: 'PATCH' })
  }
}

export { AIRequest, PluginRequest }
