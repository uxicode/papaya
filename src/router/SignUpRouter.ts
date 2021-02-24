import SignUp from '@/views/signup/SignUp';
import SignUpHeader from '@/components/header/signupHeader.vue';
import AppFooter from '@/components/footer/footer.vue';

const SignUpRouter=[
  {
    path: '/signup',
    components:{ default: SignUp, header: SignUpHeader, footer: AppFooter },
    children:[
      { path: '', component: () => import('../views/signup/signUpIntro/SignUpIntro') },
      { path: 'termsCheck', name: 'termsCheck', component: () =>import('../views/signup/termsCheck/TermsCheck') },
      {
        path: 'verify',
        name: 'verify',
        component: () => import('../views/signup/verify/Verify'),
        children: [
          { path: 'verifyComplete', name: 'verifyComplete', component: () =>import('../views/signup/verify/verifyComplete/VerifyComplete')},
        ],
      },
      { path: 'signUpForm', name: 'signUpForm', component: () =>import('../views/signup/signUpForm/SignUpForm') },
    ],
  },
];
export {SignUpRouter}
