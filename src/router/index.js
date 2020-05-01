import Vue from 'vue'
import VueRouter from 'vue-router'
import goTo from 'vuetify/es5/services/goto'
import Layout from '../views/Layout.vue'
import Dashboard from '../views/home/Dashboard.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('../views/systemManage/About.vue')
      },
      {
        path: 'musiclist',
        name: 'MusicList',
        component: () => import('../views/musicManage/MusicList.vue')
      },
      {
        path: 'music-type',
        name: 'MusicType',
        component: () => import('../views/musicManage/MusicType.vue')
      },
      {
        path: 'music',
        name: 'Music',
        component: () => import('../views/musicManage/Music.vue')
      },
      {
        path: 'album',
        name: 'Album',
        component: () => import('../views/musicManage/Album.vue')
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('../views/systemManage/Role.vue')
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('../views/systemManage/User.vue')
      },
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('../views/systemManage/Menu.vue')
      },
      {
        path: 'permission',
        name: 'Permission',
        component: () => import('../views/systemManage/Permission.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/Login.vue')
  }
]

const router = new VueRouter({
  scrollBehavior: (to, from, savedPosition) => {
    let scrollTo = 0

    if (to.hash) {
      scrollTo = to.hash
    } else if (savedPosition) {
      scrollTo = savedPosition.y
    }
    return goTo(scrollTo)
  },
  routes
})

export default router
