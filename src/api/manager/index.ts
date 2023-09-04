import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { ManagerInfo } from './types'

/**
 * 登录成功后获取用户信息（昵称、头像、权限集合和角色集合）
 */
export function getManagerInfo(): AxiosPromise<ManagerInfo> {
  return request({
    url: '/api/managers/me',
    method: 'get'
  })
}

