import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import Toast from 'muse-ui-toast'
import axios from 'axios'
import VueAxios from 'vue-axios'
import qs from 'qs'
Vue.prototype.qs = qs
// import VueMaterial from 'vue-material'
// import 'vue-material/dist/vue-material.min.css'
// import VueMaterial from 'vue-material'
// import 'vue-material/dist/vue-material.min.css'
// Vue.use(VueMaterial)

Vue.use(VueAxios, axios)
Vue.use(Toast)
Vue.use(MuseUI)
Vue.use(MuseUI)
Vue.config.productionTip = false
import global_ from './utils/Global'
Vue.prototype.GLOBAL = global_
// 导航钩子，全局钩子
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('token')
  let isLogin
  if (!token) {
    isLogin = false
  } else {
    isLogin = true
  }
  if (!isLogin) {
    if (to.path !== '/login') {
      return next({ path: '/login' })
    } else {
      next()
    }
  } else {
    if (to.path === '/login') {
      return next({ path: '/' })
    }
    next()
  }
})
//全局请求拦截
axios.interceptors.request.use((config) => {
  //请求的接口不是登录和验证码接口
  if (['/sysAdmin/login', '/captcha'].indexOf(config.url) === -1) {
    const token = localStorage.getItem('token')
    const roleId = localStorage.getItem('roleId')
    const adminId = JSON.parse(localStorage.getItem('user')).userId
    if (token) {
      //添加统一请求头
      config.headers.Authorization = token
      config.headers.roleId = roleId
      config.headers.adminId = adminId
    }
  }
  return config
})
new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App)
}).$mount('#app')
