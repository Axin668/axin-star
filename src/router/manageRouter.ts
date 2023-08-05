import AppManageLayout from '@/layout/AppManageLayout.vue'
import { RouterView } from 'vue-router'

const manageRouter = {
  path: '/manage',
  name: '后台管理',
  redirect: '/manage/home',
  component: AppManageLayout,
  children: [
    {
      path: 'home',
      name: 'Home',
      component: () => import('@/views/manage/home/index.vue'),
      meta: {
        title: '首页',
        icon: 'HomeFilled',
      },
    },
    {
      path: 'paper',
      name: '文章管理',
      component: () => import('@/views/manage/PaperManage/index.vue'),
      meta: {
        icon: 'EditPen',
      },
    },
    {
      path: 'user',
      name: '用户管理',
      component: RouterView,
      meta: {
        icon: 'User',
      },
      children: [
        {
          path: 'blacklist',
          name: '黑名单管理',
          component: () =>
            import('@/views/manage/UserManage/BlackList/index.vue'),
          meta: {
            icon: 'Lock',
          },
        },
      ],
    },
    {
      path: 'game',
      name: '程序管理',
      component: () => import('@/views/manage/GameManage/index.vue'),
      meta: {
        icon: 'Folder',
      },
    },
    {
      path: 'dashboard',
      name: '数据看板',
      component: RouterView,
      meta: {
        icon: 'DataAnalysis',
      },
      children: [
        {
          path: 'pv',
          name: 'user_visit',
          component: () => import('@/views/manage/DashBoard/PV/index.vue'),
          meta: {
            icon: 'DataBoard',
          },
        },
      ],
    },
    {
      path: 'setting',
      name: '全局设置',
      component: () => import('@/views/manage/Setting/index.vue'),
      meta: {
        icon: 'Setting',
      },
    },
  ],
}

export default manageRouter
