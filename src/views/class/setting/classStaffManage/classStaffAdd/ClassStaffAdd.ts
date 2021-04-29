import MyClassService from '@/api/service/MyClassService';
import {IClassMembers} from '@/views/model/my-class.model';
import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
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

  private classMemberList: IClassMembers[] = [];
  private totalMemberNum: number = 0;

  public created() {
    this.getClassMembers();
  }

  /**
   * 전체 일반 멤버 리스트를 가져온다.
   * @private
   */
  private getClassMembers(): void {
    MyClassService.getClassInfoById(this.classID)
      .then((data) => {
        // 가입 승인된 일반 멤버만 불러온다.
        this.classMemberList = data.classinfo.class_members.filter( (item: any )=> (item.status === 1 && item.level === 3) );

        // this.classMemberList = data.classinfo.class_members.filter( (item: IClassMembers) => item.status === 1).filter( (item: IClassMembers) => item.level === 3);
        // console.log('this.classMemberList=', this.classMemberList);

        this.totalMemberNum = this.classMemberList.length;
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
