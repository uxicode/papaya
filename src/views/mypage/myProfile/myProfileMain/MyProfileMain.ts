import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IUserMe} from '@/api/model/user.model';
import UserService from '@/api/service/UserService';
import EventBus from '@/store/EventBus';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';
import WithRender from './MyProfileMain.html';
import {AuthWayActionTypes} from '@/store/action-auth-types';

const Auth = namespace('Auth');

@WithRender
@Component({
    components:{
        Btn,
        Modal,
    },
})

export default class MyProfileMain extends Vue {
    @Auth.Getter
    private userInfo!: IUserMe;

    @Auth.Action
    private [AuthWayActionTypes.USER_ME_ACTION]!: () => Promise<IUserMe>;

    get myInfo() {
        // console.log( 'this.userInfo=', this.userInfo );
        return this.userInfo;
    }

    get myBirthday() {
        return (this.myInfo) ? this.myInfo.birthday : '';
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
    private inputBirthday: string = '';
    private startDateMenu: boolean = false; // 캘린 셀렉트 열고 닫게 하는 toggle 변수

    private getFullname(): string {
        return (this.myInfo)? this.myInfo.fullname : '';
    }

    private getGender(): string {
        return (this.myInfo)? ((this.myInfo.gender===1)? '남자' : '여자') : '';
    }

    private getUserId(): string {
        return (this.myInfo)? this.myInfo.user_id: '';
    }
    private getMobile(): string {
        return (this.myInfo)? this.myInfo.mobile_no : '';
    }
    private getEmail(): string {
        return (this.myInfo)? this.myInfo.email : '';
    }

    /**
     * 정보변경 modal 혹은 dropdown 열기
     * @param key
     * @private
     */
    private openModify(key: string): void {
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
    private gotoLink(pageKey: string): void {
        this.$router.push(`myProfile/${pageKey}`)
          .then(() => {
              console.log(`${pageKey}로 이동`);
              EventBus.$emit('updateTitle', pageKey); // pageKey 값을 이용하여 상단 타이틀을 갱신
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
                this[AuthWayActionTypes.USER_ME_ACTION]().then( (me: IUserMe)=>{
                    console.log(me.fullname);
                });
            });
        this.isModifyNameModal = !this.isModifyNameModal;
    }

    /**
     * '-' 형태의 생일을 구분자 없는 문자열로 변환 후
     * 생일 변경 통신
     * @private
     */
    private birthdayModify(newBirthday: string): any {
        const unDashedBirthday = String(newBirthday.split('-').join(''));
        UserService.setUserInfo(this.userInfo.user_id, {birthday: unDashedBirthday})
          .then(() => {
              this[AuthWayActionTypes.USER_ME_ACTION]().then( (me: IUserMe)=>{
                  console.log(me.birthday);
              });
          });
    }

    /**
     * 시작일시 - datepicker 일자 선택시
     * @private
     */
    private startDatePickerChange() {
        this.startDateMenu = false;
        // console.log(this.startDatePickerModel);
    }

    /**
     * 성별 변경
     * @param event
     * @param newGender
     * @private
     */
    private modifyGender(newGender: number): void {
        // console.log('target=', event.target+':::'+event.target.value);
        UserService.setUserInfo(this.userInfo.user_id, {gender: newGender})
            .then(() => {
                // console.log(data);
                this[AuthWayActionTypes.USER_ME_ACTION]().then( (me: IUserMe)=>{
                    console.log(me.gender);
                    this.myInfo.gender = newGender;
                });
            });
        this.isModifyGender = false;
    }

    /**
     * 토글 메뉴 바깥 영역 클릭시 메뉴 닫기
     * @private
     */
    private closeListMenu(): void {
        const listPopup = document.querySelectorAll('.list-popup-menu');
        listPopup.forEach((item) => item.classList.remove('active'));
    }

    /**
     * 이메일 주소 변경
     * @param newEmail
     * @private
     */
    private modifyEmail(newEmail: string): void {
        UserService.setUserInfo(this.userInfo.user_id, {email: newEmail})
            .then(() => {
                this[AuthWayActionTypes.USER_ME_ACTION]().then( (me: IUserMe)=>{
                    console.log(me.email);
                    this.myInfo.email = newEmail;
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

