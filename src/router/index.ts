import { usePermissionStoreHook } from '@/stores/modules/permission'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { constantRoutes, errorRoutes } from './modules/constantRouter';

const router = createRouter({
  history: createWebHistory(),
  routes: [ ...constantRoutes as Array<RouteRecordRaw>, ...errorRoutes],
  strict: false,
  //与TagsView一致
  scrollBehavior: () => ({ left: 0, top: 0 })
})

/**
 * 重置路由
 */
export function resetRouter() {
  const permissionStore = usePermissionStoreHook();
  permissionStore.flatMenuListGet.forEach(route => { 
    const { name } = route;
    if (name && router.hasRoute(name)) router.removeRoute(name);
  })
}

export default router


