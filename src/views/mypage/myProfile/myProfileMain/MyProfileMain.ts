import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IUserMe} from '@/api/model/user.model';
import UserService from '@/api/service/UserService';
import Btn from '@/components/button/Btn.vue';
import TxtField from '@/components/form/txtField.vue';
import Modal from '@/components/modal/modal.vue';
import WithRender from './MyProfileMain.html';

const Auth = namespace('Auth');

@WithRender
@Component({
    components:{
        Btn,
        Modal,
        TxtField,
    },
})

export default class MyProfileMain extends Vue {
    @Auth.Getter
    public readonly userInfo!: IUserMe;

    @Auth.Action
    public USER_ME_ACTION!: () => Promise<IUserMe>;

    get myInfo(): object {
        // console.log( 'this.userInfo=', this.userInfo );
        return this.userInfo;
    }

    get startDateModel(): string | Date | number{
        return this.startDate;
    }

    /* 팝업 및 페이지 변경 상태 값 */
    private isModifyNameModal: boolean = false;
    private isModifyGender: boolean = false;
    private isModifyEmailModal: boolean = false;

    /* 서비스 탈퇴 팝업 상태 값 */
    private isWithdrawModal: boolean = false;
    private isWithdrawCompleteModal: boolean = false;
    private isWithdrawDeniedModal: boolean = false;

    private tempData: any = '';

    /* 생일 datepicker 관련 */
    private startDate: string | number | Date = '';
    private startDatePickerModel: string= new Date().toISOString().substr(0, 10);
    private startDateMenu: boolean= false; // 캘린 셀렉트 열고 닫게 하는 toggle 변수

    /**
     * 정보변경 modal 혹은 dropdown 열기
     * @param key
     * @private
     */
    public openModify(key: string): void {
        switch(key) {
            case 'name':
                this.isModifyNameModal = !this.isModifyNameModal;
                break;
            case 'gender':
                this.isModifyGender = !this.isModifyGender;
                break;
            case 'email':
                this.isModifyEmailModal = !this.isModifyEmailModal;
                break;
            case 'withdraw':
                this.isWithdrawModal = !this.isWithdrawModal;
                break;
        }
    }

    /**
     * 페이지 이동
     * @param pageKey
     * @private
     */
    public gotoLink(pageKey: string): void {
        this.$router.push(`myProfile/${pageKey}`)
          .then(() => {
              console.log(`${pageKey}로 이동`);
              this.$emit('updatePage', pageKey); // pageKey 값을 이용하여 상단 타이틀을 갱신
          });
    }

    /**
     * 변경할 정보를 임시로 담을 함수
     * @param event
     * @private
     */
    private valueChange(event: any): void {
        this.tempData = event.target.value;
    }

    /**
     * 이름 수정
     * @param newName
     * @private
     */
    private modifyName(newName: string): void {
        UserService.setUserInfo(this.userInfo.user_id, {fullname: this.tempData})
            .then(() => {
                this.USER_ME_ACTION().then( ( me: IUserMe)=>{
                    console.log(me.fullname);
                });
            });
        this.isModifyNameModal = !this.isModifyNameModal;
    }

    /**
     * 시작일시 - datepicker 일자 선택시
     * @private
     */
    private startDatePickerChange( ) {
        this.startDateMenu = false;
        // console.log(this.startDatePickerModel);
    }

    /**
     * 성별 변경
     * @param event
     * @param newGender
     * @private
     */
    private modifyGender( event: Event, newGender: number ): void {
        // console.log('target=', event.target+':::'+event.target.value);
        UserService.setUserInfo(this.userInfo.user_id, {gender: newGender})
            .then(()=>{
                // console.log(data);
                this.USER_ME_ACTION().then( ( me: IUserMe)=>{
                    console.log(me.gender);
                });
            });
        this.isModifyGender = !this.isModifyGender;
    }

    private closeListMenu(): void {
        this.isModifyGender = false;
    }

    /**
     * 이메일 주소 변경
     * @param newEmail
     * @private
     */
    private modifyEmail(newEmail: string): void {
        UserService.setUserInfo(this.userInfo.user_id, {email: newEmail})
            .then(() => {
                this.USER_ME_ACTION().then( ( me: IUserMe)=>{
                    console.log(me.email);
                });
            });
        this.isModifyEmailModal = !this.isModifyEmailModal;
    }

    private withdraw(): void {
        // 클래스 운영자 && 클래스 멤버 1이상 => 탈퇴 불가 모달

        //this.isWithdrawDeniedModal = true;

        // 그렇지 않으면 탈퇴 후 완료 모달
        UserService.serviceWithdraw()
          .then(() => {
              console.log('탈퇴 완료');
              this.isWithdrawModal = false;
              this.isWithdrawCompleteModal = true;
          });
    }

    // 완료 모달 닫으면 로그인 화면으로 이동
    private gotoLogin(): void {
        this.isWithdrawCompleteModal = false;
        this.$router.push('login')
          .then(() => {
              console.log('로그인으로 이동');
          });
    }
}

