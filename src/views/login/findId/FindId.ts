import {Vue, Component} from 'vue-property-decorator';
// import AuthService from '@/api/service/AuthService';
import UserService from '@/api/service/UserService';
import {namespace} from 'vuex-class';
import WithRender from './FindId.html';

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
export default class FindId extends Vue{

  private mVerificationComplete:boolean=false;
  private isEmailChk:boolean=false;
  private isMobileChk:boolean=false;

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
  private findUserId!:string; //아이디 찾기를 통해  store 에  저장된 아이디 값 호출

  @Auth.Mutation
  private setUserId!: ( userId:string ) => void; //아이디 찾기를 통해 해당 값을 store 에 값 지정

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

  /**
   * 라디오 버튼 클릭시 모델값 리셋.
   * @private
   */
  private radioBtnChanges():void{
    if(this.formData.radioValue==='mobile'){
      this.formData.email = '';
    }else{
      this.formData.mobile = '';
    }
  }


  /**
   * 사용자 mobile 번호로 아이디 찾기
   * @private
   */
  private getUserIdByMobile() {
    // this.mVerificationComplete=false;
    UserService.getUserIdByMobile(this.formData.mobile)
      .then((data:any)=>{
        /*{
          "mobile_no": "01031992443",
          "user_id": "jbc2119",
          "message": "아이디 조회 성공."
        }*/
        console.log('모바일번호로 아이디조회=', data );
        // this.mVerificationComplete=true;
        this.setUserId( data.user_id );
        this.mVerificationComplete=true;
        this.isMobileChk=true;
      });
  }

  /**
   * 이메일로 아이디 찾기
   * @private
   */
  private getUserIdByEmail() {
    // this.mVerificationComplete=false;
    UserService.getUserIdByEmail(this.formData.email)
      .then( (data:any) => {
        console.log('이메일로 아이디조회=', data );
        // this.mVerificationComplete=true;
        // this.findUserID=data.user_id;
        this.setUserId( data.user_id );

        this.isEmailChk=true;
      });
  }

  /**
   * 로그인으로 돌아갈 수 있게끔 이벤트 전송
   * @private
   */
  private gotoLoginHandler():void{
    this.$emit('loginStatusEvent');
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

  /**
   * 확인버튼 클릭시
   * @private
   */
  private confirmClickHandler():void{
    this.resetFormData();
    this.$emit('findIdCompleteEvent');
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
    };
  }
}
