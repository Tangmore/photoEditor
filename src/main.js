// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias. 
import 'lib-flexible/flexible'
import './assets/font/iconfont.css' 
    
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios';

axios.defaults.withCredentials=true;

Vue.prototype.$axios = axios;

let instance = axios.create({
  baseURL: global.baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
});
Vue.prototype.instance = instance;

import QS from 'qs'
Vue.prototype.qs = QS;

import VueTouch from"vue-touch";
Vue.use(VueTouch, {name:'v-touch'})

Vue.config.productionTip = false;
 
import globalVariable from './global_variable'
Vue.prototype.global=globalVariable;
  
// import vConsole from 'vconsole'
// Vue.prototype.vConsole= new vConsole();
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  // mounted(){
  //   let par='http://'+window.location.host+'/clouds';
  //   sessionStorage.setItem('localUrl',par);
  // }
});
