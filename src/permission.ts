import router, { resetRouter } from '@/router'
import { useManagerStoreHook } from "@/stores/modules/manager";
import { usePermissionStoreHook } from "@/stores/modules/permission";

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { LOGIN_URL, ROUTER_WHITE_LIST } from './config';
import { initDynamicRouter } from './router/modules/dynamicRouter';

NProgress.configure({ showSpinner: false })

//白名单路由
const whiteList = ['/login']

/**
 * @description 路由拦截 beforeEach
 */
router.beforeEach(async (to, from, next) => {
  const managerStore = useManagerStoreHook()
  const permissionStore = usePermissionStoreHook()

  NProgress.start()

  // 2.动态设置标题
  const title = import.meta.env.VITE_GLOB_APP_TITLE;
  document.title = to.meta.title ? `${to.meta.title} - ${title}` : title;

  // 3.判断是否访问登陆页，有 Token 就在当前页面，没有 Token 重置路由到登陆页(针对注销操作)
  const hasToken = localStorage.getItem('accessToken')
  if (to.path.toLocaleLowerCase() === LOGIN_URL) {
    if (hasToken) return next(from.fullPath);
    resetRouter();
    return next();
  }

  // 4.判断访问页面是否在路由白名单地址(静态路由)中, 如果存在则直接放行
  if (ROUTER_WHITE_LIST.includes(to.path)) return next();

  // 5.判断是否有 Token, 没有就重定向到 login 页面(针对刷新操作)
  if (!managerStore.token) return next({ path: LOGIN_URL, replace: true });

  // 6.如果没有菜单列表, 就重新请求菜单列表并添加动态路由
  if (!permissionStore.authMenuListGet.length) {
    await initDynamicRouter();
    return next({ ...to, replace: true });
  }

  // 7.存储 routerName 做按钮权限筛选
  permissionStore.setRouteName(to.name as string);

  // 8.正常访问页面
  next();
})

/**
 * @description 路由跳转错误
 * */
router.onError(error => {
  NProgress.done();
  console.warn("路由错误", error.message);
});

/**
 * @description 路由跳转结束
 */
router.afterEach(() => {
  NProgress.done()
})

