import SignUp from '@/views/signup/SignUp';
import SignUpIntro from '@/views/signup/signUpIntro/SignUpIntro';
import SignUpHeader from '@/components/header/signupHeader.vue';
import AppFooter from '@/components/footer/footer.vue';
import Login from '@/views/login/Login';
import SignInHeader from '@/components/header/signinHeader.vue';
import SignInFooter from '@/components/footer/signInFooter.vue';

const SignUpRouter=[
  {
    path: '/signup',
    components:{ default: SignUpIntro, header: SignUpHeader, footer: AppFooter },
  },
  {
    path: '/signForm',
    name: 'signForm',
    components: { default:SignUp, header: SignUpHeader, footer: AppFooter},
    children:[
      { path: '', name: 'termsCheck', component: () =>import('../views/signup/termsCheck/TermsCheck') },
      {
        path: 'verify',
        name: 'verify',
        component: () => import('../views/signup/verify/Verify'),
        children: [
          { path: 'verifyComplete', name: 'verifyComplete', component: () =>import('../views/signup/verify/verifyComplete/VerifyComplete')},
        ],
      },
      { path: 'signUpForm', name: 'signUpForm', component: () =>import('../views/signup/signUpForm/SignUpForm') },
    ]
  },
];
export {SignUpRouter};
