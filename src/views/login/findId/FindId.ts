import {Vue, Component} from 'vue-property-decorator';
import {IAuthTypeForm} from '@/views/login/model/member-form.model';
import {IFindIdWarnMsg} from '@/views/login/model/msg-form.model';
import RadioButton from '@/components/radio/RadioButton.vue';
import Btn from '@/components/button/Btn.vue';
import TxtField from '@/components/form/txtField.vue';
import {namespace} from 'vuex-class';
import WithRender from './FindId.html';

const Auth = namespace('Auth');
const History = namespace('History');

@WithRender
@Component({
  components: {
    RadioButton,
    Btn,
    TxtField,
  },
})

export default class FindId extends Vue {

  private isEmailChk: boolean = false;
  private isMobileChk: boolean = false;
  private isConfirmComplete: boolean = false;
  private errorMessage: string = '';

  //아이디 찾기 관련
  private formData: IAuthTypeForm = {
    radioValue: 'mobile',
    email: '',
    mobile: '',
  };

  private messages: IFindIdWarnMsg = {
    mobile: '모바일 번호 "-" 없이 입력해 주세요.',
    email: '이메일 주소를 입력해 주세요',
    mobileReq: '모바일 번호를 입력해 주세요',
    equal: '값이 일치하지 않습니다.',
    notMobile: '유효하지 않은 번호입니다.',
    notEmail: '유효하지 않은 이메일입니다.',
    warnNum: '인증번호가 일치하지 않습니다.',
    verify: '인증번호를 입력해 주세요.',
    error: '',
  };

  @Auth.Getter
  private findInputUserEmail!: string;

  @Auth.Getter
  private findUserId!: string; //아이디 찾기를 통해  store 에  저장된 아이디 값 호출

  @Auth.Mutation
  private USER_ID!: (userId: string) => void; //아이디 찾기를 통해 해당 값을 store 에 값 저장

  @Auth.Mutation
  private USER_EMAIL!: (value: string) => void; // 이메일 찾기를 통해 해당 값을 store 에 저장

  @Auth.Action
  private FIND_ID_BY_MOBILE!: (mobile: string) => Promise<any>;

  @Auth.Action
  private FIND_ID_BY_EMAIL!: (email: string) => Promise<any>;

  @History.Mutation
  private HISTORY_PAGE!: (pageName: string) => void;


  /**
   * 유효한 모바일 번호인지 체크
   */
  get userMobileState(): boolean {
    const userMobile = /^\d{3}\d{3,4}\d{4}$/;
    return userMobile.test(this.formData.mobile);
  }

  /**
   * 유요한 이메일인지 체크
   */
  get userEmailState(): boolean {
    const userEmail = /^[a-z0-9!#$%&'*+\\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/ig;
    return userEmail.test(this.formData.email);
  }

  get errorMsg(): string {
    return this.errorMessage;
  }

  public created() {
    this.HISTORY_PAGE('login');
  }


  private setErrorMessage(msg: string = ''): void {
    this.errorMessage = msg;
  }


  private activeInputField(value: string): boolean {
    return this.formData.radioValue === value;
  }


  /**
   * 라디오버튼 클릭하여 다른 옵션으로 이동시 에러 표시가 기록되었다면 input 초기화
   * @private
   */
  private optionFindChange(value: string): void {
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
   * 사용자 mobile 번호로 아이디 찾기
   * @private
   */
  private getUserIdByMobile() {
    //UserService.getUserIdByMobile(this.formData.mobile )
    this.FIND_ID_BY_MOBILE(this.formData.mobile)
      .then((data: any) => {
        /*{
        "mobile_no": "01031992443",
          "user_id": "jbc2119",
          "message": "아이디 조회 성공."
      }*/
        console.log('모바일번호로 아이디조회=', data);
        this.isMobileChk = true; //모바일번호로 아이디찾기 완료했음을 기록.
      }).catch((error: any) => {
      // console.log('error', error);
      this.setErrorMessage(error.data.message);
    });
  }

  /**
   * 이메일로 아이디 찾기
   * @private
   */
  private getUserIdByEmail() {
    // UserService.getUserIdByEmail(this.formData.email)
    this.FIND_ID_BY_EMAIL(this.formData.email)
      .then(() => {
        // console.log('이메일로 아이디조회=', data );
        // this.findUserID=data.user_id;
        this.isEmailChk = true; //이메일로 아이디찾기 완료했음을 기록.
      }).catch((error: any) => {
      // console.log('error', error );
      this.setErrorMessage(error.data.message);
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
    this.$router.push('/login').then(() => {
      // console.log('로그인으로 이동 ');
    });
  }

  /**
   * 모바일번호로 아이디 찾기 인증 완료 / 이메일로 아이디찾기 인증완료
   * - 둘 중 어느 것 하나라도 인증이 되었다면 true , 즉 하단의 확인 버튼을 활성화 하게 된다.
   * @private
   */
  private verificationConfirm(): boolean {
    return (this.formData.radioValue === 'mobile' && this.isMobileChk) ||
      (this.formData.radioValue === 'email' && this.isEmailChk);
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
    this.isMobileChk = false;
    this.formData = {
      radioValue: 'mobile',
      email: '',
      mobile: '',
    };
  }

}
