import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {Utils} from '@/utils/utils';
import {IUserMe} from '@/api/model/user.model';
import {ISignupModalMsg} from '@/views/model/msg-form.model';
import UserService from '@/api/service/UserService';
import AuthService from '@/api/service/AuthService';
import EventBus from '@/store/EventBus';
import Btn from '@/components/button/Btn.vue';
import TxtField from '@/components/form/txtField.vue';
import Modal from '@/components/modal/modal.vue';
import WithRender from './ModifyMobile.html';

const Auth = namespace('Auth');

@WithRender
@Component({
    components:{
        Btn,
        TxtField,
        Modal
    },
})

export default class ModifyMobile extends Vue {
    @Auth.Getter
    public readonly userInfo!: IUserMe;

    @Auth.Action
    public USER_ME_ACTION!: () => Promise<IUserMe>;

    private mobileNo: string = '';
    private userAuthByMobileChk: boolean= false; // 버튼 텍스트 교체 참조 변수 - 재전송 or  인증
    private isVerifiedCode: boolean = false;
    private verifiedNumModel: string = '';
    private isOpenPopup: boolean = false;
    private MOBILE_STATUS: string = 'mobile';
    private MOBILE_AUTH_STATUS: string = 'mobile-auth';
    private ERROR_VERIFY_NUM: string = 'error-verify-num';
    private verificationKey: string = '';
    private isMobileChk: boolean = false;
    private currentStatus: string = '';

    private modalMsgData: ISignupModalMsg[]= [
        {status:this.ERROR_VERIFY_NUM, title:'인증 번호 실패', desc:'인증번호가 일치하지 않습니다.'},
        {status:this.MOBILE_STATUS, title:'인증 번호', desc:'입력하신 번호로 인증번호 전송하였습니다.'},
        {status:this.MOBILE_AUTH_STATUS, title:'인증 완료', desc:['인증이 완료 되었습니다.', '아래 다음 버튼을 눌러 주세요.']},
    ];

    /**
     * 유효한 모바일 번호인지 체크
     */
    get userMobileState(): boolean {
        const userMobile = Utils.getMobileRegx();
        return userMobile.test(this.mobileNo);
    }

    /**
     * 공통 모달에 알맞은 타이틀 전달.
     */
    get modalTitle(): string{
        const findItem=this.modalMsgData.filter((item: ISignupModalMsg) => item.status === this.currentStatus);
        return findItem[0].title;
    }

    /**
     * 공통 모달에 알맞는 상세 텍스트 전달.
     */
    get modalMsg(): string | string[]{
        const findItem=this.modalMsgData.filter((item: ISignupModalMsg) => item.status === this.currentStatus);
        return findItem[0].desc;
    }

    /**
     * 번호 수정
     * @param newMobile
     * @private
     */
    private modifyMobileNo(): void {
        UserService.setUserInfo(this.userInfo.user_id, {mobile_no: this.mobileNo})
          .then(() => {
              this.USER_ME_ACTION().then( ( me: IUserMe)=>{
                  console.log(me.mobile_no);
              });
          });
        this.gotoMyProfile();
    }

    /**
     * 모바일 번호로 인증번호 전송
     * @private
     */
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

        AuthService.getAuthNumByMobile( this.mobileNo )
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
            }).then(() => {
                this.openPopup(this.MOBILE_AUTH_STATUS);
                this.isVerifiedCode = true;
                this.verifiedNumModel= '';
            }).catch(() => {
                this.isVerifiedCode = false;
                this.openPopup(this.ERROR_VERIFY_NUM);
                // console.log(this.errorMsg);
            });
        }
    }

    /**
     * 인증번호 유효 null 체크
     */
    get isNullVerifiedNum(): boolean{
        return !!this.verifiedNumModel;
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
        this.currentStatus = '';
    }

    private gotoMyProfile(): void {
        this.$router.push('/myProfile')
            .then(() => {
                EventBus.$emit('updateTitle', '');
            });
    }
}