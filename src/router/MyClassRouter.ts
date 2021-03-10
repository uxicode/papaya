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
];

export {MyClassRouter};
