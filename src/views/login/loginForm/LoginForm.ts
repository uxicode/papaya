import {Vue, Component, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import TxtField from '@/components/form/txtField.vue';
import WithRender from './LoginForm.html';


const Auth = namespace('Auth');
const History = namespace('History');

@WithRender
@Component({
  components:{
    Modal,
    Btn,
    TxtField,
  }
})
export default class LoginForm extends Vue {
  private userId: string = '';
  private userPw: string = '';
  private isLoginFail: boolean=false;
  private errorMsg: string = '';

  @Auth.Getter
  private userName!: string;

  @Auth.Getter
  private findUserId!: string;

  @History.Mutation
  private HISTORY_PAGE!: (pageName: string) => void;

  @Auth.Action
  private LOGIN_ACTION!: (data: any) => Promise<any>;

  get rPath(): string {
    return (this.$route.query.rqPath) ? this.$route.query.rqPath as string : '/';
  }

  get isFieldRequired(): boolean{
    return this.userId !== '' && this.userPw !== '';
  }

  public created() {
    this.HISTORY_PAGE('login');
    console.log('findUserId=', this.findUserId);
    console.log('userName=', this.userName);
  }


  private validate(): void {

    //빈칸
    if( this.isFieldRequired ){
      this.LOGIN_ACTION({
        uid: this.userId,
        password: this.userPw,
      }).then((data: any) => {
        // console.log('this.rPath=', this.rPath);
        this.$router.push(this.rPath);

        this.isLoginFail=false;
      }).catch((error) => {
        // console.log(error.data.message, error.data.error);
        this.errorMsg=error.data.error.message;
        this.isLoginFail=true;
      });
    }else{
      this.isLoginFail=true;
      this.errorMsg = '빈칸을 체크해 주세요.';
    }

  }

  private findIdHandler(): void {
    // this.$emit('findIdStatusEvent');
    this.$router.push('/login/findId').then((r) => {
      console.log('findId 로 이동 ');
    });
  }

  private resetPwHandler(): void {
    this.$router.push('/login/findId/resetPw').then((r) => {
      console.log('reset pw 로 이동 ');
    });
  }

}
