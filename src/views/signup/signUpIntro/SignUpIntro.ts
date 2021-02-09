import {Vue, Component, Prop} from 'vue-property-decorator';
import WithRender from './SignUpIntro.html';

@WithRender
@Component
export default class SignUpIntro extends Vue {
  private gotoSignUpNormal(): void {
    this.$router.push('/signup/termsCheck').then((r) => {
      console.log('termsCheck 로 이동 ');
    });
  }
}
