import AppLayout from '@/views/AppLayout.vue'
import { RouterView } from 'vue-router'

const manageRouter = {
    path: '/',
    component: AppLayout,
    children: [
        {
            path: '/manage',
            name: 'Home',
            component: RouterView,
            meta: {
                title: '首页',
                icon: 'HomeFilled'
            },
        },
        {
            path: '/manage/paper',
            name: '文章管理',
            component: RouterView,
            meta: {
                icon: 'EditPen'
            }
        },
        {
            path: '/manage/user',
            name: '用户管理',
            component: RouterView,
            meta: {
                icon: 'User'
            },
            children: [
                {
                    path: 'blacklist',
                    name: '黑名单管理',
                    component: () => import('@/views/manage/UserManage/BlackList/index.vue'),
                    meta: {
                        icon: 'Lock'
                    }

                }
            ]
       },
       {
            path: '/manage/game',
            name: '程序管理',
            component: RouterView,
            meta: {
                icon: 'Folder'
            }
       },
       {
            path: '/manage/dashboard',
            name: '数据看板',
            component: RouterView,
            meta: {
                icon: 'DataAnalysis'
            },
            children: [
                {
                    path: 'pv',
                    name: 'user_visit',
                    component: () => import('@/views/manage/DashBoard/PV/index.vue'),
                    meta: {
                        icon: 'DataBoard'
                    }
                }
            ]
       },
       {
            path: '/manage/setting',
            name: '全局设置',
            component: RouterView,
            meta: {
                icon: 'Setting'
            }
       }
    ]
}

export default manageRouter