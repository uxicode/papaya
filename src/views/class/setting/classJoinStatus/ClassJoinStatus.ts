import ClassMemberService from '@/api/service/ClassMemberService';
import MyClassService from '@/api/service/MyClassService';
import {IClassMemberInfo, IQnaInfo} from '@/views/model/my-class.model';
import {Vue, Component, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
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
    private isJoinDetail: boolean = false;

    private applyList: IClassMemberInfo[] = [];
    private classMemberInfo: any = [];
    private answerList: IQnaInfo[] = [];

    @MyClass.Getter
    private classID!: number;

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
        ClassMemberService.getAllClassMembers(this.classID)
          .then((data) => {
              // 가입 대기 상태인 멤버의 리스트만 나와야하지만 현재 api에서 따로 조회가 안됨.
              // this.applyList = data.class_member_list.filter(
              //   (item: IClassMemberInfo) => item.status === 0
              // );
              // 운영자를 제외한 나머지 멤버만 조회
              this.applyList = data.class_member_list.filter(
                (item: IClassMemberInfo) => item.level !== 1
              );
              console.log(this.applyList);
          });
    }

    /**
     * 멤버 정보 상세 팝업 오픈 -> 기본 정보와 질문 답변 내용 불러온다.
     * @param id
     * @private
     */
    private openJoinDetail(id: number): void {
        this.isJoinDetail = true;

        ClassMemberService.getClassMemberInfo(this.classID, id)
          .then((data) => {
              this.classMemberInfo = data;
          });

        ClassMemberService.getMemberClassQnA(this.classID, id)
          .then((data) => {
            this.answerList = data.qnalist;
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
}