import Vue from 'vue';
import Vuex from 'vuex';
import AuthModule from '@/store/auth.module';
import ClassModule from '@/store/class.module';
import PageHistoryStatus from '@/store/PageHistoryStatus';
import {GET_TOKEN} from '@/store/mutation-auth-types';
import {SET_CLASS_ID, SET_MYCLASS_HOME_DATA} from '@/store/mutation-class-types';

Vue.use(Vuex);

const store = new Vuex.Store({
  // state: {},
  modules: {
    Auth: AuthModule,
    History: PageHistoryStatus,
    MyClass: ClassModule,
  },
});

const {classId, homeData} = localStorage;
// console.log('vue store index.ts/ localStorage 추출값 classId=', classId);
// console.log('vue store index.ts/ localStorage 추출값 homeData=', homeData);

if ( classId ) {
  store.commit(`MyClass/${SET_CLASS_ID}`, localStorage.getItem('classId') );
}
if (homeData) {
  store.commit(`MyClass/${SET_MYCLASS_HOME_DATA}`, JSON.parse( localStorage.getItem('homeData') as string ) );
}
// store.commit(`Auth/${ACCESS_TOKEN}`, localStorage.getItem('user'));
export default store;
