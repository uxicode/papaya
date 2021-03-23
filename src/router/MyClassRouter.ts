import AppHeader from '@/components/header/header.vue';
import AppFooter from '@/components/footer/footer.vue';
import {getIsAuth} from '@/router/AuthGuard';

// @ts-ignore
// @ts-ignore
const MyClassRouter=[
  {
    path: '/',
    name: 'myClassList',
    components: { default: () => import('../views/class/classList/MyClassListPage'), header: AppHeader, footer: AppFooter },
    beforeEnter: getIsAuth,
  },
  {
    path: '/class',
    name: 'myClass',
    components: {default: () => import('../views/class/home/MyClass'), header: AppHeader, footer: AppFooter},
    beforeEnter: getIsAuth,
  },
  {
    path: '/make-class',
    name: 'makeClass',
    components: {default: () => import('../views/class/make/MakeClassPage'), header: AppHeader, footer: AppFooter},
    children: [
      {path: 'step1', name: 'makeClassOption', component: () => import('../views/class/make/step1/MakeClassOption')}
      // {path: 'step2', name: 'makeClassOption', component: () => import('../views/class/makeClass/step1/MakeClassOption')},
      // {path: 'step3', name: 'makeClassOption', component: () => import('../views/class/makeClass/step1/MakeClassOption')},
    ]
  },
  {
    path: '/classSetting',
    name: 'classSetting',
    components: {default: () => import('../views/class/setting/ClassSetting'), header: AppHeader, footer: AppFooter},
    children: [
      {path: '/', name: 'classSettingMain', component: () => import('../views/class/setting/classSettingMain/ClassSettingMain')},
      {path: 'classBasicInfo', name: 'classBasicInfo', component: () => import('../views/class/setting/classBasicInfo/ClassBasicInfo')},
      {path: 'classMemberManage', name: 'classMemberManage', component: () => import('../views/class/setting/classMemberManage/ClassMemberManage')},
      {path: 'classAdminDelegate', name: 'classAdminDelegate', component: () => import('../views/class/setting/classAdminDelegate/ClassAdminDelegate')},
    ]
  }
];

export {MyClassRouter};
