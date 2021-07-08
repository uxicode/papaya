import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IClassMemberInfo, IQnaInfo} from '@/views/model/my-class.model';
import MyClassService from '@/api/service/MyClassService';
import ClassMemberService from '@/api/service/ClassMemberService';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';
import WithRender from './ClassJoinStatus.html';

const MyClass = namespace('MyClass');

@WithRender
@Component({
    components: {
        Btn,
        Modal
    }
})

export default class ClassJoinStatus extends Vue {
    @MyClass.Getter
    private classID!: number;

    private isJoinDetail: boolean = false;

    private applyList: IClassMemberInfo[] = [];
    private classMemberInfo: any = [];
    private answerList: IQnaInfo[] = [];
    private waitingMemberId: number = 0;

    get applyMembers() {
        return this.applyList;
    }

    get memberInfo() {
        return this.classMemberInfo;
    }

    public created() {
        this.getApplyMembers();
    }

    /**
     * 가입 대기자 리스트 불러오기
     * @private
     */
    private getApplyMembers(): void {
        MyClassService.getClassInfoById(this.classID)
            .then((data: any) => {
                // console.log(data);
                this.applyList = data.classinfo.class_members.filter((item: IClassMemberInfo) => item.status === 0);
            });
    }

    /**
     * 멤버 정보 상세 팝업 오픈 -> 기본 정보와 질문 답변 내용 불러온다.
     * @param id
     * @private
     */
    private async openJoinDetail(id: number) {
        this.waitingMemberId = id;
        await ClassMemberService.getClassMemberInfo(this.classID, this.waitingMemberId)
          .then((data: any) => {
              this.classMemberInfo = data.member_info;
              console.log(this.classMemberInfo);
          });

        await ClassMemberService.getMemberClassQnA(this.classID, this.waitingMemberId)
          .then((data) => {
            this.answerList = data.qnalist;
          });

        this.isJoinDetail = true;
    }

    /**
     * 가입 신청 수락
     * @private
     */
    private joinAccept(): void {
        ClassMemberService.setClassMemberInfo(this.classID, this.waitingMemberId, {status: 1})
            .then((data: any) => {
               console.log(data);
            });
        this.applyList = this.applyList.filter((item: any) => item.id !== this.waitingMemberId);
        this.isJoinDetail = false;
    }

    /**
     * 클래스 가입 신청 거절 (멤버 탈퇴)
     * @private
     */
    private joinRefuse(): void {
        ClassMemberService.deleteClassMemberByUser(this.classID, this.waitingMemberId)
            .then((result: any) => {
               console.log(result);
               // const findIdx = this.applyList.findIndex((ele) => ele.id === result.user_id);
               // this.applyList.splice(findIdx, 1);
            });
        this.applyList = this.applyList.filter((item: any) => item.id !== this.waitingMemberId);
        this.isJoinDetail = false;
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