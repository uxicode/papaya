import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '@/views/login/Login';
import {getIsAuth} from '@/router/AuthGuard';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: getIsAuth,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path:'/signup',
    name:'signup',
    component: () => import('../views/signup/signup.vue'),
  },
  {
    path:'*',
    name:'notfound',
    component:() => import('../views/NotFound.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
