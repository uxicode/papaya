import {Vue, Component, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import Btn from '@/components/button/Btn.vue';
import WithRender from './SignUpComplete.html';
import {SingUpMutationType} from '@/store/mutation-auth-types';

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

  @Auth.Mutation
  private [SingUpMutationType.SIGN_UP_MOVE]!: () => void;

  @Auth.Getter
  private userName!: string;


  public created(): void{
    console.log('this.userName=', this.userName);
  }

  private gotoLogin(): void{
    this.$router.push('/login').then(()=>{
      console.log('로그인이동');
      this[SingUpMutationType.SIGN_UP_MOVE]();
    });
  }
}
