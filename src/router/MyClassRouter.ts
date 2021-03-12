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
    path: '/class/make',
    name: 'makeClass',
    components: {default: () => import('../views/class/makeClass/makeClass.4.3.1'), header: AppHeader, footer: AppFooter},
  },

  {
    path: '/allSchedule',
    name: 'allSchedule',
    components: {default: () => import('../views/allSchedule/allSchedule.6.3.1'), header: AppHeader, footer: AppFooter},
  },

  {
    path: '/class/search',
    name: 'search',
    components: {default: () => import('../views/class/search/search.4.2.1'), header: AppHeader, footer: AppFooter},
  },

  {
    path: '/class/search2',
    name: 'search',
    components: {default: () => import('../views/class/search/search.4.2.3.1'), header: AppHeader, footer: AppFooter},
  },

  {
    path: '/class/notify',
    name: 'notify',
    components: {default: () => import('../views/class/notify/notify.4.5.2'), header: AppHeader, footer: AppFooter},
  },

  {
    path: '/class/notify2',
    name: 'notify',
    components: {default: () => import('../views/class/notify/notify.4.5.2.4'), header: AppHeader, footer: AppFooter},
  },

  {
    path: '/class/setting',
    name: 'setting',
    components: {default: () => import('../views/class/setting/classSetting.4.5.7.8'), header: AppHeader, footer: AppFooter},
  },

  {
    path: '/class/setting1',
    name: 'setting',
    components: {default: () => import('../views/class/setting/classSetting.4.5.7.3'), header: AppHeader, footer: AppFooter},
  },

  {
    path: '/class/setting2',
    name: 'setting',
    components: {default: () => import('../views/class/setting/classSetting.4.5.7.10'), header: AppHeader, footer: AppFooter},
  },
  {
    path: '/class/member',
    name: 'setting',
    components: {default: () => import('../views/class/member/classMember.4.5.6'), header: AppHeader, footer: AppFooter},
  },

  {
    path: '/class/education',
    name: 'setting',
    components: {default: () => import('../views/class/education/classEducation.4.5.5'), header: AppHeader, footer: AppFooter},
  },

  {
    path: '/class/schedule',
    name: 'setting',
    components: {default: () => import('../views/class/schedule/classSchedule.4.5.3.3.4.2'), header: AppHeader, footer: AppFooter},
  },
];

export {MyClassRouter};
