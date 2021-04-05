import AppHeader from '@/components/header/header.vue';
import AppFooter from '@/components/footer/footer.vue';
import {getIsAuth} from '@/router/AuthGuard';

const MyClassRouter=[
  {
    path: '/',
    name: 'myClassList',
    beforeEnter: getIsAuth,
    components: { default: () => import('@/views/class/classList/MyClassListPage'), header: AppHeader, footer: AppFooter },
  },
  {
    path: '/class/:classId',
    name: 'myClass',
    beforeEnter: getIsAuth,
    components: {default: () => import('@/views/class/home/MyClass'), header: AppHeader, footer: AppFooter},
    props: { default: true, header: false, footer: false }
  },
  {
    path: '/make-class',
    name: 'makeClass',
    components: {default: () => import('../views/class/make/MakeClassPage'), header: AppHeader, footer: AppFooter},
    beforeEnter: getIsAuth,
    children: [
      {path: 'step1', name: 'makeClassOption', component: () => import('../views/class/make/step1/MakeClassOption')},
      {path: 'step2', name: 'makeClassForm', component: () => import('../views/class/make/step2/MakeClassForm')},
      {path: 'step3', name: 'makeClassComplete', component: () => import('../views/class/make/step3/MakeClassComplete')},
    ]
  },
  {
    path: '/classSetting',
    name: 'classSetting',
    components: {default: () => import('../views/class/setting/ClassSetting'), header: AppHeader, footer: AppFooter},
    beforeEnter: getIsAuth,
    children: [
      {path: '/', name: 'classSettingMain', component: () => import('../views/class/setting/classSettingMain/ClassSettingMain')},
      {path: 'classProfile', name: 'classProfile', component: () => import('../views/class/setting/classProfile/ClassProfile')},  // W.4.5.7.2 ~
      {path: 'classBasicInfo', name: 'classBasicInfo', component: () => import('../views/class/setting/classBasicInfo/ClassBasicInfo')},  // W.4.5.7.3 ~
      {path: 'classTagManage', name: 'classTagManage', component: () => import('../views/class/setting/classTagManage/ClassTagManage')}, // W.4.5.7.4 ~
      {path: 'classJoinStatus', name: 'classJoinStatus', component: () => import('../views/class/setting/classJoinStatus/ClassJoinStatus')}, // W.4.5.7.7 ~
      {path: 'classMemberManage', name: 'classMemberManage', component: () => import('../views/class/setting/classMemberManage/ClassMemberManage'),},// W.4.5.7.8 ~
      {path: 'blockedMemberList', name: 'blockedMemberList', component: () => import('../views/class/setting/classMemberManage/blockedMemberList/BlockedMemberList')}, // W.4.5.7.8.3.1 ~
      {path: 'classStaffManage', name: 'classStaffManage', component: () => import('../views/class/setting/classStaffManage/ClassStaffManage')}, // W.4.5.7.9 ~
      {path: 'classAdminDelegate', name: 'classAdminDelegate', component: () => import('../views/class/setting/classAdminDelegate/ClassAdminDelegate')}, // W4.5.7.10 ~
    ]
  },
  {
    path: '/classWithdrawComplete',
    name: 'classWithdrawComplete',
    beforeEnter: getIsAuth,
    components: {default: () => import('../views/class/setting/ClassWithdrawComplete'), header: AppHeader, footer: AppFooter}, // W.4.5.7.11.1.1
  },

  {
    path: '/classEducation',
    name: 'classEducation',
    components: {default: () => import('../views/class/education/ClassEducationPage'), header: AppHeader, footer: AppFooter},
    beforeEnter: getIsAuth,
  },
];

export {MyClassRouter};
