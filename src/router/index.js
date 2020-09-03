import Vue from 'vue'
import Router from 'vue-router'
  
import photoEditor from '../page/photoEditor'  

Vue.use(Router);

export default new Router({
  routes: [
     {
        path: '/',
        name: 'photoEditor',
        component: photoEditor,
        // meta: {
        //   keepAlive: true
        // }
      } 
  ],
  mode: 'hash',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {x: 0, y: 0}
    }
  }
})
