import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import LoginForm from '@/views/login/loginForm/LoginForm';
import FindId from '@/views/login/findId/FindId';
import WithRender from './Login.html';
import {HISTORY_PAGE} from '@/store/mutation-auth-types';
// import './Login.scss';

const Auth = namespace('Auth');
const History = namespace('History');

@WithRender
@Component({
  components: {
    LoginForm,
    FindId,
  },
})
export default class Login extends Vue {

  /* private userId: string = '';
   private userPw: string = '';*/
  private STATUS_LOGIN: string = 'status_login';
  private STATUS_FIND_ID: string = 'status_find_id';
  private STATUS_PWD_RESET: string = 'status_pwd_reset';
  private currentStatus: string = this.STATUS_LOGIN;

  // private mVerificationKey: string = '';
  // private mVerificationVal: string = '';

  private verifyComplete: boolean = false; //인증 완료 체크
  // private findUserID: string = '';
  private checkType: string = 'mobile';

  @Auth.Getter
  private isAuth!: boolean;

  @Auth.Getter
  private findUserId!: string;

  @History.Mutation
  private HISTORY_PAGE!: (pageName: string) => void;

  @Auth.Action
  private login!: (data: any) => Promise<any>;

  get loginStatus(): boolean {
    console.log(this.currentStatus === this.STATUS_LOGIN);
    return this.currentStatus === this.STATUS_LOGIN;
  }

  get findStatus(): boolean {
    return (this.currentStatus === this.STATUS_FIND_ID) || (this.currentStatus === this.STATUS_PWD_RESET);
  }

  public created() {
    this.HISTORY_PAGE('login');
  }

  // @ts-ignore
  public getMinTxtValue(v: string): boolean | string {
    return (v.length >= 8) || '최소 8글자 이상 입력해 주세요.';
  }

  public getRequired(val: string): boolean | string {
    return !!val || '비밀번호를 입력해 주세요.';
  }

  private setAccountStatus(status: string): void {
    this.currentStatus = status;
  }

  private gotoLogin(): void {
    this.verifyComplete = false;
    // this.mVerificationComplete=false;
    this.setAccountStatus(this.STATUS_LOGIN);
  }

}

