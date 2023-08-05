import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import clientRouter from './clientRouter'
import manageRouter from './manageRouter'

const Layout = () => import('@/layout/AppManageLayout.vue')

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    meta: {
      hidden: true,
    },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      hidden: true,
    },
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
      },
    ],
  },
]

const routes: Array<RouteRecordRaw> = [
  //管理端
  manageRouter,
  //客户端
  clientRouter,
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

/**
 * 重置路由
 */
export function resetRouter() {
  router.replace({ path: '/login' })
  location.reload()
}
