import {Vue, Component, Prop} from "vue-property-decorator";
import Withrender from './SignUpIntro.html'

@Withrender
@Component
export default class signUpIntro extends Vue {
    private gotoSignUpNormal():void{
        this.$router.push('/signup/termsCheck').then( (r) => {
            console.log('termsCheck 로 이동 ');
        });
    }
}