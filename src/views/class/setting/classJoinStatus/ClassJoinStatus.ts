import MyClassService from '@/api/service/MyClassService';
import {IClassMemberInfo, IQnaList, IQuestionList} from '@/views/model/my-class.model';
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
    private answerList: IQnaList[] = [];

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

    private getApplyMembers(): void {
        MyClassService.getClassMembers(this.classID)
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

    private openJoinDetail(id: number): void {
        this.isJoinDetail = true;

        MyClassService.getClassMemberInfo(this.classID, id)
          .then((data) => {
              this.classMemberInfo = data;
          });

        MyClassService.getMemberClassQnA(this.classID, id)
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