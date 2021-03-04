import {Vue, Component, Watch} from 'vue-property-decorator';
import {IVerifiedForm} from '@/views/model/member-form.model';
import RadioButton from '@/components/radio/RadioButton.vue';
import Btn from '@/components/button/Btn.vue';
import TxtField from '@/components/form/txtField.vue';
import Modal from '@/components/modal/modal.vue';
import WithRender from './ResetPassword.html';

import {namespace} from 'vuex-class';
import AuthService from '@/api/service/AuthService';
import {Utils} from '@/utils/utils';

const Auth = namespace('Auth');
const History = namespace('History');

interface IPwd {
  nPwd: string;
  rePwd: string;
}

@WithRender
@Component({
  components: {
    RadioButton,
    Btn,
    TxtField,
    Modal,
  },
})
export default class ResetPassword extends Vue {


  private isEmailChk: boolean = false;
  private mobileChk: boolean = false;
  private isConfirmComplete: boolean = false;
  private isVerifiedCode: boolean = false;
  private errorMessage: string = '';
  private errorOpenPopup: boolean=false;
  private isVerifiedStatus: boolean=false;
  private isModifiedPwd: boolean=false;

  //비밀번호 재설정 관련
  private formData: IVerifiedForm = {
    radioValue: 'mobile',
    email: '',
    mobile: '',
    userId: '',
    verifiedCode: '',
  };
  private pwdFormData: IPwd = {
    nPwd: '',
    rePwd: '',
  };


  @Auth.Getter
  private resetPwVerifyInfo!: any;

  @Auth.Action
  private AUTH_BY_MOBILE!: (payload: any) => Promise<any>;

  @History.Mutation
  private HISTORY_PAGE!: (pageName: string) => void;

  get errorMsg(): string {
    return this.errorMessage;
  }

  /**
   * 유효한 모바일 번호인지 체크
   */
  get userMobileState(): boolean {
    const userMobile = Utils.getMobileRegx();
    return userMobile.test(this.formData.mobile);
  }

  /**
   * 유요한 이메일인지 체크
   */
  get userEmailState(): boolean {
    const userEmail = Utils.getEmailRegx();
    return userEmail.test(this.formData.email);
  }

  /*get getUseMobileState(): boolean {
    return this.formData.userId === '';
  }*/


  get pwState() {
    //정규표현식을 아래와 같이 변수를 연동하는 등의 동적 표현시엔 RegExp 생성자를 사용한다.
    const userPWRegx = Utils.getPwdRegx(8, 16);
    return userPWRegx.test(this.pwdFormData.nPwd);
  }

  get isMobileAuthChk(): boolean {
    //유효한 번호가 아닐때
    if( !this.userMobileState ){
      if( this.mobileChk ){
        //모바일 번호를 이미 인증 받은 상태라고 해도 유효한 번호가 아니면( 번호를 다 지웠거나 몇몇 삭제한 경우) 인증된 상태를 리셋
        this.mobileChk=false;
      }
    }
    return this.userMobileState && this.mobileChk;
  }

  get isVerifiedCodeChk(): boolean {
    //유효한 번호가 아닐때
/*    if( this.mobileChk ){
      this.mobileChk=false;
    }*/
    return this.isVerifiedCode && this.mobileChk;
  }

  @Watch('formData.verifiedCode')
  public onChangeVerifiedCode(value: string, oldValue: string) {
    if (value !== oldValue) {
      this.isVerifiedCode = false;
    }
  }

  public created() {
    this.HISTORY_PAGE('login');
  }

  public minValue(value: string): boolean {
    return (value !== null && value.length >= 8);
  }

  public required(value: string): boolean {
    // console.log( value, !!value);
    return !!value;
  }

  private closeErrorPopup(): void {
    this.errorOpenPopup=false;
  }

  private setErrorMessage(msg: string = ''): void {
    this.errorMessage = msg;
  }

  /*private gotoFindIdHandler(): void {
    this.$router.push('/login/findId').then((r: Route) => {
      console.log('아이디 찾기로 이동');
    });
  }*/

  private activeInputField(value: string): boolean {
    return this.formData.radioValue === value;
  }

  /**
   * 라디오버튼 클릭하여 다른 옵션으로 이동시 에러 표시가 기록되었다면 input 초기화
   * @private
   */
  private optionFindChange(value: string, checked: boolean): void {
    this.formData.radioValue = value;
    // console.log(this.formData.radioValue);
    if (this.errorMsg !== '') {
      this.setErrorMessage();
      if (this.formData.radioValue === 'mobile') {
        this.formData.mobile = '';
      } else {
        this.formData.email = '';
      }
    }
  }

  /**
   * 모바일번호로 아이디 찾기 인증 완료 / 이메일로 아이디찾기 인증완료
   * - 둘 중 어느 것 하나라도 인증이 되었다면 true , 즉 하단의 확인 버튼을 활성화 하게 된다.
   * @private
   */
  private verificationConfirm(): boolean {
    return (this.formData.radioValue === 'mobile' && this.isVerifiedCode) ||
      (this.formData.radioValue === 'email' && this.isEmailChk);
  }

  private getUserAuthByMobile(): void {
    // console.log( !this.userMobileState , this.formData.userId===''  )
    if (!this.userMobileState || this.formData.userId === '') {
      return;
    }

    //재전송 상태라면
    if( this.isVerifiedCode ){
      const verifiedCode=document.getElementById('verifiedCode') as HTMLInputElement;
      verifiedCode.value = '';

      const verifiedValue=this.$refs.verifiedValue as HTMLElement;
      console.log( verifiedValue );
      this.formData.verifiedCode = '';
      this.isVerifiedCode=false;
    }
    //this.isMobileChk
    // UserService.getAuthByMobileNum(this.formData.userId, this.formData.mobile)
    this.AUTH_BY_MOBILE({
      userId: this.formData.userId,
      mobile: this.formData.mobile,
    }).then((data: any) => {
      console.log('핸폰번호와 아이디로 인증=', data);
      //{verification_key: "3091612168945547", message: "sms 로 인증번호 발송 성공"}
      // this.mVerificationComplete=true;
      // this.findUserID=data.user_id;
      this.mobileChk = true;
    }).catch((error: any) => {
      console.log('error', error);
      this.errorOpenPopup=true;
      this.setErrorMessage(error.data.message);
    });
  }

  private verifyCompleteByMobile(): void {
    //
    console.log('인증전송');
    if (this.mobileChk) {
      AuthService.getVerification({
        key: this.resetPwVerifyInfo.key,
        num: this.formData.verifiedCode,
      }).then((data: any) => {
        console.log(data);
        // alert('인증이 완료 되었습니다.');
        this.isVerifiedCode = true;
        this.formData.verifiedCode = '';
        this.setErrorMessage('');
        this.isVerifiedStatus=true;
      }).catch((error) => {
        this.errorOpenPopup=true;
        this.setErrorMessage(error.data.message);
        console.log(this.errorMsg);
      });
    }

  }

  private getPwdEqual(): boolean {
    return this.required(this.pwdFormData.nPwd) && this.required(this.pwdFormData.rePwd) &&
      this.pwdFormData.nPwd===this.pwdFormData.rePwd;
  }

  private pwdChangeSubmit(): void {
    if( this.getPwdEqual() ){
      AuthService.pwdChange({
        userId: this.resetPwVerifyInfo.userId,
        mobile: this.resetPwVerifyInfo.mobile,
        key: this.resetPwVerifyInfo.key,
        pwd: this.pwdFormData.nPwd
      }).then( () => {
        // alert('비밀번호가 변경 되었습니다.');
        this.isModifiedPwd=true;
      });
    }

  }

  private getUserAuthByEmail(): void {
    //this.isEmailChk
  }

  private changePwdComplete(): void{
    this.isModifiedPwd = false;
    this.$router.push('/login').then(()=>{
      console.log('로그인으로 이동 ');
    });
  }


  /**
   * 로그인으로 돌아갈 수 있게끔 이벤트 전송
   * @private
   */
  private gotoLoginHandler(): void {
    this.isConfirmComplete = false; //찾기 완료시점을 초기화
    this.resetFormData(); //라디오데이터 초기화
    this.setErrorMessage(); //에러메세지 초기화
    this.$router.push('/login').then(()=>{
      console.log('로그인으로 이동');
    });
  }


  /**
   * 확인버튼 클릭시
   * @private
   */
  private confirmClickHandler(): void {
    this.isConfirmComplete = true;
  }

  /**
   *  모바일 및 이메일 등으로 아이디 찾기 위해 지정된 데이터 초기화
   * @private
   */
  private resetFormData(): void {
    this.isEmailChk = false;
    this.mobileChk = false;
    this.setErrorMessage('');
    this.formData = {
      radioValue: 'mobile',
      email: '',
      mobile: '',
      userId: '',
      verifiedCode: '',
    };
  }
}
