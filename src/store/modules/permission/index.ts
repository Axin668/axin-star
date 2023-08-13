import { Module } from 'vuex'
import RootStateTypes from '@/store/interface'
import PermissionStateTypes from './interface'
import { RouteRecordRaw } from 'vue-router'
import { constantRoutes } from '@/router'
import { listRoutes } from '@/api/menu'

const modules = import.meta.glob('../../../views/**/*.vue')
const Layout = () => import('@/layout/AppManageLayout.vue')

/**
 * Use meta.role to determine if the current user has permission
 *
 * @param roles 用户角色集合
 * @param route 路由
 * @returns
 */
const hasPermission = (roles: string[], route: RouteRecordRaw) => {
  if (route.meta && route.meta.roles) {
    if (roles.includes('ROOT')) {
      return true
    }
    return roles.some((role) => {
      if (route.meta?.roles !== undefined) {
        return (route.meta.roles as string[]).includes(role)
      }
    })
  }
}

/**
 * 递归过滤有权限的异步(动态)路由
 *
 * @param routes 接口返回的异步(动态)路由
 * @param roles 用户角色集合
 * @returns 返回用户有权限的异步(动态)路由
 */
const filterAsyncRoutes = (routes: RouteRecordRaw[], roles: string[]) => {
  const asyncRoutes: RouteRecordRaw[] = []

  routes.forEach((route) => {
    const tmpRoute = { ...route }

    //判断用户(角色)是否拥有该路由的访问权限
    if (hasPermission(roles, tmpRoute)) {
      if (tmpRoute.component?.toString() === 'Layout') {
        tmpRoute.component = Layout
      } else {
        const component = modules[`../../../views/**/${tmpRoute.component}.vue`]
        if (component) {
          tmpRoute.component = component
        } else {
          tmpRoute.component = modules[`../../../views/error-page/404.vue`]
        }
      }

      if (tmpRoute.children) {
        tmpRoute.children = filterAsyncRoutes(tmpRoute.children, roles)
      }

      asyncRoutes.push(tmpRoute)
    }
  })

  return asyncRoutes
}

const permissionModule: Module<PermissionStateTypes, RootStateTypes> = {
  namespaced: process.env.NODE_ENV !== 'production',
  state: {
    routes: []
  },
  mutations: {
    setRoutes(state, newRoutes: RouteRecordRaw[]) {
      state.routes = constantRoutes.concat(newRoutes)
    }
  },
  actions: {
    generateRoutes({ commit }, roles: string[]) {
      return new Promise<RouteRecordRaw[]>((resolve, reject) => {
        listRoutes()
          .then((resp: any) => {
            const { data: asyncRoutes } = resp
            const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
            console.log(accessedRoutes)
            commit('setRoutes', accessedRoutes)
            resolve(accessedRoutes)
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
  }
}

export default permissionModule

export function usePermissionStoreHook() {
  return permissionModule
}
