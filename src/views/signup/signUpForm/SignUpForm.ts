import {Component, Vue} from 'vue-property-decorator';
import {Utils} from '@/utils/utils';
import {ISignUpForm} from '@/views/model/member-form.model';
import TxtField from '@/components/form/txtField.vue';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';
import UserService from '@/api/service/UserService';
import WithRender from './SignUpForm.html';
import AuthService from '@/api/service/AuthService';
import {namespace} from 'vuex-class';
import {SIGN_UP_ACTION} from '@/store/action-auth-types';



const Auth = namespace('Auth');

interface ISignupModalMsg{
    status: string;
    title: string;
    desc: string | string[];
}

@WithRender
@Component({
    components: {
        TxtField,
        Btn,
        Modal,
    },
})
export default class SignUpForm extends Vue {

    private isMobileChk: boolean = false;
    private isEmailChk: boolean = false;
    private userIdMin: number = 5;
    private userIdMax: number = 20;
    private rePassword: string = '';
    private verifiedNumModel: string = '';
    private verificationKey: string = '';
    private isVerifiedCode: boolean = false;
    private isPwdChk: boolean=false;
    private isSignUpFail: boolean=false;
    private userAuthByMobileChk: boolean= false; // 버튼 텍스트 교체 참조 변수 - 재전송 or  인증
    private isOpenPopup: boolean = false;
    private currentStatus: string = '';
    private ID_CHECK: string = 'id-check';
    private EMAIL_CHECK: string = 'email-check';
    private MOBILE_STATUS: string = 'mobile';
    private MOBILE_AUTH_STATUS: string = 'mobile-auth';
    private SUCCESS_MEMBERSHIP: string = 'success-membership';
    private ERROR_VERIFY_NUM: string = 'error-verify-num';
    private ERROR_DISABLED_ID: string = 'error-disabled-id';
    private ERROR_FAIL_SIGNUP: string = 'error-fail-signup';
    private ERROR_DISABLED_EMAIL: string = 'error-disabled-email';

    private modalMsgData: ISignupModalMsg[]= [
        {status:this.ERROR_DISABLED_ID, title:'아이디 중복 확인', desc:'이미 사용 중인 아이디입니다.'},
        {status:this.ERROR_DISABLED_EMAIL, title:'이메일 중복 확인', desc:'이미 사용 중인 이메일 주소입니다.'},
        {status:this.ERROR_VERIFY_NUM, title:'인증 번호 실패', desc:'인증번호가 일치하지 않습니다.'},
        {status:this.ID_CHECK, title:'아이디 중복 확인', desc:'사용 가능한 아이디입니다.'},
        {status:this.EMAIL_CHECK, title:'이메일 중복 확인', desc:'사용 가능한 이메일 주소입니다.'},
        {status:this.MOBILE_STATUS, title:'인증 번호', desc:'입력하신 번호로 인증번호 전송하였습니다.'},
        {status:this.MOBILE_AUTH_STATUS, title:'인증 완료', desc:['인증이 완료 되었습니다.', '아래 다음 버튼을 눌러 주세요.']},
        {status:this.ERROR_FAIL_SIGNUP, title:'회원 가입 실패', desc:['회원가입이 실패하였습니다.', '입력사항을 다시 한번 체크해 주세요.']},
        {status:this.SUCCESS_MEMBERSHIP, title:'회원 가입 성공', desc:['회원가입이 되신 것을 축하드립니다.', '로그인으로 이동합니다.']},
    ];

    private formData: ISignUpForm ={
        user_id: '',
        user_password: '',
        fullname: '',
        mobile_no: '',
        email: '',
        agree_marketing:false,
        agree_email: false
    };


    @Auth.Action
    private SIGN_UP_ACTION!: ( data: any) => Promise<any>;

    /**
     * 유효한 모바일 번호인지 체크
     */
    get userMobileState(): boolean {
        const userMobile = Utils.getMobileRegx();
        return userMobile.test(this.formData.mobile_no);
    }

    /**
     * 유요한 이메일인지 체크
     */
    get userEmailState(): boolean {
        const userEmail = Utils.getEmailRegx();
        return userEmail.test(this.formData.email);
    }

    /**
     * 유효한 아이디 체크
     */
    get userIDState(): boolean {
        //정규표현식을 아래와 같이 변수를 연동하는 등의 동적 표현시엔 RegExp 생성자를 사용한다.
        const userIDRegx =Utils.getUserIdRegx(this.userIdMin, this.userIdMax);
        return userIDRegx.test(this.formData.user_id);
    }

    get isNullVerifiedNum(): boolean{
        return !!this.verifiedNumModel;
    }

    get userNameState(): boolean {
        return  !!this.formData.fullname;
    }

    get pwState(): boolean{
        return (this.formData.user_password === this.rePassword) && this.isPwdChk;
    }

    get isAllValidation(): boolean {
        return (this.userNameState && this.userIDState && this.pwState && this.isMobileChk && this.isVerifiedCode);
    }

    get isValidEmail(): boolean {
        return ( this.formData.email==='') || (this.formData.email !== '' && this.isEmailChk);
    }

    get modalTitle(): string{
        const findItem=this.modalMsgData.filter((item: ISignupModalMsg) => item.status === this.currentStatus);
        return findItem[0].title;
    }

    get modalMsg(): string | string[]{
        const findItem=this.modalMsgData.filter((item: ISignupModalMsg) => item.status === this.currentStatus);
        return findItem[0].desc;
    }


    public required(value: string): boolean {
        // console.log( value, !!value);
        return !!value;
    }

    public resetPwdCheck(  passed: boolean ): void{
        console.log(this.isPwdChk);
        this.isPwdChk=passed;
    }
    public gotoErrorElement( selector: string ): void {
        const inputEle=document.getElementById(selector) as HTMLInputElement;
        inputEle.classList.add('error');
        inputEle.classList.add('shake');

        inputEle.addEventListener('animationend', (e) =>{
            inputEle.classList.remove('shake');
            inputEle.focus();
            inputEle.blur();
        }, {once: true});
    }

    /**
     * 팝업 열기
     * @param status
     * @private
     */
    private openPopup( status: string='' ): void{
        this.isOpenPopup=true;
        this.currentStatus = status;
    }

    /**
     * 팝업 닫기
     * @private
     */
    private closePopup(): void{
        this.isOpenPopup=false;
        //회원가입 성공시
        if( this.currentStatus === this.SUCCESS_MEMBERSHIP ){
            //로그인 페이지로 이동
            this.$router.push('/signup/complete').then(()=>{
                console.log('회원가입 성공');
            });
        }else if( this.currentStatus ===this.ERROR_FAIL_SIGNUP ){  //회원가입 실패시
            // console.log(this.userNameState, this.userIDState, this.pwState, this.isMobileChk, this.isValidEmail);
            const validateData = [
                {id: 'name', check: this.userNameState},
                {id: 'userID', check: this.userIDState},
                {id: 'pwd', check: this.pwState},
                {id: 'mobile', check: this.isMobileChk}
            ];
            const invalidItems=validateData.filter( ( value: { check: boolean, id: string} ) => !value.check );

            invalidItems.forEach( ( value: {check: boolean, id: string})=>{
                this.gotoErrorElement( value.id );
            });

            this.currentStatus = '';
        }else{
            this.currentStatus = '';
        }
    }

    private gotoPrevPage(): void{
        this.$router.push('/signForm/verify');
        this.$emit('updateStep', 2);
    }

    /**
     * 아이디 중복 체크
     * @private
     */
    private idCheck(): void{
        if( !this.userIDState ){ return; }
        UserService.getIDCheck(this.formData.user_id)
          .then( ( data: any ) => {
              // this.formData.user_id=data.user_id;
              this.openPopup(this.ERROR_DISABLED_ID);
          })
          .catch( (error: any) => {
              if( error.data.error_code === 40401 ){
                  this.openPopup(this.ID_CHECK);
              }
          });
    }

    private getUserAuthByMobile(): void {
        // console.log( !this.userMobileState , this.formData.userId===''  )
        // 버튼 텍스트 교체 참조 변수 - 재전송 or  인증
        this.userAuthByMobileChk=true;
        if (!this.userMobileState) {return;}

        //이미 인증번호를 받고 인증완료된 상태에서 재차 인증번호 발급 받을시 ~
        if( this.isVerifiedCode ){
            //입력된 인증번호를 제거한다
            setTimeout(() => {
                const verifiedNumInput=document.getElementById('verifiedCode') as HTMLInputElement;
                this.verifiedNumModel = '';
                verifiedNumInput.value = this.verifiedNumModel;
            }, 200);
        }

        AuthService.getAuthNumByMobile( this.formData.mobile_no )
          .then(( data: any ) => {
              // {success: true,
              // verification_key: "7561614675015945",
              // message: "sms 로 인증번호 발송 성공"}
              console.log(data);
              this.openPopup(this.MOBILE_STATUS);
              this.verificationKey=data.verification_key;
              this.isMobileChk=true;

          }).catch( (error: any) => {
            console.log('error', error);
        });
    }

    /**
     * 인증번호 입력해서 인증 확인전송.
     * @private
     */
    private verifyCompleteByMobile(): void {
        //모바일 번호 전송 이후 상태라면~
        if (this.isMobileChk) {
            AuthService.getVerification({
                key: this.verificationKey,
                num: this.verifiedNumModel,
            }).then((data: any) => {
                this.openPopup(this.MOBILE_AUTH_STATUS);
                this.isVerifiedCode = true;
                this.verifiedNumModel= '';
            }).catch((error) => {
                this.isVerifiedCode = false;
                this.openPopup(this.ERROR_VERIFY_NUM);
                // console.log(this.errorMsg);
            });
        }
    }

    private emailCheck(): void{
        if( !this.userEmailState ){ return; }
        UserService.getEmailCheck(this.formData.email)
          .then((data: any) => {
              /*{
                  "email": "jbc2119@gmail.com",
                "user_id": "jbc2119",
                "message": "아이디 조회 성공."
              }*/
              this.isEmailChk=false;
              this.openPopup(this.ERROR_DISABLED_EMAIL);
          }).catch((error: any) => {
            /*{
                "error_code": 40404,
              "message": "email 주소가 없습니다."
            }*/
            this.isEmailChk=true;
            this.openPopup(this.EMAIL_CHECK);
        });
    }

    /**
     * 회원가입>인증부분때문에 실패시 해당 입력필드에 shake error 클래스 적용해야 함.
     * 최종 회원가입 양식 전송
     * @private
     */
    private signupSubmit(): void{
        // console.log(this.userNameState, this.userIDState, this.pwState, this.isMobileChk, this.isValidEmail);
        this.openPopup(this.ERROR_FAIL_SIGNUP);
        if( this.isAllValidation && this.isValidEmail){

            this.SIGN_UP_ACTION( this.formData )
              .then( (data: any)=>{
                  this.openPopup(this.SUCCESS_MEMBERSHIP);
              }).catch( ( error: any) =>{
                this.openPopup(this.ERROR_FAIL_SIGNUP);
            });
            /*UserService.signUp( this.formData )
              .then( (data: any) =>{
                  console.log(data);
                  this.openPopup(this.SUCCESS_MEMBERSHIP);

              }).catch( ( error: any) => {
                  this.openPopup(this.ERROR_FAIL_SIGNUP);
                  //회원가입 실패!!! - 유저아이디가 이미 존재합니다.
            });*/
        }

    }
}
