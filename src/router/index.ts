import Vue from 'vue';
import VueRouter, {RawLocation, RouteConfig} from 'vue-router';
import AppHeader from '@/components/header/header.vue';
import AppFooter from '@/components/footer/footer.vue';
import {getIsAuth} from '@/router/AuthGuard';
import {LoginRouter} from '@/router/LoginRouter';
import {SignUpRouter} from '@/router/SignUpRouter';
import {MyPageRouter} from '@/router/MyPageRouter';
import {MyClassRouter} from '@/router/MyClassRouter';

Vue.use(VueRouter);

// @ts-ignore
const routes: RouteConfig[] = [
  ...MyClassRouter,
  ...LoginRouter,
  ...SignUpRouter,
  ...MyPageRouter,
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
