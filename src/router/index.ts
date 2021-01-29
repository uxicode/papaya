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
  // 일반 회원가입-약관동의
  {
    path:'/signup/termsCheck',
    name:'terms',
    components:{
      header:SignUpHeader,
      default:() => import('../views/signup/termsCheck/termsCheck.vue'),
    },
  },
  // 일반 회원가입-본인인증
  {
    path:'/signup/verify',
    name:'verify',
    components:{
      header:SignUpHeader,
      default:() => import('../views/signup/verify/verify.vue'),
    },
  },
  // 일반 회원가입-본인인증-인증완료
  {
    path:'/signup/verify/complete',
    name:'complete',
    components:{
      header:SignUpHeader,
      default:() => import('../views/signup/verify/complete/complete.vue'),
    },
  },
  // 일반 회원가입-개인정보 입력
  {
    path:'/signup/info',
    name:'info',
    components:{
      header:SignUpHeader,
      default:() => import('../views/signup/info/info.vue'),
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
