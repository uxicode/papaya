import {Component, Vue} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import SideMenu from '@/components/sideMenu/sideMenu.vue';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import WithRender from './MyClassListDetailPage.html';
import {IUserMe} from '@/api/model/user.model';

const MyClass = namespace('MyClass');
const Auth = namespace('Auth');

@WithRender
@Component({
  components:{
    SideMenu,
    Modal,
    Btn
  }
})
export default class MyClassListDetailPage extends Vue {
  @MyClass.Getter
  private classID!: string | number;

  @Auth.Getter
  private userInfo!: IUserMe;

  @MyClass.Getter
  private sideNumModel!: number;

  @MyClass.Mutation
  private UPDATE_SIDE_NUM!: (num: number)=>void;

  get activeMenuNumModel(): number {
    return this.sideNumModel;
  }
  set activeMenuNumModel( value: number) {
    this.UPDATE_SIDE_NUM(value);
  }

  public created() {
    this.activeMenuNumModel=0;
    console.log('클래스 홈 컨테이너 클래스 = ', this.activeMenuNumModel);
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
