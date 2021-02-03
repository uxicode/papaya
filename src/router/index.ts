import Vue from 'vue';
import VueRouter, {RawLocation, RouteConfig} from 'vue-router';
import Home from '../views/Home.vue';
import Login from '@/views/login/Login';
import SignInHeader from '@/components/header/signinHeader.vue';
import SignUpHeader from '@/components/header/signupHeader.vue';
import {getIsAuth} from '@/router/AuthGuard';

Vue.use(VueRouter);

// @ts-ignore
const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: getIsAuth,
  },
  {
    path: '/login',
    components: { default:Login, header:SignInHeader},
    children:[
      { path:'', name:'loginForm', component:()=> import('../views/login/loginForm/LoginForm') },
      {
        path:'findId',
        component:()=> import('../views/login/account/IdPwContainer'),
        children:[
          {path:'', name:'findId', component:()=>import('../views/login/findId/FindId') },
          {path:'resetPw', name:'resetPw', component:()=> import('../views/login/resetPw/ResetPassword') },
        ],
      },
    ],
  },
  {
    path:'/signup',
    name:'signup',
    components:{ default:() => import('../views/signup/signup.vue'),  header:SignUpHeader },
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

/*$router.push 로 같은 링크 재차 클릭 에러 방지.*/
const originalPath=VueRouter.prototype.push;
VueRouter.prototype.push = function( url:RawLocation) {
  // @ts-ignore
  return originalPath.call(this, url).catch( (error:any) => {
    if( error.name !=='NavigationDuplicated'){
      location.reload();
    }
  });
};
export default router;
