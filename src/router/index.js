import Vue from 'vue'
import VueRouter from 'vue-router'
import { isLoggedIn } from '../utils/auth'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '../views/HomeView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "register" */ '../views/Register.vue')
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import(/* webpackChunkName: "forgot-password" */ '../views/ForgotPassword.vue')
  },
  {
    path: '/patent-classification',
    name: 'patent-classification',
    component: () => import(/* webpackChunkName: "patent-classification" */ '../views/PatentClassification.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/classification-history',
    name: 'classification-history',
    component: () => import(/* webpackChunkName: "classification-history" */ '../views/ClassificationHistory.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/patent-search',
    name: 'patent-search',
    component: () => import(/* webpackChunkName: "patent-search" */ '../views/PatentSearch.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isLoggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
