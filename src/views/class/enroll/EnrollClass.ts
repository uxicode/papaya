import {Vue, Component, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IUserMe} from '@/api/model/user.model';
import ClassMemberService from '@/api/service/ClassMemberService';
import MyClassService from '@/api/service/MyClassService';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import SideMenu from '@/components/sideMenu/sideMenu.vue';
import MyClassListDetailView from '@/views/class/home/MyClassListDetailView';
import WithRender from './EnrollClass.html';

interface IEnrollMemberInfo {
  user_id: number;
  nickname: string;
}

interface ISideMenu {
  id: number;
  title: string;
  linkKey: string;
}
const Auth = namespace('Auth');
const MyClass = namespace('MyClass');

@WithRender
@Component({
  components: {
    Modal,
    Btn,
    SideMenu,
    MyClassListDetailView,
  }
})
export default class EnrollClass extends Vue {
  @Prop(Number)
  private activeNum: number | null | undefined;

  @MyClass.Mutation
  private UPDATE_SIDE_NUM!: (num: number)=>void;

  @MyClass.Action
  private MYCLASS_HOME!: ( id: string | number )=> Promise<any>;

  @Auth.Getter
  private userInfo!: IUserMe;

  @MyClass.Getter
  private classID!: string | number;

  @MyClass.Getter
  private sideNumModel!: number;

  get activeMenuNumModel(): number {
    return this.sideNumModel;
  }
  set activeMenuNumModel( value: number) {
    this.UPDATE_SIDE_NUM(value);
  }

  private classIdx: number = 0;
  private classInfo: {} = {};
  private isPrivate: boolean = false; // 클래스 비공개여부
  private isDisabled: boolean = true; // 가입 신청 버튼
  private inputNickname: string = '';
  private msg: string = '';
  private showMsg: boolean = false;
  private isError: boolean = false;
  private isApproval: boolean = false;
  private questionList!: any[];
  private answerList!: any[];
  private qnaList: any[] = [];
  private enrollMemberInfo!: IEnrollMemberInfo;
  private memberId: number = 0;

  /* Modal 상태 값 */
  private isClassEnrollModal: boolean = false;
  private isClassEnrollComplete: boolean = false;
  private isClassEnrollCompleteModal: boolean = false;


  public created() {
    this.activeMenuNumModel=0;
    console.log('enroll class this.$route.params.classIdx= ', this.$route.query.classIdx );
    this.classIdx = Number( this.$route.query.classIdx );
    this.getClassInfo();
  }

  /**
   * 현재 클래스의 정보 가져온다.
   * @private
   */
  private getClassInfo(): void {

    this.MYCLASS_HOME( this.classIdx )
      .then( (data) =>{
        this.classInfo = data;
        this.isPrivate = data.is_private;
        console.log('enroll classInfo=', data, this.classInfo, this.classID );
      });
    /*
    MyClassService.getClassInfoById(this.classIdx)
      .then((data) => {
        this.classInfo = data.classinfo;
        this.isPrivate = data.classinfo.is_private;
        console.log('this.classInfo=', this.classInfo);
      });*/
  }

  /**
   * 가입신청 modal 오픈 (가입 질문을 바로 가져옴)
   * @private
   */
  private openEnrollClassModal(): void {
    this.isClassEnrollModal = true;
    MyClassService.getClassQuestion(this.classIdx as number)
      .then((data) => {
        console.log(data);
        this.questionList = (data.questionlist.length > 0) ? data.questionlist : [];
        this.qnaList = Object.assign({} ,this.questionList, this.answerList);
        console.log(this.qnaList);
      });
  }

  /**
   * 중복확인 버튼 클릭시 해당 닉네임 존재여부 확인 후 메시지 표시
   * @param nickname
   * @private
   */
  private checkDuplicateNickname(nickname: string): void {
    this.showMsg = true;
    ClassMemberService.searchNickname(this.classIdx as number, nickname)
      .then((data) => {
        console.log(data);
        this.isApproval = false;
        this.isError = true;
        this.msg = '이미 사용중인 닉네임입니다.';
      }).catch((error) => { // 검색 결과가 없을 경우 404 error 발생하므로 예외처리
          console.log(error);
          this.isError = false;
          this.isApproval = true;
          this.msg = '사용할 수 있는 닉네임입니다.';
          this.isDisabled = false;
      });
  }

  /**
   * 닉네임과 가입 질문 답변 정보를 포함하여 가입 신청
   * @private
   */
  private async enrollClassSubmit() {
    this.enrollMemberInfo = {
      user_id: this.userInfo.id,
      nickname: this.inputNickname,
    };
    await ClassMemberService.setClassMember(Number(this.classIdx), this.enrollMemberInfo)
      .then((result) => {
        console.log(result);
        this.memberId = result.member_info.id;
      });

    if (this.questionList.length>0) {
      for (let i=0; i<this.questionList.length; i++) {
        const qna = {question: this.qnaList[i].question, answer: this.qnaList[i].answer};
        await ClassMemberService.setClassMemberAnswer(Number(this.classIdx), this.memberId, qna)
          .then(() => {
            console.log(`${i}번째 질문답변 추가 ${qna}`);
          });
      }
    }

    this.isClassEnrollModal = false;
    this.isClassEnrollComplete = true;
    this.isClassEnrollCompleteModal = true;
  }

  /**
   * 인덱스 갱신
   * @param idx
   * @private
   */
  private update(idx: number): void{
    this.activeMenuNumModel=idx;
    // console.log(this.activeMenuNum);
  }
}
