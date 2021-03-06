import Vue from 'vue';
import Vuex from 'vuex';
import AuthModule from '@/store/auth.module';
import PageHistoryStatus from '@/store/PageHistoryStatus';
import {GET_TOKEN} from '@/store/mutation-auth-types';

Vue.use(Vuex);

const store = new Vuex.Store({
  // state: {},
  modules: {
    Auth: AuthModule,
    History: PageHistoryStatus,
  },
});

const {token} = localStorage;

store.commit(`Auth/${GET_TOKEN}`, localStorage.getItem('token'));
export default store;
