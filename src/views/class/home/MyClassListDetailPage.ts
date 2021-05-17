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

  private activeMenuNum: number= 0;

  get activeMenuNumModel(): number {
    return this.activeMenuNum;
  }

  /**
   * 인덱스 갱신
   * @param idx
   * @private
   */
  private update(idx: number): void{
    this.activeMenuNum=idx;
    // console.log(this.activeMenuNum);
  }

}
