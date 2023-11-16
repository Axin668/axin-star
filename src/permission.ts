import router from '@/router'
import { useManagerStoreHook } from "@/stores/modules/manager";
import { usePermissionStoreHook } from "@/stores/modules/permission";
import { ElNotification } from 'element-plus';

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { LOGIN_URL } from './config';

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
          // 1.获取菜单列表 && 按钮权限列表
          await permissionStore.generateAuthMenus();
          // await authStore.getAuthButtonList();

          // 2.判断当前用户有没有菜单权限
          if (!permissionStore.authMenuListGet().length) {
            ElNotification({
              title: "无权限访问",
              message: "当前账号无任何菜单权限，请联系系统管理员！",
              type: "warning",
              duration: 3000
            });
            managerStore.resetStore();
            router.replace(LOGIN_URL);
            return Promise.reject("No permission");
          }
          
          // 3.添加动态路由
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

