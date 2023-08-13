import { Module } from 'vuex'
import RootStateTypes from '@/store/interface'
import UserStateTypes from './interface'
import { loginApi, logoutApi } from '@/api/auth'
import { getUserInfo } from '@/api/user'
import { resetRouter } from '@/router'

import { LoginData } from '@/api/auth/types'
import { UserInfo } from '@/api/user/types'

const token = useStorage('accessToken', '')
const userModule: Module<UserStateTypes, RootStateTypes> = {
  namespaced: process.env.NODE_ENV !== 'production',
  state: {
    userId: -1,
    token: token.value,
    nickname: '',
    avatar: '',
    roles: [],
    perms: []
  },
  mutations: {
    setUser(state, user: UserInfo) {
      Object.assign(state, user)
    },
    resetUser(state) {
      localStorage.setItem('accessToken', '')
      state.token = ''
      state.nickname = ''
      state.avatar = ''
      state.roles = []
      state.perms = []
    }
  },
  actions: {
    login({ state }, loginData: LoginData) {
      return new Promise<void>((resolve, reject) => {
        loginApi(loginData)
          .then((response) => {
            const { tokenType, accessToken } = response.data
            state.token = tokenType + ' ' + accessToken
            localStorage.setItem('accessToken', state.token)
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getInfo({ commit }) {
      return new Promise<UserInfo>((resolve, reject) => {
        getUserInfo()
          .then((resp) => {
            const { data } = resp
            if (!data) {
              return reject('Verification failed, please Login again.')
            }
            if (!data.roles || data.roles.length <= 0) {
              reject('getUserInfo: roles must be a non-null array!')
            }
            commit('setUser', {
              userId: data.userId,
              nickname: data.nickname,
              avatar: data.avatar,
              roles: data.roles,
              perms: data.perms
            })
            resolve(data)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    logout({ commit }) {
      return new Promise<void>((resolve, reject) => {
        logoutApi()
          .then(() => {
            resetRouter()
            commit('resetUser')
            location.reload()
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
  },
  getters: {
    isLogin(state) {
      return !!state.token
    },
    token(state) {
      return state.token
    },
    roles(state) {
      return state.roles
    },
    hasRole(state) {
      return (role: string) => {
        return state.roles.includes(role)
      }
    },
    hasPermission: (state) => (perm: string) => state.perms.includes(perm)
  }
}

export default userModule

// 非setup
export function useUserStoreHook() {
  return userModule
}

