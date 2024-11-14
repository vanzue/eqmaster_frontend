import App from './App'
import messages from './locale/index'

let i18nConfig = {
  // locale: uni.getLocale(),
  // locale: 'zh-Hans',
  locale: 'en',
  messages
}


// VUE2
// #ifndef VUE3
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import './uni.promisify.adaptor'
Vue.use(VueI18n)
const i18n = new VueI18n(i18nConfig)

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	i18n,
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import { createI18n } from 'vue-i18n'
const i18n = createI18n(i18nConfig)
import store from './store'
export function createApp() {
  const app = createSSRApp(App)
  app.use(i18n)
  app.use(store)
  return {
    app
  }
}
// #endif