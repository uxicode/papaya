import ClassMemberService from '@/api/service/ClassMemberService';
import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IClassMemberInfo} from '@/views/model/my-class.model';
import MyClassService from '@/api/service/MyClassService';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';
import WithRender from './ClassStaffAdd.html';

const MyClass = namespace('MyClass');

@WithRender
@Component({
  components: {
    Btn,
    Modal,
  }
})
export default class ClassStaffAdd extends Vue {
  @MyClass.Getter
  private classID!: number;

  private memberId: number = 0;
  private classMemberList: IClassMemberInfo[] = [];
  private totalMemberNum: number = 0;
  private nickname: string = '';
  private isChangePopup: boolean = false;
  private isChangeCompletePopup: boolean = false;

  public created() {
    this.getAllClassMembers();
  }

  /**
   * 전체 일반 멤버 리스트를 가져온다.
   * @private
   */
  private getAllClassMembers(): void {
    MyClassService.getClassInfoById(this.classID)
      .then((data) => {
        // 가입 승인된 일반 멤버만 불러온다.
        this.classMemberList = data.classinfo.class_members.filter( (item: any )=> (item.status === 1 && item.level === 3) );
        // console.log(this.classMemberList);
        this.totalMemberNum = this.classMemberList.length;
      });
  }
  /**
   * 스탭 권한 설정 팝업 열기
   * @param memberId
   * @param nickname
   * @private
   */
  private changePopupOpen(memberId: number, nickname: string): void {
    this.isChangePopup = true;
    this.memberId = memberId;
    this.nickname = nickname;
  }

  /**
   * 스탭 멤버 -> 일반 멤버로 권한 수정 제출
   * @private
   */
  private submitAuthChange(): void {
    ClassMemberService.setClassMemberInfo(this.classID, this.memberId, {level: 2})
      .then((data) => {
        console.log(`${data.level} 로 수정완료`);
      });
    this.isChangeCompletePopup = true;
  }

  /**
   * 스탭 멤버 전환 완료 팝업 닫기 (권한 수정 팝업도 함께 닫는다)
   * @private
   */
  private closeChangeCompletePopup(): void {
    this.isChangeCompletePopup=false;
    this.isChangePopup = false;
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
