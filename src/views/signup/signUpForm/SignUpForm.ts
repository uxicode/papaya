import {Vue, Component, Watch} from 'vue-property-decorator';
import {Utils} from '@/utils/utils';
import {ISignUpForm} from '@/views/model/member-form.model';
import TxtField from '@/components/form/txtField.vue';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';
import UserService from '@/api/service/UserService';
import WithRender from './SignUpForm.html';
import AuthService from '@/api/service/AuthService';

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
    private userIdMin: number = 5;
    private userIdMax: number = 20;
    private availableId: boolean | number=0;
    private rePassword: string = '';
    private isVerifiedCode: boolean = false;
    private verifiedNumModel: string = '';
    private errorMessage: string = '';
    private verificationKey: string = '';
    private isPwdChk: boolean=false;
    private isSignUpFail: boolean=false;
    private userAuthByMobileChk: boolean= false;

    private formData: ISignUpForm ={
        user_id: '',
        user_password: '',
        fullname: '',
        mobile_no: '',
        email: '',
        agree_marketing:false,
        agree_email: false
    };

    get errorMsg(): string {
        return this.errorMessage;
    }

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
    get userIDState() {
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
        return this.required(this.rePassword) && this.isPwdChk;
    }

    get isAllValidation() {
        return (this.userNameState && this.userIDState && this.pwState && this.isMobileChk);
    }

    get isAvailableID(): boolean | number {
        return this.availableId;
    }

    public required(value: string): boolean {
        // console.log( value, !!value);
        return !!value;
    }

    public resetPwdCheck( passed: boolean ): void{
        this.isPwdChk=passed;
    }
    public checkFieldStatus( value: string ): void {
        console.log('id 필드 =', value );
    }

    private idCheck(): void{
        // this.isIdChk=true; //클릭했는지 체크.
        if( !this.userIDState ){ return; }
        UserService.getIDCheck(this.formData.user_id)
          .then( (data) => {
              console.log( data );
              this.availableId=false;
              // this.formData.user_id=data.user_id;
          })
          .catch( (error) => {
              if( error.data.error_code === 40401 ){
                  this.availableId=true;
              }
          });
    }





    /**
     * 아이디 텍스트 필드 체크 - 중복확인 후 텍스트를 다시 제거시 이전 상태로 돌린다.
     * @param value
     * @param oldValue
     * @private
     */
    /*@Watch('formData.user_id')
    private onChangeIdCheck(value: string, oldValue: string) {
        if( this.isDuplicateId ){
            if( value !== oldValue ){
                this.isDuplicateId=false;
            }
        }
    }*/

    private getUserAuthByMobile(): void {
        // console.log( !this.userMobileState , this.formData.userId===''  )
        this.userAuthByMobileChk=true;
        if (!this.userMobileState) {return;}

        //재전송 상태라면
        if( this.isVerifiedCode ){
            const verifiedCode=document.getElementById('verifiedCode') as HTMLElement;
            console.log(verifiedCode.children);
        }

        AuthService.getAuthNumByMobile( this.formData.mobile_no )
          .then(( data: any ) => {
              // {success: true, verification_key: "7561614675015945", message: "sms 로 인증번호 발송 성공"}
              console.log(data);
              this.verificationKey=data.verification_key;
              this.isMobileChk=true;
          }).catch( (error: any) => {
            console.log('error', error);
        });
    }

    private verifyCompleteByMobile(): void {
        //
        if (this.isMobileChk) {
            AuthService.getVerification({
                key: this.verificationKey,
                num: this.verifiedNumModel,
            }).then((data: any) => {
                console.log(data);
                // alert('인증이 완료 되었습니다.');
                this.isVerifiedCode = true;
                this.verifiedNumModel= '';
                this.setErrorMessage('');
                // this.isVerifiedStatus=true;
            }).catch((error) => {
                this.isVerifiedCode = false;
                this.setErrorMessage(error.data.message);
                console.log(this.errorMsg);
            });
        }

    }

    private setErrorMessage(msg: string = ''): void {
        this.errorMessage = msg;
    }

    private gotoPrevPage(): void{
        this.$router.push('/signForm/verify');
        this.$emit('updateStep', 2);
    }

    private signupSubmit(): void{
        console.log(this.userNameState, this.userIDState, this.pwState, this.isMobileChk);
        if( this.isAllValidation ){
            UserService.signUp( this.formData )
              .then( (data: any) =>{
                  console.log(data);
              }).catch( ( error: any) => {
                  this.isSignUpFail=true;
                  this.setErrorMessage(error.data.message);
            });
        }

    }

    private signupFailPopupClose(): void{
        this.isSignUpFail=false;
    }



   /* private activeInputField(value: string): boolean {
        return this.formData.radioValue === value;
    }*/

}
