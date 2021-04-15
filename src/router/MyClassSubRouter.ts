const MyClassSubRouter=[
  {path: 'setting', name: 'classSettingMain', component: () => import('../views/class/setting/classSettingMain/ClassSettingMain')},
  {path: 'setting/classProfile', name: 'classProfile', component: () => import('../views/class/setting/classProfile/ClassProfile')},  // W.4.5.7.2 ~
  {path: 'setting/classBasicInfo', name: 'classBasicInfo', component: () => import('../views/class/setting/classBasicInfo/ClassBasicInfo')},  // W.4.5.7.3 ~
  {path: 'setting/classTagManage', name: 'classTagManage', component: () => import('../views/class/setting/classTagManage/ClassTagManage')}, // W.4.5.7.4 ~
  {path: 'setting/classJoinStatus', name: 'classJoinStatus', component: () => import('../views/class/setting/classJoinStatus/ClassJoinStatus')}, // W.4.5.7.7 ~
  {path: 'setting/classMemberManage', name: 'classMemberManage', component: () => import('../views/class/setting/classMemberManage/ClassMemberManage'),},// W.4.5.7.8 ~
  {path: 'setting/blockedMemberList', name: 'blockedMemberList', component: () => import('../views/class/setting/classMemberManage/blockedMemberList/BlockedMemberList')}, // W.4.5.7.8.3.1 ~
  {path: 'setting/classStaffManage', name: 'classStaffManage', component: () => import('../views/class/setting/classStaffManage/ClassStaffManage')}, // W.4.5.7.9 ~
  {path: 'setting/classStaffAdd', name: 'classStaffAdd', component: () => import('../views/class/setting/classStaffManage/classStaffAdd/ClassStaffAdd')}, // W.4.5.7.9.1 ~
  {path: 'setting/classAdminDelegate', name: 'classAdminDelegate', component: () => import('../views/class/setting/classAdminDelegate/ClassAdminDelegate')}, // W4.5.7.10 ~
];
export {MyClassSubRouter};
