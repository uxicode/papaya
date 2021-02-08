import {Vue, Component, Prop} from "vue-property-decorator";
import TermsCheck from "@/views/signup/termsCheck/TermsCheck";
import Verify from "@/views/signup/verify/Verify";
import Info from "@/views/signup/info/Info";
import WithRender from './SignUp.html';

@WithRender
@Component({
    components:{
        TermsCheck,
        Verify,
        Info,
    },
})
export default class SignUp extends Vue {
}
