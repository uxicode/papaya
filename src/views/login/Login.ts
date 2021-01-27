import { Vue, Component } from 'vue-property-decorator';
import {namespace} from 'vuex-class';

import LoginForm from '@/views/login/loginForm/LoginForm';
import FindId from '@/views/login/findId/FindId';
import WithRender from './Login.html';
import './Login.scss';

const Auth = namespace('Auth');

/*interface IFormData{
  radioValue:string;
  email:string;
  mobile:string;
}*/
/*interface IMessage{
  mobile:string;
  email:string;
  mobileReq:string;
  equal:string;
  notMobile:string;
  notEmail:string;
  warnNum:string;
  verify:string;
  error:string;
}*/

@WithRender
@Component({
  components:{
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

  private isMobileChk:boolean=false;
  // private mVerificationKey: string = '';
  // private mVerificationVal: string = '';

  private verifyComplete:boolean=false; //인증 완료 체크
  // private findUserID: string = '';

  //아이디 찾기 관련
  /*private formData:IFormData = {
    radioValue:'mobile',
    email:'',
    mobile:'',
  };*/

/*  private messages:IMessage={
    mobile:'모바일 번호 "-" 없이 입력해 주세요.',
    email:'이메일 주소를 입력해 주세요',
    mobileReq:'모바일 번호를 입력해 주세요',
    equal:'값이 일치하지 않습니다.',
    notMobile:'유효하지 않은 번호입니다.',
    notEmail:'유효하지 않은 이메일입니다.',
    warnNum:'인증번호가 일치하지 않습니다.',
    verify:'인증번호를 입력해 주세요.',
    error:'',
  };*/

  @Auth.Getter
  private isAuth!:boolean;

  @Auth.Getter
  private findUserId!:string;

  @Auth.Action
  private login!: (data: any) => Promise<any>;

  get loginStatus():boolean{
    console.log(this.currentStatus===this.STATUS_LOGIN);
    return this.currentStatus===this.STATUS_LOGIN;
  }

  get findStatus():boolean{
    return ( this.currentStatus === this.STATUS_FIND_ID ) || (this.currentStatus === this.STATUS_PWD_RESET );
  }

  // @ts-ignore
  public getMinTxtValue( v: string ): boolean | string{
    return ( v.length >= 8 ) || '최소 8글자 이상 입력해 주세요.';
  }
  public getRequired( val: string ): boolean | string {
    return !!val || '비밀번호를 입력해 주세요.';
  }
  private created() {
    console.log(this.isAuth);
  }
  private setAccountStatus( status:string ):void{
    this.currentStatus=status;
  }
  private gotoLogin():void{
    this.verifyComplete=false;
    // this.mVerificationComplete=false;
    this.setAccountStatus(this.STATUS_LOGIN);
  }

  private findIdComplete() {
    this.verifyComplete=true;
  }
}

