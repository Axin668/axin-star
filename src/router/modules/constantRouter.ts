import { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layouts/index.vue')

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
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          icon: 'HomeFilled',
          isAffix: true,
          isKeepAlive: false
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

/**
 * errorRouter (错误页面路由)
 */
export const errorRoutes = [
    {
      path: "/403",
      name: "403",
      component: () => import("@/components/ErrorMessage/403.vue"),
      meta: {
        title: "403页面"
      }
    },
    {
      path: "/404",
      name: "404",
      component: () => import("@/components/ErrorMessage/404.vue"),
      meta: {
        title: "404页面"
      }
    },
    {
      path: "/500",
      name: "500",
      component: () => import("@/components/ErrorMessage/500.vue"),
      meta: {
        title: "500页面"
      }
    },
    // Resolve refresh page, route warnings
    {
      path: "/:pathMatch(.*)*",
      component: () => import("@/components/ErrorMessage/404.vue")
    }
  ];