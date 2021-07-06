import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IClassInfo, IClassMemberInfo, IQnaInfo} from '@/views/model/my-class.model';
import UserService from '@/api/service/UserService';
import ClassMemberService from '@/api/service/ClassMemberService';
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
    private isDetailAccordion: boolean = false;
    private isDetailPopup: boolean = false;
    private isBlockModal: boolean = false;
    private isBlockCompleteModal: boolean = false;
    private isBanModal: boolean = false;
    private isBanCompleteModal: boolean = false;

    @MyClass.Getter
    private classID!: number;

    @MyClass.Getter
    private myClassHomeModel!: IClassInfo;

    private classMemberList: IClassMemberInfo[] = [];
    private memberId: number = 0;
    private memberNickname: string = '';
    private memberLevel: number = 0;
    private myMemberLevel: number = 0; // 내 멤버 등급

    /* 멤버정보 상세 팝업 */
    private nickname: string = '';
    private userIdNum: number = 0;
    private mobileNo: number = 0;
    private userId: string = '';
    private email: string = '';
    private qnaList: IQnaInfo[] = [];

    get classMembers(): IClassMemberInfo[] {
        return this.classMemberList;
    }

    get classInfo(): any {
        return this.myClassHomeModel;
    }

    public created() {
        this.getAllClassMembers();
        this.getMyMemberLevel();
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
     * 권한별로 더보기 메뉴가 다르기 때문에
     * 나의 멤버 등급을 가져온다.
     * @private
     */
    private getMyMemberLevel(): void {
        ClassMemberService.getClassMemberInfo(this.classID, this.classInfo.me.id)
          .then((data) => {
              //console.log(data.member_info);
              this.myMemberLevel = data.level;
              //console.log(this.myMemberLevel);
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
     * 멤버 프로필 상세 팝업 열면서 해당 멤버의 정보 불러온다.
     * @private
     * @param item
     */
    private detailPopupOpen(item: IClassMemberInfo): void {
        this.userIdNum = item.user_id;
        this.memberLevel = item.level;
        this.nickname = item.nickname;
        this.memberId = item.id;
        this.isDetailPopup = true;
        UserService.getUserInfo(this.userIdNum)
          .then((data) => {
              this.mobileNo = data.user.mobile_no;
              this.userId = data.user.user_id;
              this.email = data.user.email;
          });
        this.getMemberQna(this.memberId);
    }

    /**
     * 멤버 프로필 상세 팝업 내에 들어가는 질문 답변 가져오기
     * @param memberId
     * @private
     */
    private getMemberQna(memberId: number): void {
        ClassMemberService.getMemberClassQnA(this.classID, memberId)
          .then((data) => {
              this.qnaList = data.qnalist;
          });
    }

    /**
     * 멤버 차단 팝업 열기
     * @private
     */
    private blockModalOpen(id: number, level: number): void {
        if (level !== 1) {
            alert('멤버 차단은 운영자만 가능합니다.');
            return;
        }
        this.memberId = id;
        if (this.classInfo.me.id === this.memberId) {
            alert('자기 자신은 차단할 수 없습니다.');
            return;
        } else if (level === 1) {
            alert('운영자는 차단할 수 없습니다.');
            return;
        }
        this.getMemberInfo();
        this.isBlockModal = true;
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
    private banModalOpen(id: number, level: number): void {
        if (level !== 1) {
            alert('멤버 강제 탈퇴는 운영자만 가능합니다.');
            return;
        }
        this.memberId = id;
        if (this.classInfo.me.id === this.memberId) {
            alert('자기 자신은 강제탈퇴할 수 없습니다.');
            return;
        } else if (level === 1) {
            alert('운영자는 강제탈퇴할 수 없습니다.');
            return;
        }
        this.getMemberInfo();
        this.isBanModal = true;
    }

    /**
     * 멤버 강제 탈퇴
     * @private
     */
    private banMember(): void {
        this.isBanModal = false;
        ClassMemberService.deleteClassMemberByAdmin(this.classID, this.memberId)
            .then((data) => {
                const findIdx = this.classMemberList.findIndex((ele) => ele.id === data.user_id);
                this.classMemberList.splice(findIdx, 1);
            });
        this.isBanCompleteModal = true;
    }

    /**
     * Modal 안에 들어갈 정보
     * @private
     */
    private getMemberInfo(): void {
        ClassMemberService.getClassMemberInfo(this.classID, this.memberId)
          .then((data: any) => {
            // console.log(data);
            this.memberNickname = data.member_info.nickname;
            this.memberLevel = data.member_info.level;
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
