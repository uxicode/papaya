import Login from '@/views/login/Login';
import SignInHeader from '@/components/header/signinHeader.vue';
import SignInFooter from '@/components/footer/signInFooter.vue';

const LoginRouter=[
  {
    path: '/login',
    components: {default: Login, header: SignInHeader, footer: SignInFooter},
    children: [
      {path: '', name: 'loginForm', component: () => import('../views/login/loginForm/LoginForm')},
      {
        path: 'findId',
        component: () => import('../views/login/account/IdPwContainer'),
        children: [
          {path: '', name: 'findIdForm', component: () => import('../views/login/findId/FindId')},
          {path: 'resetPw', name: 'resetPw', component: () => import('../views/login/resetPw/ResetPassword')},
        ],
      },
    ],
  }
];
export {LoginRouter};
