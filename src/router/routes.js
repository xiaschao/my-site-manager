/* Layout */
import Layout from '@/layout';

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
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

export default [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true,
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '控制台', icon: 'dashboard', auth: true },
      },
    ],
  },

  {
    path: '/banner',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Banner',
        component: () => import('@/views/banner'),
        meta: { title: '首页标语', icon: 'el-icon-s-home', auth: true },
      },
    ],
  },

  {
    path: '/article',
    component: Layout,
    redirect: '/article/list',
    name: 'Article',
    meta: { title: '文章管理', icon: 'el-icon-document' },
    children: [
      {
        path: 'list',
        name: 'ArticleList',
        component: () => import('@/views/article/articleList'),
        meta: { title: '文章列表', icon: 'el-icon-s-order', auth: true },
      },
      {
        path: 'category',
        name: 'ArticleCategory',
        component: () => import('@/views/article/articleCategory'),
        meta: { title: '文章分类', icon: 'el-icon-menu', auth: true },
      },
      {
        path: 'add',
        name: 'AddArticle',
        component: () => import('@/views/article/addArticle'),
        meta: { title: '添加文章', icon: 'el-icon-circle-plus', auth: true },
      },
      {
        path: 'edit/:id',
        name: 'EditArticle',
        hidden: true,
        component: () => import('@/views/article/articleList/editArticle'),
        meta: { title: '编辑文章', icon: 'el-icon-circle-plus', auth: true },
      },
      {
        path: 'comment',
        name: 'Comment',
        component: () => import('@/views/article/comment'),
        meta: { title: '评论管理', icon: 'el-icon-chat-line-round', auth: true },
      },
    ],
  },

  {
    path: '/project',
    component: Layout,
    redirect: '/project/list',
    name: 'Project',
    meta: { title: '项目管理', icon: 'el-icon-suitcase' },
    children: [
      {
        path: 'list',
        name: 'ProjectList',
        component: () => import('@/views/project/projectList'),
        meta: { title: '项目列表', icon: 'el-icon-notebook-1', auth: true },
      },
      {
        path: 'add',
        name: 'AddProject',
        component: () => import('@/views/project/addProject'),
        meta: { title: '添加项目', icon: 'el-icon-link', auth: true },
      },
    ],
  },

  {
    path: '/message',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Message',
        component: () => import('@/views/message'),
        meta: { title: '留言版', icon: 'el-icon-copy-document', auth: true },
      },
    ],
  },

  {
    path: '/about',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'About',
        component: () => import('@/views/about'),
        meta: { title: '关于我', icon: 'el-icon-s-custom', auth: true },
      },
    ],
  },

  {
    path: '/setting',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Setting',
        component: () => import('@/views/setting'),
        meta: { title: '设置', icon: 'el-icon-setting', auth: true },
      },
    ],
  },

  {
    path: '/account',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Account',
        component: () => import('@/views/account'),
        hidden: true,
        meta: { title: '账号中心', auth: true },
      },
    ],
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true },
];
