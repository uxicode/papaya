import {IUserMe} from '@/api/model/user.model';
import UserService from '@/api/service/UserService';
import {namespace} from 'vuex-class';
import {Vue, Component, Prop} from 'vue-property-decorator';
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

    /* 팝업 및 페이지 변경 상태 값 */
    private isModifyNameModal: boolean = false;
    private isModifyGender: boolean = false;
    private isModifyEmailModal: boolean = false;

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
    private modifyNameModalOpen(): void {
        this.isModifyNameModal = !this.isModifyNameModal;
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
     * 성별 변경 토글
     * @private
     */
    private modifyGenderToggle(): void {
        this.isModifyGender = !this.isModifyGender;
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

    /**
     * 모바일 번호 변경 페이지 이동
     * @private
     */
    private gotoModifyMobile(): void {
        this.$router.push('myProfile/modifyMobile');
        this.$emit('updatePage', 'modifyMobile');
    }

    /**
     * 이메일 주소 변경 팝업 열기
     * @private
     */
    private modifyEmailModalOpen(): void {
        this.isModifyEmailModal = !this.isModifyEmailModal;
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

    /**
     * 비밀번호 재설정 페이지 이동
     * @private
     */
    private gotoPwModify(): void {
        this.$router.push('myProfile/modifyPw');
        this.$emit('updatePage', 'modifyPw');
    }
}

