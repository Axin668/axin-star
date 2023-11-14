import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layout/Layout.vue')

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    meta: {
      hidden: true
    },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/DashBoard/PV/index.vue'),
        meta: {
          title: '首页',
          icon: 'homepage',
          affix: true,
          keepAlive: true
        }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404.vue'),
        meta: { hidden: true }
      }
    ]
  }
]

// const routes: Array<RouteRecordRaw> = [
//   //管理端
//   manageRouter
// ]

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes as Array<RouteRecordRaw>,
  //与TagsView一致
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export default router

/**
 * 重置路由
 */
export function resetRouter() {
  router.replace({ path: '/login' })
  location.reload()
}

