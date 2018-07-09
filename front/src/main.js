import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'
import ElementUI from 'element-ui'
import enLang from 'element-ui/lib/locale/lang/en'
import lang from 'element-ui/lib/locale'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.use(VueResource)
Vue.use(ElementUI)
lang.use(enLang)

new Vue({
  render: h => h(App)
}).$mount('#app')