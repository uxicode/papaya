import ClassMemberService from '@/api/service/ClassMemberService';
import MyClassService from '@/api/service/MyClassService';
import { IClassMemberInfo } from '@/views/model/my-class.model';
import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';
import WithRender from './ClassMemberManage.html';

const MyClass = namespace('MyClass');

@WithRender
@Component({
    components:{
        Btn,
        Modal,
    }
})
export default class ClassMemberManage extends Vue{
    private isActive: boolean = false;
    private isBlockModal: boolean = false;
    private isBlockCompleteModal: boolean = false;
    private isBanModal: boolean = false;
    private isBanCompleteModal: boolean = false;

    @MyClass.Getter
    private classID!: number;

    private classMemberList: IClassMemberInfo[] = [];
    private memberId: number = 0;
    private memberNickname: string = '';
    private memberLevel: number = 0;

    get classMembers(): IClassMemberInfo[] {
        return this.classMemberList;
    }

    public created() {
        this.getAllClassMembers();
    }

    /**
     * 전체 클래스 멤버 가져오기
     * @private
     */
    private getAllClassMembers(): void {
        ClassMemberService.getAllClassMembers(this.classID)
          .then((data) => {
            this.classMemberList = data.class_member_list;
            //console.log(this.classMemberList);
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
                return 'admin';
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
     * 리스트 팝업 토글
     * @param idx
     * @private
     */
    private listPopupToggle(idx: number): void {
        const listPopup = document.querySelectorAll('.member-item .list-popup-menu');
        //listPopup.forEach((item) => item.classList.remove('active'));
        listPopup[idx].classList.toggle('active');
    }

    /**
     * 멤버 차단 팝업 열기
     * @private
     */
    private blockModalOpen(id: number): void {
        this.isActive = false;
        this.isBlockModal = true;
        this.memberId = id;
        this.getMemberInfo();
    }

    /**
     * 멤버 차단 전송
     * @private
     */
    private memberBlockSubmit(): void {
        this.isBlockModal = false;
        this.isBlockCompleteModal = true;
        ClassMemberService.setBlockClassMember(this.classID, this.memberId)
          .then(() => {
             console.log(`${this.memberId} 멤버 차단 완료`);
          });
    }

    /**
     * 멤버 강제 탈퇴 팝업 열기
     * @private
     */
    private banModalOpen(id: number): void {
        this.isActive = false;
        this.isBanModal = true;
        this.memberId = id;
        this.getMemberInfo();
    }

    /**
     * Modal 안에 들어갈 정보
     * @private
     */
    private getMemberInfo(): void {
        ClassMemberService.getClassMemberInfo(this.classID, this.memberId)
          .then((data) => {
            console.log(data);
            this.memberNickname = data.nickname;
            console.log(this.memberNickname);
            this.memberLevel = data.level;
            console.log(this.memberLevel);
          });
    }

    /**
     * 뒤로가기
     * @private
     */
    private goBack(): void {
        this.$router.push('./')
            .then();
    }

    /**
     * 차단 멤버 목록 페이지 이동
     * @private
     */
    private gotoBlockedMemberList(): void {
        this.$router.push('blockedMemberList')
            .then();
    }
}
