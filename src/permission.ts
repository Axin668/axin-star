import router from '@/router'
import { useStore } from '@/store'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { RouteRecordRaw } from 'vue-router'
NProgress.configure({ showSpinner: false })

const store = useStore()

//白名单路由
const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const hasToken = localStorage.getItem('accesToken')
  if (hasToken) {
    if (to.path === '/login') {
      //如果已登陆, 则跳转首页
      next({ path: '/' })
      NProgress.done()
    } else {
      //去别的地方看是否有权限
      const hasRoles =
        store.state.user.roles && store.state.user.roles.length > 0
      if (hasRoles) {
        //未匹配任何路由, 跳转404
        if (to.matched.length === 0) {
          from.name ? next({ name: from.name }) : next('/404')
        } else {
          next()
        }
      } else {
        try {
          const { roles } = await store.dispatch('user/getInfo')
          const accessRoutes = await store.dispatch(
            'permission/generateRoutes',
            roles
          )
          accessRoutes.forEach((route: RouteRecordRaw) => {
            router.addRoute(route)
          })
          next({ ...to, replace: true })
        } catch (error) {
          await store.commit('user/resetUser')
          //redirect回传, 用户登陆之后去往最初要访问的页面, 而非系统默认
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

