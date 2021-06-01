import {Vue, Component, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {CLASS_BASE_URL} from '@/api/base';
import {Utils} from '@/utils/utils';
import {IUserMe} from '@/api/model/user.model';
import {IQnaInfo, IQuestionInfo} from '@/views/model/my-class.model';
import ClassMemberService from '@/api/service/ClassMemberService';
import MyClassService from '@/api/service/MyClassService';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import MyClassListDetailView from '@/views/class/home/MyClassListDetailView';
import WithRender from './EnrollClass.html';

interface IEnrollMemberInfo {
  user_id: number;
  nickname: string;
  qna_list: Array<{ question: string, answer: string }>;
}

interface ISideMenu {
  id: number;
  title: string;
  linkKey: string;
}
const Auth = namespace('Auth');
// const MyClass = namespace('MyClass');
@WithRender
@Component({
  components: {
    Modal,
    Btn,
    MyClassListDetailView
  }
})
export default class EnrollClass extends Vue {
  @Prop(Number)
  private activeNum: number | null | undefined;

  @Auth.Getter
  private userInfo!: IUserMe;

  private classIdx: number = 0;
  private classInfo: {} = {};
  private isPrivate: boolean = false; // 클래스 비공개여부
  private isDisabled: boolean = true; // 가입 신청 버튼
  private inputNickname: string = '';
  private msg: string = '';
  private showMsg: boolean = false;
  private isError: boolean = false;
  private isApproval: boolean = false;
  private questionList!: Array<Pick<IQuestionInfo, 'question'>>;
  private answerList!: Array<Pick<IQnaInfo, 'answer'>>;
  private qnaList: any[] = [];
  private enrollMemberInfo!: IEnrollMemberInfo;

  private sideMenuData: ISideMenu[] = [
    {id: 0, title: '클래스 홈', linkKey: ''},
    {id: 1, title: '알림', linkKey: 'alert'},
    {id: 2, title: '일정', linkKey: 'schedule'},
    {id: 3, title: '파일함', linkKey: 'fileBox'},
    {id: 4, title: '교육과정', linkKey: 'curriculum'},
  ];

  /* Modal 상태 값 */
  private isClassEnrollModal: boolean = false;
  private isClassEnrollComplete: boolean = false;
  private isClassEnrollCompleteModal: boolean = false;

  get sideMenuModel(): ISideMenu[] {
    return this.sideMenuData;
  }

  public created() {
    console.log(' this.$route.params.classId=', this.$route.params.classId);
    this.classIdx = Number( this.$route.params.classId );
    this.visibleSettingMenus(0);
    this.getClassInfo();
  }

  // public updated() {
  //   this.classIdx = Number( this.$route.params.classId );
  //   this.getClassInfo();
  // }

  /**
   * 비공개 클래스는 첫번째 메뉴만 활성화
   * @param idx
   * @private
   */
  private visibleSettingMenus(idx: number): boolean {
    if (this.isPrivate) {
      return idx === 0;
    } else {
      return true;
    }
  }

  private sideMenuClickHandler(idx: number): void {
    this.$emit('sideClick', idx);

    this.$router.push({path:`${CLASS_BASE_URL}/${this.classIdx}/${this.sideMenuData[idx].linkKey}`})
      .catch((error) => {
        console.log(error);
        //에러 난 경우 새로고침
        // window.location.reload();
        Utils.getWindowReload();
      });
  }

  /**
   * 현재 클래스의 정보 가져온다.
   * @private
   */
  private getClassInfo(): void {
    MyClassService.getClassInfoById(this.classIdx)
      .then((data) => {
        this.classInfo = data.classinfo;
        this.isPrivate = data.classinfo.is_private;
        console.log('this.classInfo=', this.classInfo);
      });
  }

  /**
   * 클래스 태그를 가져와서 해시 태그로 변환
   * @param items
   * @private
   */
  private getHashTag(items: any[]): string | undefined {
    if (!items) {
      return;
    }
    // console.log(' items=',  items)
    if (items.length === 0) {
      return;
    }
    const keywords = items.map((prop) => '#' + prop.keyword);
    return keywords.join(' ');
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
  private enrollClassSubmit(): void {
    this.enrollMemberInfo = {
      user_id: this.userInfo.id,
      nickname: this.inputNickname,
      qna_list: this.qnaList,
    };
    ClassMemberService.setClassMember(this.classIdx as number, this.enrollMemberInfo)
      .then((result) => {
        console.log(result);
      });

    this.isClassEnrollModal = false;
    this.isClassEnrollComplete = true;
    this.isClassEnrollCompleteModal = true;
  }
}
