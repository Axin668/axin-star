//  src/utils/request.ts
import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { useManagerStoreHook } from '@/stores/modules/manager'
import { ElMessage, ElMessageBox } from 'element-plus'

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 50000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' }
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const managerStore = useManagerStoreHook();
    if (managerStore.token) {
      config.headers.Authorization = managerStore.token;
    }
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, msg } = response.data
    const message = msg || response.data.message
    // 登录成功
    if (code === '00000' || code === 200) {
      return response.data
    }
    // 响应数据为二进制流处理(Excel导出)
    if (response.data instanceof ArrayBuffer) {
      return response;
    }

    ElMessage.error(message || '系统出错')
    return Promise.reject(new Error(message || 'Error'))
  },
  (error: any) => {
    if (error.response.data) {
      const { code, msg } = error.response.data
      const message = msg || error.response.data.message
      // token 过期，跳转登录页
      if (code === 'A0230') {
        ElMessageBox.confirm('当前页面已失效，请重新登录', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          localStorage.clear() // @vueuse/core 自动导入
          window.location.href = '/'
        })
      } else {
        ElMessage.error(message || '系统出错')
      }
    }
    return Promise.reject(error.message)
  }
)

// 导出 axios 实例
export default service

