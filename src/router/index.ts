import Vue from 'vue';
import VueRouter, {RawLocation, RouteConfig} from 'vue-router';
import Home from '../views/Home.vue';
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
    components: {default: Home, header: AppHeader, footer: AppFooter},
    beforeEnter: getIsAuth,
    children: [
      { path: '', component: () => import('../views/home/myClass/MyClass') },
      { path: 'notify', component: () => import('../views/home/notify/Notify') },
      { path: 'schedule', component: () => import('../views/home/schedule/Schedule') },
    ],
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
