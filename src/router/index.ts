import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import clientRouter from './clientRouter'
import manageRouter from './manageRouter'

const Layout = () => import('@/layout/AppManageLayout.vue')

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
    component: () => import('@/views/manage/Login/index.vue'),
    meta: {
      hidden: false
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
        component: () => import('@/views/manage/dashboard/index.vue'),
        meta: {
          title: 'dashboard',
          icon: 'homepage',
          affix: true
        }
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

