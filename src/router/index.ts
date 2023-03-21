import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: '/',
    component: () => import(/* webpackChunkName: "/" */ '@/views/Login.vue')
  },
  {
    path: '/home',
    name: 'home',
    redirect: '/home/users',
    component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
    children: [
      {
        path: 'users',
        name: 'users',
        component: () => import(/* webpackChunkName: "users" */ '@/views/users/UserList.vue')
      },
      {
        path: 'rights',
        name: 'rights',
        component: () => import(/* webpackChunkName: "rights" */ '@/views/rights/Rights.vue')
      },
      {
        path: 'roles',
        name: 'roles',
        component: () => import(/* webpackChunkName: "role" */ '@/views/rights/Role.vue')
      },
      {
        path: 'categories',
        name: 'categories',
        component: () => import(/* webpackChunkName: "categories" */ '@/views/goods/Categories.vue')
      },
      {
        path: 'params',
        name: 'params',
        component: () => import(/* webpackChunkName: "params" */ '@/views/goods/Params.vue')
      },
      {
        path: 'goods',
        name: 'goods',
        component: () => import(/* webpackChunkName: "goods" */ '@/views/goods/Goods.vue')

      },
      {
        path: 'orders',
        name: 'orders',
        component: () => import(/* webpackChunkName: "orders" */ '@/views/order/Orders.vue')
      },
      {
        path: 'reports',
        name: 'reports',
        component: () => import(/* webpackChunkName: "report" */ '@/views/report/Report.vue')
      },
      {
        path: 'goods/add',
        name: 'add',
        component: () => import(/* webpackChunkName: "add" */ '@/views/goods/AddGoods.vue')
      },
      {
        path: 'goods/addsuccess',
        name: 'addsuccess',
        component: () => import(/* webpackChunkName: "addsuccess" */ '@/views/goods/AddSuccess.vue')
      },
      {
        path: 'goods/edit/:id',
        name: 'edit',
        component: () => import(/* webpackChunkName: "edit" */ '@/views/goods/EditGoods.vue')
      }
    ]
  }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
