import { Module } from 'vuex'
import RootStateTypes from '@/store/interface'
import ManagerStateTypes from './interface'
import { loginApi, logoutApi } from '@/api/auth'
import { getManagerInfo } from '@/api/manager'
import { resetRouter } from '@/router'

import { LoginData } from '@/api/auth/types'
import { ManagerInfo } from '@/api/manager/types'

const token = useStorage('accessToken', '')
const managerModule: Module<ManagerStateTypes, RootStateTypes> = {
  namespaced: process.env.NODE_ENV !== 'production',
  state: {
    managerId: -1,
    token: token.value,
    managerName: '',
    avatar: '',
    roles: [],
    perms: []
  },
  mutations: {
    setManager(state, manager: ManagerInfo) {
      Object.assign(state, manager)
    },
    resetManager(state) {
      localStorage.setItem('accessToken', '')
      state.token = ''
      state.managerName = ''
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
      return new Promise<ManagerInfo>((resolve, reject) => {
        getManagerInfo()
          .then((resp) => {
            console.log(resp)
            const { data } = resp
            if (!data) {
              return reject('Verification failed, please Login again.')
            }
            if (!data.roles || data.roles.length <= 0) {
              reject('getManagerInfo: roles must be a non-null array!')
            }
            commit('setManager', {
              managerId: data.managerId,
              managerName: data.managerName,
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
            commit('resetManager')
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

export default managerModule

// 非setup
export function useManagerStoreHook() {
  return managerModule
}

