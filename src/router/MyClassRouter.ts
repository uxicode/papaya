import AppHeader from '@/components/header/header.vue';
import AppFooter from '@/components/footer/footer.vue';
import {getIsAuth} from '@/router/AuthGuard';

const MyClassRouter=[
  {
    path: '/',
    name: 'myClassList',
    components: { default: () => import('../views/class/classList/myClassListPage'), header: AppHeader, footer: AppFooter },
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
    path: '/make-class',
    name: 'makeClass',
    components: {default: () => import('../views/class/makeClass/MakeClassPage'), header: AppHeader, footer: AppFooter},
    children: [
      {path: 'step1', name: 'makeClassOption', component: () => import('../views/class/makeClass/step1/MakeClassOption')},
      // {path: 'step2', name: 'makeClassOption', component: () => import('../views/class/makeClass/step1/MakeClassOption')},
      // {path: 'step3', name: 'makeClassOption', component: () => import('../views/class/makeClass/step1/MakeClassOption')},
    ]
  },
];

export {MyClassRouter};
