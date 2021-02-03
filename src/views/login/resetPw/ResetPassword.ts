import {Vue, Component} from 'vue-property-decorator';
import {Route} from 'vue-router';
import {IFormAuthData} from '@/views/login/model/formdata.model';
import RadioButton from '@/components/radio/RadioButton.vue';
import WithRender from './ResetPassword.html';
import UserService from '@/api/service/UserService';
import {AUTH_BY_MOBILE} from '@/store/action-auth-types';

import {namespace} from 'vuex-class';
import AuthService from '@/api/service/AuthService';
const Auth = namespace('Auth');

@WithRender
@Component({
  components:{
    RadioButton,
  },
})
export default class ResetPassword extends Vue{


  private isEmailChk:boolean=false;
  private isMobileChk:boolean=false;
  private isConfirmComplete:boolean=false;
  private isVerifiedCode:boolean=false;
  private errorMessage: string = '';


  @Auth.Getter
  private resetPwVerifyInfo!:any;

  @Auth.Action
  private AUTH_BY_MOBILE!: (payload: any) => Promise<any>;

  //비밀번호 재설정 관련
  private formData:IFormAuthData = {
    radioValue:'mobile',
    email:'',
    mobile:'',
    userId:'',
    verifiedCode:'',
  };


  get errorMsg():string{
    return this.errorMessage;
  }

  /**
   * 유효한 모바일 번호인지 체크
   */
  get userMobileState():boolean{
    const userMobile=/^\d{3}\d{3,4}\d{4}$/;
    return userMobile.test(this.formData.mobile );
  }

  /**
   * 유요한 이메일인지 체크
   */
  get userEmailState():boolean{
    const userEmail=/^[a-z0-9!#$%&'*+\\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/ig;
    return userEmail.test(this.formData.email);
  }

  private setErrorMessage( msg:string='' ):void{
    this.errorMessage=msg;
  }



  private gotoFindIdHandler():void{
    this.$router.push('/login/findId').then( (r:Route)=>{
      console.log('아이디 찾기로 이동');
    } );
  }

  private activeInputField( value:string ):boolean{
    return this.formData.radioValue===value;
  }

  /**
   * 라디오버튼 클릭하여 다른 옵션으로 이동시 에러 표시가 기록되었다면 input 초기화
   * @private
   */
  private optionFindChange( value:string ):void{
    this.formData.radioValue=value;
    console.log(this.formData.radioValue);
    if ( this.errorMsg !== '') {
      this.setErrorMessage();
      if( this.formData.radioValue === 'mobile'){
        this.formData.mobile = '';
      }else{
        this.formData.email = '';
      }
    }
  }

  /**
   * 모바일번호로 아이디 찾기 인증 완료 / 이메일로 아이디찾기 인증완료
   * - 둘 중 어느 것 하나라도 인증이 되었다면 true , 즉 하단의 확인 버튼을 활성화 하게 된다.
   * @private
   */
  private verificationConfirm():boolean{
    return ( this.formData.radioValue==='mobile' && this.isMobileChk) ||
      (this.formData.radioValue ==='email' && this.isEmailChk );
  }

  private getUserAuthByMobile():void{
    //this.isMobileChk
    // UserService.getAuthByMobileNum(this.formData.userId, this.formData.mobile)
    this.AUTH_BY_MOBILE( {
      userId:this.formData.userId,
      mobile: this.formData.mobile,
    }).then( (data:any) => {
        console.log('핸폰번호와 아이디로 인증=', data );
        //{verification_key: "3091612168945547", message: "sms 로 인증번호 발송 성공"}
        // this.mVerificationComplete=true;
        // this.findUserID=data.user_id;
        this.isMobileChk=true;
      }).catch((error:any)=>{
      console.log('error', error );
      this.setErrorMessage( error.data.message );
    });
  }

  private verifyCompleteByMobile():void{
     //
    if( this.isMobileChk ){
      AuthService.getVerification({
        key: this.resetPwVerifyInfo.key,
        num:this.formData.verifiedCode,
      }).then((data:any)=>{
        console.log(data);
        alert('인증이 완료 되었습니다.');
        this.isVerifiedCode=true;
      }).catch((error)=>{

      });
    }

  }

  private getUserAuthByEmail():void{
    //this.isEmailChk
  }

  /**
   * 로그인으로 돌아갈 수 있게끔 이벤트 전송
   * @private
   */
  private gotoLoginHandler():void{
    this.isConfirmComplete=false; //찾기 완료시점을 초기화
    this.resetFormData(); //라디오데이터 초기화
    this.setErrorMessage(); //에러메세지 초기화
    this.$router.push('/login');
  }


  /**
   * 확인버튼 클릭시
   * @private
   */
  private confirmClickHandler():void{
    this.isConfirmComplete=true;
  }

  /**
   *  모바일 및 이메일 등으로 아이디 찾기 위해 지정된 데이터 초기화
   * @private
   */
  private resetFormData():void{
    this.isEmailChk=false;
    this.isMobileChk=false;
    this.formData = {
      radioValue:'mobile',
      email:'',
      mobile:'',
      userId:'',
      verifiedCode:'',
    };
  }
}
