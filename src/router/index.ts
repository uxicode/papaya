import MyClassHeader from '@/components/header/myClassHeader.vue';
import Vue from 'vue';
import VueRouter, {RawLocation, RouteConfig} from 'vue-router';
// import AppHeader from '@/components/header/header.vue';
// import AppFooter from '@/components/footer/footer.vue';
// import {getIsAuth} from '@/router/AuthGuard';
import {LoginRouter} from '@/router/LoginRouter';
import {SignUpRouter} from '@/router/SignUpRouter';
import {MyPageRouter} from '@/router/MyPageRouter';
import {MyClassRouter} from '@/router/MyClassRouter';
import AppHeader from '@/components/header/header.vue';
import AppFooter from '@/components/footer/footer.vue';
import {getIsAuth} from '@/router/AuthGuard';

Vue.use(VueRouter);

// @ts-ignore
const routes: RouteConfig[] = [
  {
    path: '/class/search',
    name: 'SearchPage',
    components: {default: () => import('@/views/class/search/SearchPage'), header: AppHeader, footer: AppFooter}
  },
  {
    path: '/class/:classId/enrollClass',
    name: 'EnrollClass',
    beforeEnter: getIsAuth,
    components: {default: () => import('@/views/class/enroll/EnrollClass'), header: MyClassHeader, footer: AppFooter}, // W.4.4.1.1
  },
  {
    path: '/class/fileBox',
    name: 'fileBox',
    beforeEnter: getIsAuth,
    components: {default: () => import('@/views/class/fileBox/FileListView'), header: AppHeader, footer: AppFooter}, // W.4.5.4
  },
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

const router = new VueRouter({
  base:process.env.VUE_APP_BASE_URL,
  routes,
  mode: 'history',
});
export default router;
