import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { SYSTEM_CONFIG } from './utils/config'

Vue.use(ElementUI)

Vue.config.productionTip = false

// 设置页面标题
document.title = SYSTEM_CONFIG.fullName

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
