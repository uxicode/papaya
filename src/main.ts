import 'babel-polyfill';
import 'es6-promise/auto'; //적어도 Vuex 나 axios 를 사용하는 시점보다는 빨리 불러와야 정상 동작한다
// vee-validation custom 부분 호출
import {SIGNIN_BY_TOKEN} from '@/store/action-auth-types'; //사스 파일은 하나로 통일시키는 것이 좋다 여러개를 여기서 로드 시키면 여러번 호출된다.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import './filters/index';
/*//공통 이벤트에 대한 후크를 사용하여 서비스 작업자 등록을 단순화한다.*/
import './registerServiceWorker';
import './components/validation/validation';
import './assets/scss/common.scss';

Vue.config.productionTip = false;
Vue.config.errorHandler = (err: Error, vm: Vue, info: string) => {
  console.log(`Error ${err.toString()}\n info: ${info}`, err, vm);
};

function init(){
  const {token} = localStorage;
  if( token ){
    return store.dispatch(`Auth/${SIGNIN_BY_TOKEN}`, token);
  }else{
    return Promise.resolve();
  }
}

init().then((res)=>{
  new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount('#app');
});


/*
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
*/
