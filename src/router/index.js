import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','organization']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },

  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '主面板', icon: 'dashboard', affix: true }
    }]
  },

  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user', noCache: true }
      }
    ]
  },

  {
    path: '/courseManage',
    component: Layout,
    redirect: '/courseManage/courseManagement',
    name: 'CourseManagement',
    meta: { title: '课程管理', icon: 'example' },
    children: [
      {
        path: 'courseInfo',
        name: 'courseInfo',
        component: () => import('@/views/courseManagement/courseInfo'),
        meta: { title: '课程信息' }
      },
      {
        path: 'courseStatistics',
        component: () => import('@/views/courseManagement/courseStatistics'),
        name: 'CourseStatistics',
        meta: { title: '课程统计' }
      },
      {
        path: 'courseCreate',
        name: 'courseCreate',
        component: () => import('@/views/courseManagement/courseCreate'),
        meta: { title: '课程创建' }
      }
    ]
  },
  {
    path: '/feedBack',
    component: Layout,
    name: 'FeedBack',
    redirect: '/feedBack/feedBackManagement',
    meta: {
      title: '反馈管理',
      icon: 'table'
    },
    children: [
      {
        path: 'feedBackManagement',
        name: 'feedBackManagement',
        component: () => import('@/views/feedBack/index'),
        meta: { title: '反馈信息' }
      }
    ]
  },

  {
    path: '/financialManage',
    component: Layout,
    redirect: '/financialManage/courseFee',
    name: 'FinancialManagement',
    alwaysShow: true,
    meta: { title: '财务管理', icon: 'qiandai' },
    children: [
      {
        path: 'courseFee',
        component: () => import('@/views/financialManage/courseFee'),
        name: 'CourseFee',
        meta: { title: '课程收费' }
      },
      {
        path: 'paymentInformation',
        component: () => import('@/views/financialManage/paymentInformation'),
        name: 'PaymentInformation',
        meta: { title: '缴费信息' }
      },
      {
        path: 'refundRecord',
        component: () => import('@/views/financialManage/refundRecord'),
        name: 'RefundRecord',
        meta: { title: '退费记录' }
      },
      {
        path: 'feeSettlement',
        component: () => import('@/views/financialManage/feeSettlement'),
        name: 'feeSettlement',
        meta: { title: '收费结算' }
      },
      {
        path: 'teacherFeeSettings',
        component: () => import('@/views/financialManage/teacherFeeSettings'),
        name: 'teacherFeeSettings',
        meta: { title: '教师费用设置' }
      },
      {
        path: 'teacherFeeStatistics',
        component: () => import('@/views/financialManage/teacherFeeStatistics'),
        name: 'teacherFeeStatistics',
        meta: { title: '教师费用统计' }
      }
    ]
  },

  {
    path: '/attendanceManagement',
    component: Layout,
    name: 'AttendanceManagement',
    redirect: '/attendanceManagement',
    alwaysShow: true,
    meta: { title: '考勤管理', icon: 'eye-open' },
    children: [
      {
        path: 'index',
        name: 'AttendentList',
        component: () => import('@/views/attendanceManagement/index'),
        meta: { title: '考勤统计' }
      }
    ]
  },

  {
    path: '/resource',
    component: Layout,
    name: 'Resource',
    redirect: '/resource/resourceManagement',
    meta: {
      title: '资源管理',
      icon: 'nested'
    },
    children: [
      {
        path: 'resourceManagement',
        name: 'resourceManagement',
        component: () => import('@/views/resourceManagement/index'),
        meta: { title: '资源管理' }
      }
    ]
  },

  {
    path: '/evaluation',
    component: Layout,
    redirect: '/evaluation/evaluateContent',
    name: 'EvaluationManagement',
    alwaysShow: true,
    meta: { title: '评价管理', icon: 'evaluate' },
    children: [
      // 评价内容
      {
        path: 'evaluateContent',
        name: 'evaluateContent',
        component: () => import('@/views/evaluation/evaluateContent'),
        meta: { title: '评价内容' }
      }
    ]
  },

  {
    path: '/healthyManage',
    component: Layout,
    redirect: '/healthyManage/courseFee',
    name: 'HealthyManagement',
    alwaysShow: true,
    meta: { title: '健康管理', icon: 'peoples' },
    children: [
      {
        path: 'healthLabel',
        component: () => import('@/views/healthyManage/healthLabel'),
        name: 'HealthLabel',
        meta: { title: '养生讲堂标签统计' }
      },
      {
        path: 'articleInformation',
        component: () => import('@/views/healthyManage/articleInformation'),
        name: 'ArticleInformation',
        meta: { title: '文章信息' }
      }
    ]
  },

  {
    path: '/studyReport',
    component: Layout,
    redirect: '/studyReport',
    children: [{
      path: 'studyReport',
      name: 'StudyReport',
      component: () => import('@/views/studyReport/index'),
      meta: { title: '学习评估', icon: 'dashboard', affix: true }
    }]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/organizeManage',
    component: Layout,
    redirect: '/organize/organizeManage',
    name: 'Organize',
    meta: {
      title: '机构管理',
      icon: 'xuexiao',
      roles: ['admin']
    },
    children: [
      {
        path: 'organizeManage',
        name: 'OrganizeManage',
        component: () => import('@/views/organizeManage/index'),
        meta: { title: '机构管理' }
      }
    ]
  },

  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/table',
  //   name: 'Example',
  //   meta: { title: '开发示例', icon: 'example' },
  //   children: [
  //     {
  //       path: 'table',
  //       name: 'Table',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: 'Table', icon: 'table' }
  //     },
  //     {
  //       path: 'tree',
  //       name: 'Tree',
  //       component: () => import('@/views/tree/index'),
  //       meta: { title: 'Tree', icon: 'tree' }
  //     }
  //   ]
  // },

  // {
  //   path: '/form',
  //   component: Layout,
  //   meta: { roles: ['admin', 'organization'] },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: '表单示例', icon: 'form', roles: ['admin', 'organization'] }
  //     }
  //   ]
  // },

  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: '嵌套路由示例',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/page',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'Permission',
  //   meta: {
  //     title: '权限页面演示',
  //     icon: 'lock',
  //     roles: ['admin', 'organization'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'page',
  //       component: () => import('@/views/permission/page'),
  //       name: 'PagePermission',
  //       meta: {
  //         title: '页面级别权限演示',
  //         roles: ['admin', 'organization'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'directive',
  //       component: () => import('@/views/permission/directive'),
  //       name: 'DirectivePermission',
  //       meta: {
  //         title: '指令级别权限演示'
  //         // if do not set roles, means: this page does not require permission
  //       }
  //     },
  //     {
  //       path: 'role',
  //       component: () => import('@/views/permission/role'),
  //       name: 'RolePermission',
  //       meta: {
  //         title: '角色权限演示',
  //         roles: ['admin', 'organization']
  //       }
  //     }
  //   ]
  // },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
