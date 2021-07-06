import ClassMemberService from '@/api/service/ClassMemberService';
import UserService from '@/api/service/UserService';
import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IClassAuth, IClassInfo, IClassMemberInfo, IQnaInfo} from '@/views/model/my-class.model';
import MyClassService from '@/api/service/MyClassService';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import WithRender from './ClassStaffManage.html';

const MyClass = namespace('MyClass');

@WithRender
@Component({
    components: {
        Modal,
        Btn
    }
})

export default class ClassStaffManage extends Vue {
    @MyClass.Getter
    private classID!: number;

    @MyClass.Getter
    private myClassHomeModel!: IClassInfo;

    private classStaffList: IClassMemberInfo[] = [];
    private totalStaffNum: number = 0;

    private isActive: boolean = false;
    private isDetailAccordion: boolean = false;
    private isDetailPopup: boolean = false;
    private isStaffModifyPopup: boolean = false;
    private isChangePopup: boolean = false;
    private isChangeCompletePopup: boolean = false;
    private isBlockModal: boolean = false;
    private isBlockCompleteModal: boolean = false;
    private isBanModal: boolean = false;
    private isBanCompleteModal: boolean = false;
    private memberId: number = 0;

    /* 멤버정보 상세 팝업 */
    private nickname: string = '';
    private userIdNum: number = 0;
    private mobileNo: number = 0;
    private userId: string = '';
    private email: string = '';
    private qnaList: IQnaInfo[] = [];

    /* 권한 설정 관련 */
    private authList: IClassAuth[] = [
        {
            auth_type: 1,
            be_authorized: true
        },
        {
            auth_type: 2,
            be_authorized: true
        },
        {
            auth_type: 3,
            be_authorized: true
        }
    ];
    private authTypeList: string[] = ['알림 관리', '일정 관리', '교육과정 관리'];

    get classInfo(): any {
        return this.myClassHomeModel;
    }

    public created() {
        this.getClassStaffs();
    }

    /**
     * 전체 스탭 멤버 리스트를 가져온다.
     * @private
     */
    private getClassStaffs(): void {
        MyClassService.getClassInfoById(this.classID)
          .then((data) => {
              // 가입 승인된 스탭 멤버만 불러온다.
              this.classStaffList = data.classinfo.class_members.filter(
                (item: IClassMemberInfo) => (item.status === 1 && item.level === 2));
              console.log(this.classStaffList);
              this.totalStaffNum = this.classStaffList.length;
          });
    }

    /**
     * 멤버 프로필 상세 팝업 열면서 해당 멤버의 정보 불러온다.
     * @private
     * @param item
     */
    private detailPopupOpen(item: IClassMemberInfo): void {
        this.userIdNum = item.user_id;
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

    private closeDetailPopup(): void {
        this.isDetailPopup = false;
        this.qnaList = [];
    }

    /**
     * 스탭 권한 설정 팝업 열기
     * @private
     * @param item
     */
    private staffModifyPopupOpen(item: IClassMemberInfo): void {
        if (this.classInfo.me.level !== 1) {
            alert('스탭 권한설정은 운영자만 가능합니다.');
            return;
        }

        this.isStaffModifyPopup = true;
        this.memberId = item.id;
        this.nickname = item.nickname;

        ClassMemberService.getClassAuth(this.classID, this.memberId)
          .then((data) => {
              this.authList = data.authlist;
              console.log(this.authList);
          });
    }

    /**
     * 권한 설정 변경 내용 저장
     * @private
     */
    private submitAuthChange(): void {
        ClassMemberService.setClassMemberInfo(this.classID, this.memberId, {
            auth_list: this.authList
        }).then(() => {
           console.log('수정 완료');
        });
        this.isStaffModifyPopup = false;
    }

    /**
     * 스탭 멤버 -> 일반 멤버로 단계 수정 제출
     * @private
     */
    private submitLevelChange(): void {
        this.isChangePopup = false;
        ClassMemberService.setClassMemberInfo(this.classID, this.memberId, {level: 3})
          .then((data) => {
              console.log(`${data.level} 로 수정완료`);
          });
        this.isChangeCompletePopup = true;
    }

    /**
     * 일반 멤버로 전환 완료 팝업 닫기 (스탭 권한 설정 변경 팝업도 닫는다)
     * @private
     */
    private closeChangeCompletePopup(): void {
        this.isChangeCompletePopup = false;
        this.isStaffModifyPopup = false;
    }

    /**
     * 멤버 차단 팝업 열기
     * @private
     */
    private blockModalOpen(item: IClassMemberInfo): void {
        if (item.level !== 1) {
            alert('멤버 차단은 운영자만 가능합니다.');
            return;
        }
        this.memberId = item.id;
        if (this.classInfo.me.id === this.memberId) {
            alert('자기 자신은 차단할 수 없습니다.');
            return;
        }
        this.isActive = false;
        this.isBlockModal = true;
        this.nickname = item.nickname;
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
    private banModalOpen(item: IClassMemberInfo): void {
        if (item.level !== 1) {
            alert('멤버 강제 탈퇴는 운영자만 가능합니다.');
            return;
        }
        this.memberId = item.id;
        if (this.classInfo.me.id === this.memberId) {
            alert('자기 자신은 강제탈퇴할 수 없습니다.');
            return;
        }
        this.isActive = false;
        this.isBanModal = true;
        this.nickname = item.nickname;
    }

    /**
     * 멤버 강제 탈퇴
     * @private
     */
    private banMember(): void {
        this.isBanModal = false;
        ClassMemberService.deleteClassMemberByAdmin(this.classID, this.memberId)
            .then((data) => {
                const findIdx = this.classStaffList.findIndex((ele) => ele.id === data.user_id);
                this.classStaffList.splice(findIdx, 1);
            });
        this.isBanCompleteModal = true;
    }

    /**
     * 스탭 추가 페이지로 이동
     * @private
     */
    private gotoAddStaff(): void {
        this.$router.push(`/class/${this.classID}/setting/classStaffAdd`)
          .then();
    }

    /**
     * 뒤로가기
     * @private
     */
    private goBack(): void {
        this.$router.push('./')
            .then();
    }
}
