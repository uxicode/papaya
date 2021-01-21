import 'babel-polyfill';
import 'es6-promise/auto'; //적어도 Vuex 나 axios 를 사용하는 시점보다는 빨리 불러와야 정상 동작한다
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import './filters';
/*//공통 이벤트에 대한 후크를 사용하여 서비스 작업자 등록을 단순화한다.*/
import './registerServiceWorker';

Vue.config.productionTip = false;
Vue.config.errorHandler=( err:Error, vm:Vue, info:string ) => {
  console.log(`Error ${err.toString()}\n info: ${info}`, err );
};
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
