import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import ClassMemberService from '@/api/service/ClassMemberService';
import {IClassMemberInfo} from '@/views/model/my-class.model';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import WithRender from './BlockedMemberList.html';

const MyClass = namespace('MyClass');

@WithRender
@Component({
    components: {
        Modal,
        Btn
    }
})

export default class BlockedMemberList extends Vue {
    private isUnblockModal: boolean = false;
    private isUnblockCompleteModal: boolean = false;

    private blockedMemberList: IClassMemberInfo[] = [];
    private blockedMemberNickname: string = '';
    private blockedMemberLevel: number = 0;
    private blockedMemberId: number = 0;

    @MyClass.Getter
    private classID!: number;

    public created() {
        this.getBlockedMembers();
    }

    /**
     * 차단 멤버 목록 조회
     * @private
     */
    private getBlockedMembers(): void {
        ClassMemberService.getBlockedClassMembers(this.classID)
          .then((data) => {
              this.blockedMemberList = data.class_member_list;
              console.log(this.blockedMemberList);
          });
    }

    /**
     * 차단 해제 팝업 열기
     * @param id
     * @private
     */
    private unblockModalOpen(id: number): void {
        this.isUnblockModal = true;
        this.blockedMemberId = id;
        this.getBlockedMemberInfo(id);
    }

    /**
     * 차단 해제 팝업 오픈시 멤버 정보 불러오기
     * @param id
     * @private
     */
    private getBlockedMemberInfo(id: number): void {
        ClassMemberService.getClassMemberInfo(this.classID, id)
          .then((data: any) => {
              this.blockedMemberNickname = data.member_info.nickname;
              this.blockedMemberLevel = data.member_info.level;
          });
    }

    /**
     * 멤버 등급별 아이콘
     * @param level
     * @private
     */
    private memberLevelIcon(level: number): string {
        switch (level) {
            case 1:
                return 'manager';
            case 2:
                return 'staff';
            default:
                return 'member';
        }
    }

    /**
     * 멤버 등급 이름
     * @param level
     * @private
     */
    private memberLevelTxt(level: number): string {
        switch (level) {
            case 1:
                return '운영자';
            case 2:
                return '스탭 멤버';
            default:
                return '일반 멤버';
        }
    }

    /**
     * 차단 해제
     * @private
     */
    private submitUnblock(): void {
        this.isUnblockModal = false;
        ClassMemberService.setUnBlockClassMember(this.classID, this.blockedMemberId)
            .then((msg) => {
                console.log(msg);
                const findIdx = this.blockedMemberList.findIndex((ele) => ele.id === this.blockedMemberId);
                this.blockedMemberList.splice(findIdx, 1);
            });
        this.isUnblockCompleteModal = true;
    }

    private goBack(): void {
        this.$router.push(`/class/${this.classID}/setting/classMemberManage`)
          .then();
    }
}