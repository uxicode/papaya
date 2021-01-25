import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '@/views/login/Login';
import SignInHeader from '@/components/header/signinHeader.vue';
import SignUpHeader from '@/components/header/signupHeader.vue';
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
    components: {
      header:SignInHeader,
      default:Login,
    },
  },
  {
    path:'/signup',
    name:'signup',
    components:{
      header:SignUpHeader,
      default:() => import('../views/signup/signup.vue'),
    },
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
