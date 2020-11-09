import './bootstrap.js';
import Vue from 'vue';

import App from './App.vue';

const Bus = new Vue()

export default Bus

new Vue({
  render: (h) => h(App),
}).$mount('#app');
