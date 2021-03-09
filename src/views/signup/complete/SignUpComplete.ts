import {Vue, Component, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import Btn from '@/components/button/Btn.vue';
import WithRender from './SignUpComplete.html';

const Auth = namespace('Auth');

@WithRender
@Component(
  {
    components:{
      Btn,
    }
  }
)
export default class SignUpComplete extends Vue {
  @Auth.Getter
  private userName!: string;

  @Auth.Mutation
  private SIGN_UP_MOVE!: () => void;

  public created(): void{
    console.log('this.userName=', this.userName);
  }

  private gotoLogin(): void{
    this.$router.push('/login').then(()=>{
      console.log('로그인이동');
      this.SIGN_UP_MOVE();
    });
  }
}
