import {Vue, Component, Prop} from "vue-property-decorator";
import TermsCheck from "@/views/signup/termsCheck/TermsCheck";
import Verify from "@/views/signup/verify/Verify";
import SignUpForm from "@/views/signup/signUpForm/SignUpForm";
import WithRender from './SignUp.html';

@WithRender
@Component({
    components:{
        TermsCheck,
        Verify,
        SignUpForm,
    },
})
export default class SignUp extends Vue {

}