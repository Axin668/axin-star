import router from '@/router'
import { useManagerStoreHook } from "@/stores/modules/manager";
import { usePermissionStoreHook } from "@/stores/modules/permission";

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { RouteRecordRaw } from 'vue-router'

NProgress.configure({ showSpinner: false })

const permissionStore = usePermissionStoreHook();

//白名单路由
const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const hasToken = localStorage.getItem('accessToken')
  if (hasToken) {
    if (to.path === '/login') {
      //如果已登陆, 则跳转首页
      next({ path: '/' })
      NProgress.done()
    } else {
      const managerStore = useManagerStoreHook()
      //去别的地方看是否有权限
      const hasRoles = managerStore.manager.roles && managerStore.manager.roles.length > 0;
      if (hasRoles) {
        //未匹配任何路由, 跳转404
        if (to.matched.length === 0) {
          from.name ? next({ name: from.name }) : next('/404')
        } else {
          next()
        }
      } else {
        try {
          const { roles } = await managerStore.getInfo();
          const accessRoutes = await permissionStore.generateRoutes(roles);
          accessRoutes.forEach((route) => {
            router.addRoute(route);
          });
          next({ ...to, replace: true })
        } catch (error) {
          await managerStore.resetStore();
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

