// src/api/auth/index.ts
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { LoginData, LoginResult, CaptchaResult } from './types'

/**
 * 登录API
 *
 * @param data {LoginData}
 * @returns
 */
export function loginApi(data: LoginData): AxiosPromise<LoginResult> {
  return request({
    url: '/api/auth/login',
    method: 'post',
    params: data
  })
}

/**
 * 注销API
 */
export function logoutApi() {
  return request({
    url: '/api/auth/logout',
    method: 'delete'
  })
}

/**
 * 获取验证码
 */
export function getCaptchaApi(): AxiosPromise<CaptchaResult> {
  return request({
    url: '/api/auth/captcha',
    method: 'get'
  })
}

