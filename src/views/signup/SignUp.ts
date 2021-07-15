import {Vue, Component, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import TermsCheck from '@/views/signup/termsCheck/TermsCheck';
import Verify from '@/views/signup/verify/Verify';
import SignUpForm from '@/views/signup/signUpForm/SignUpForm';
import WithRender from './SignUp.html';

const Auth = namespace('Auth');

@WithRender
@Component({
    components:{
        TermsCheck,
        Verify,
        SignUpForm,
    },
})
export default class SignUp extends Vue {

    @Auth.Getter
    private pageTitle!: string;

    private currentStep: number=1;
    private stepTotal: number=3;

    private updateCount( count: number ) {
        this.currentStep= count;
    }
}
