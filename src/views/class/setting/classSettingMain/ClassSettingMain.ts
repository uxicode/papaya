import {Vue, Component} from 'vue-property-decorator';
import WithRender from './ClassSettingMain.html';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';

@WithRender
@Component({
    components:{
        Modal,
        Btn
    }
})
export default class ClassSettingMain extends Vue{
    /* Modal 오픈 상태값 */
    private isBasicInfo: boolean = false;
    private isGuideTxt: boolean = false;
    private isJoinQnaSetting: boolean = false;
    private isWithdraw: boolean = false;

    /**
     * 클래스 프로필 설정 페이지 이동
     * @private
     */
    private gotoClassProfile(): void {
        this.$router.push('classProfile')
            .then();
    }

    /**
     * 클래스 기본 정보 설정 페이지 이동
     * @private
     */
    private gotoClassBasicInfo(): void {
        this.$router.push('classBasicInfo')
            .then();
    }

    /**
     * 클래스 태그 관리 페이지 이동
     * @private
     */
    private gotoClassTagManage(): void {
        this.$router.push('classTagManage')
            .then();
    }

    /**
     * 클래스 가입 현황 페이지 이동
     * @private
     */
    private gotoClassJoinStatus(): void {
        this.$router.push('classJoinStatus')
            .then();
    }

    /**
     * 클래스 멤버 관리 페이지 이동
     * @private
     */
    private gotoClassMemberManage(): void {
        this.$router.push('classMemberManage')
            .then();
    }

    /**
     * 클래스 스탭 관리 페이지 이동
     * @private
     */
    private gotoClassStaffManage(): void {
        this.$router.push('classStaffManage')
            .then();
    }

    /**
     * 클래스 운영자 위임 신청 페이지 이동
     * @private
     */
    private gotoClassAdminDelegate(): void {
        this.$router.push('classAdminDelegate')
            .then();
    }

    /**
     * 클래스 탈퇴 완료
     * @private
     */
    private withdrawSubmit(): void {

        this.$router.push('../classWithdrawComplete')
            .then();
    }
}