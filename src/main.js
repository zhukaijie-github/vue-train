import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
// 计算大小
Vue.prototype.$formSize = size => {
  let str = 0;
  if (size > 1024 * 1024) {
    str = (size / 1024 / 1024).toFixed(2) + 'MB';
  } else {
    str = (size / 1024).toFixed(2) + 'KB';
  }
  return str;
};

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
