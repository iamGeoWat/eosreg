import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'
import ElementUI from 'element-ui'
import enLang from 'element-ui/lib/locale/lang/en'
import lang from 'element-ui/lib/locale'
import 'element-ui/lib/theme-chalk/index.css'

import VueRouter from 'vue-router'
Vue.use(VueRouter)

Vue.config.productionTip = false
Vue.use(VueResource)
Vue.use(ElementUI)
lang.use(enLang)

import LangZhs from './components/LangZhs.vue'
import LangEng from './components/LangEng.vue'
const routes = [
  { path: '/en', component: LangEng},
  { path: '/zh', component: LangZhs}
]
const router = new VueRouter({
  routes
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')