import MyClassList from '@/views/class/myClassList';
import AppHeader from '@/components/header/header.vue';
import AppFooter from '@/components/footer/footer.vue';
import {getIsAuth} from '@/router/AuthGuard';

const MyClassRouter=[
  {
    path: '/',
    name: 'myClassList',
    components: {default: MyClassList, header: AppHeader, footer: AppFooter},
    beforeEnter: getIsAuth,
  },
  {
    path: '/class',
    name: 'myClass',
    components: {default: () => import('../views/class/home/MyClass'), header: AppHeader, footer: AppFooter},
    beforeEnter: getIsAuth,
  },
 /* {
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
  },*/
  //ex) - makeClass.4.3.1
  {
    path: '/make',
    name: 'makeClass',
    components: {default: () => import('../views/class/makeClass/makeClass.4.3.1'), header: AppHeader, footer: AppFooter},
  },

  {
    path: '/search.4.2.1',
    name: 'search.4.2.1',
    components: {default: () => import('../views/class/search/search.4.2.1'), header: AppHeader, footer: AppFooter},
  },

  {
    path: '/search.4.2.3.1',
    name: 'search.4.2.3.1',
    components: {default: () => import('../views/class/search/search.4.2.3.1'), header: AppHeader, footer: AppFooter},
  },

  {
    path: '/allSchedule',
    name: 'allSchedule.6.3.1',
    components: {default: () => import('../views/allSchedule/allSchedule.6.3.1'), header: AppHeader, footer: AppFooter},
  },/* 보류 */

  {
    path: '/notify.4.5.2',
    name: 'notify.4.5.2',
    components: {default: () => import('../views/class/notify/notify.4.5.2'), header: AppHeader, footer: AppFooter},
  },

  {
    path: '/notify.4.5.2.4',
    name: 'notify.4.5.2.4',
    components: {default: () => import('../views/class/notify/notify.4.5.2.4'), header: AppHeader, footer: AppFooter},
  },



];

export {MyClassRouter};
