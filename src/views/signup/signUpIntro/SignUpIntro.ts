import {Vue, Component, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import WithRender from './SignUpIntro.html';

const Auth = namespace('Auth');

@WithRender
@Component
export default class SignUpIntro extends Vue {

  @Auth.Mutation
  private SET_PAGE_TITLE!: (title: string) => void;

  @Auth.Getter
  private pageTitle!: string;

  private gotoSignForm(ageType: string | null): void {
    if (ageType === 'under14') {
      this.SET_PAGE_TITLE('만 14세 미만 회원가입');
    } else {
      this.SET_PAGE_TITLE('일반 회원가입');
    }

    this.$router.push('/signForm');
  }

}
