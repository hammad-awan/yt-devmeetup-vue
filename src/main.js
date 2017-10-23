import Vue from 'vue'

import Vuetify from 'vuetify'
import './stylus/main.styl'

import App from './App'
import router from './router'
import store from './store'
import dateFilter from './filters/date'
import * as firebase from 'firebase'
import config from './config'

Vue.use(Vuetify)
Vue.filter('dateFilter', dateFilter)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created() {
    firebase.initializeApp(config.firebase)
  }
})
