import { Vue, Component } from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import AuthService from '@/api/service/AuthService';
import WithRender from './Login.html';
import './Login.scss';

const Auth = namespace('Auth');

interface IFormData{
  radioValue:string;
  email:string;
  mobile:string;
}
interface IMessage{
  mobile:string;
  email:string;
  mobileReq:string;
  equal:string;
  notMobile:string;
  notEmail:string;
  warnNum:string;
  verify:string;
  error:string;
}

@WithRender
@Component
export default class Login extends Vue {

  private userId: string = '';
  private userPw: string = '';
  private STATUS_LOGIN: string = 'status_login';
  private STATUS_FIND_ID: string = 'status_find_id';
  private STATUS_PWD_RESET: string = 'status_pwd_reset';
  private currentStatus: string = this.STATUS_LOGIN;

  private isMobileChk:boolean=false;
  private mVerificationKey: string = '';
  private mVerificationVal: string = '';
  private mVerificationComplete:boolean=false;
  private verifyComplete:boolean=false; //인증 완료 체크
  private findUserID: string = '';

  //아이디 찾기 관련
  private formData:IFormData = {
    radioValue:'mobile',
    email:'',
    mobile:'',
  };

  private messages:IMessage={
    mobile:'모바일 번호 "-" 없이 입력해 주세요.',
    email:'이메일 주소를 입력해 주세요',
    mobileReq:'모바일 번호를 입력해 주세요',
    equal:'값이 일치하지 않습니다.',
    notMobile:'유효하지 않은 번호입니다.',
    notEmail:'유효하지 않은 이메일입니다.',
    warnNum:'인증번호가 일치하지 않습니다.',
    verify:'인증번호를 입력해 주세요.',
    error:'',
  };

  @Auth.Getter
  private isAuth!:boolean;

  @Auth.Action
  private login!: (data: any) => Promise<any>;

  get rPath():string{
    return (this.$route.query.rqPath) ? this.$route.query.rqPath as string : '/';
  }

  get userMobileState():boolean{
    const userMobile=/^\d{3}\d{3,4}\d{4}$/;
    return userMobile.test(this.formData.mobile );
  }

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
  private validate() {
    this.login({
      uid:this.userId,
      password:this.userPw,
    }).then( ( data:any ) => {
      // console.log('this.rPath=', this.rPath);
      this.$router.push(this.rPath);
    }).catch( ( error ) => {
      console.log(error);
    });
  }

  private setAccountStatus( status:string ):void{
    this.currentStatus=status;
  }

  private radioBtnChanges():void{
    if(this.formData.radioValue==='mobile'){
      this.formData.email = '';
    }else{
      this.formData.mobile = '';
    }
  }
  // 모바일 번호 인증
  private getAuthMobileNum():void{
    AuthService.getAuthMobileNum( `${this.formData.mobile}` )
      .then( (data:any) => {
        console.log( data );
        this.isMobileChk=true;
        this.mVerificationKey=data.verification_key;
      })
      .catch( (error:any) => {
        // this.isErrorModal=true;
        // this.errorTitle='sms 전송 에러.';
        this.messages.error=error.data.message;
      });
  }
//모바일 인증 번호 전송
  private mVerificationConfirm():void{
    // this.messages.warnNum='';
    if( this.mVerificationVal === '' ){ return; }
    AuthService.getVerification({ key:this.mVerificationKey, num:this.mVerificationVal})
      .then( (data:any) => {
        console.log( data );
        this.mVerificationComplete=true;
        // this.$refs.mVerificationVal.validate();
      })
      .catch( (error:any) => {
        this.mVerificationComplete=false;
        this.messages.warnNum=error.data.message;
        // this.$refs.mVerificationVal.validate(true);
      });
  }

  private verificationConfirm():void{
    if( !this.mVerificationComplete ){ return; }
    AuthService.getUserId(`${this.formData.mobile}` )
      .then( (data:any) => {
        console.log( data );//{mobile_no: "01031992443", user_id: "jbc2119", message: "아이디 조회 성공."}
        this.verifyComplete=true;
        this.findUserID=data.user_id;
        // this.isEmailNumConfirm=true;
        // this.$refs.mVerificationVal.validate();
      })
      .catch( (error:any) => {
        console.log( 'error=', error );
        this.verifyComplete=false;
        // this.isEmailNumConfirm=false;
        // this.messages.warnNum=error.data.message;
        // this.$refs.mVerificationVal.validate(true);
      });
  }

  private gotoLogin():void{
    this.verifyComplete=false;
    this.mVerificationComplete=false;
    this.setAccountStatus(this.STATUS_LOGIN);
  }


}

