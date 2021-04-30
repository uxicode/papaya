import SignUp from '@/views/signup/SignUp';
import SignUpIntro from '@/views/signup/signUpIntro/SignUpIntro';
import SignUpHeader from '@/components/header/signupHeader.vue';
import AppFooter from '@/components/footer/footer.vue';
import SignUpComplete from '@/views/signup/complete/SignUpComplete';

const SignUpRouter=[
  {
    path: '/signup',
    components:{ default: SignUpIntro, header: SignUpHeader, footer: AppFooter },
  },
  {
    path: '/signForm',
    // name: 'signForm',
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
  {
    path: '/signup/complete',
    components:{ default: SignUpComplete, header: SignUpHeader, footer: AppFooter },
  },
];
export {SignUpRouter};
