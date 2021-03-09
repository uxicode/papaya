import Vue from 'vue';
import VueRouter, {RawLocation, RouteConfig} from 'vue-router';
import MyClassList from '@/views/class/myClassList';
import AppHeader from '@/components/header/header.vue';
import AppFooter from '@/components/footer/footer.vue';
import {getIsAuth} from '@/router/AuthGuard';
import {LoginRouter} from '@/router/LoginRouter';
import {SignUpRouter} from '@/router/SignUpRouter';

Vue.use(VueRouter);

// @ts-ignore
const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'home',
    components: {default: MyClassList, header: AppHeader, footer: AppFooter},
    beforeEnter: getIsAuth,
  },
  {
    path: '/class',
    name: 'myClass',
    components: {default: () => import('../views/class/home/MyClass'), header: AppHeader, footer: AppFooter},
    beforeEnter: getIsAuth,
  },
  {
    path: '/class/notify',
    name: 'notify',
    components: {default: () => import('../views/class/notify/Notify'), header: AppHeader, footer: AppFooter},
    beforeEnter: getIsAuth,
  },
  {
    path: '/class/schedule',
    name: 'schedule',
    components: {default: () => import('../views/class/schedule/Schedule'), header: AppHeader, footer: AppFooter},
    beforeEnter: getIsAuth,
  },
  ...LoginRouter,
  ...SignUpRouter,
  {
    path: '*',
    name: 'notfound',
    component: () => import('../views/NotFound.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

/*$router.push 로 같은 링크 재차 클릭 에러 방지.*/
const originalPath = VueRouter.prototype.push;
VueRouter.prototype.push = function(url: RawLocation) {
  // @ts-ignore
  return originalPath.call(this, url).catch((error: any) => {
    if (error.name !== 'NavigationDuplicated') {
      location.reload();
    }
  });
};
export default router;
