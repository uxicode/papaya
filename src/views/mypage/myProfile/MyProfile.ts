import {IUserMe} from '@/api/model/user.model';
import {Vue, Component, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import WithRender from './MyProfile.html';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';

const Auth = namespace('Auth');

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

    private isNameModifyModal: boolean = false;
    private isEmailModifyModal: boolean = false;
    private mobileModify: boolean = false;
    private pwModify: boolean = false;

    /**
     * 이름 변경 팝업 열기
     * @private
     */
    private nameModifyModalOpen(): void {
        this.isNameModifyModal = !this.isNameModifyModal;
    }

    /**
     * 이메일 주소 변경 팝업 열기
     * @private
     */
    private emailModifyModalOpen(): void {
        this.isEmailModifyModal = !this.isEmailModifyModal;
    }

    /**
     * 모바일 번호 변경 페이지 이동
     * @private
     */
    private gotoMobileModify(): void {
        this.mobileModify = !this.mobileModify;
    }

    /**
     * 비밀번호 재설정 페이지 이동
     * @private
     */
    private gotoPwModify(): void {
        this.pwModify = !this.pwModify;
    }
}