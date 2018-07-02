import Vue from 'vue';
import App from './App';
import router from './router/index';

import PaperDashboard from './plugins/paperDashboard';
import 'vue-notifyjs/themes/default.css';

import VueFirestore from 'vue-firestore'

Vue.use(VueFirestore);

Vue.use(PaperDashboard);

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app');

