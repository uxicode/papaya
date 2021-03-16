import {IUserMe} from '@/api/model/user.model';
import UserService from '@/api/service/UserService';
import {Vue, Component, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import WithRender from './MyProfile.html';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';

const Auth = namespace('Auth');

interface IPwd {
    nPwd: string;
    rePwd: string;
}

@WithRender
@Component({
    components:{
        Btn,
        Modal,
    },
})
export default class MyProfile extends Vue {
    @Auth.Getter
    public userInfo!: IUserMe;

    get myInfo(): object {
        // console.log( 'this.userInfo=', this.userInfo );
        return this.userInfo;
    }

    /* 팝업 및 페이지 변경 상태 값 */
    private isNameModifyModal: boolean = false;
    private isGenderModify: boolean = false;
    private isMobileModify: boolean = false;
    private isEmailModifyModal: boolean = false;
    private isPwModify: boolean = false;
    private isPwConfirmed: boolean = false;

    private tempData: any = '';

    /**
     * 변경할 정보를 임시로 담을 함수
     * @param event
     * @private
     */
    private valueChange(event: any): void {
        this.tempData = event.target.value;
    }

    /**
     * 이름 변경 팝업 열기
     * @private
     */
    private nameModifyModalOpen(): void {
        this.isNameModifyModal = !this.isNameModifyModal;
    }

    /**
     * 이름 수정
     * @param newName
     * @private
     */
    private nameModify(newName: string): void {
        UserService.setUserInfo(this.userInfo.user_id, {fullname: this.tempData}); // 실제 데이터에서 이름이 변경됨
        this.isNameModifyModal = !this.isNameModifyModal;
        this.userInfo.fullname = this.tempData; // 화면상에서 바뀐 이름이 즉시 반영됨
    }

    /**
     * 성별 변경 토글
     * @private
     */
    private genderModifyToggle(): void {
        this.isGenderModify = !this.isGenderModify;
    }

    private genderModify(newGender: number): void {
        UserService.setUserInfo(this.userInfo.user_id, {gender: newGender});
        this.isGenderModify = !this.isGenderModify;
        this.userInfo.gender = newGender; // 화면상에서 바뀐 이름이 즉시 반영됨
    }

    /**
     * 모바일 번호 변경 페이지 이동
     * @private
     */
    private gotoMobileModify(): void {
        this.isMobileModify = !this.isMobileModify;
    }

    /**
     * 이메일 주소 변경 팝업 열기
     * @private
     */
    private emailModifyModalOpen(): void {
        this.isEmailModifyModal = !this.isEmailModifyModal;
    }

    /**
     * 비밀번호 재설정 페이지 이동
     * @private
     */
    private gotoPwModify(): void {
        this.isPwModify = !this.isPwModify;
    }

}