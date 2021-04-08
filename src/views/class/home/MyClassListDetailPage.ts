import {Component, Vue} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {getAllPromise} from '@/views/model/types';
import SideMenu from '@/components/sideMenu/sideMenu.vue';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import MyClassService from '@/api/service/MyClassService';
import WithRender from './MyClassListDetailPage.html';
import {UPDATE_SIDE_MENU_NUM_ACTION} from '@/store/action-class-types';

const MyClass = namespace('MyClass');

@WithRender
@Component({
  components:{
    SideMenu,
    Modal,
    Btn
  }
})
export default class MyClassListDetailPage extends Vue {

  private activeMenuNum: number=0;


  @MyClass.Action
  private UPDATE_SIDE_MENU_NUM_ACTION!: (num: number) => void;

  get activeMenuNumModel(): number {
    return this.activeMenuNum;
  }

  @MyClass.Getter
  private classID!: string | number;

  public created(){
    //화면 새로고침시에
    if (performance.navigation.type === 1) {
      this.activeMenuNum=0;
      this.UPDATE_SIDE_MENU_NUM_ACTION(this.activeMenuNum);
    }
  }


  private update(idx: number): void{
    this.activeMenuNum=idx;
    console.log(this.activeMenuNum);
    this.UPDATE_SIDE_MENU_NUM_ACTION(this.activeMenuNum);
    // this.UPDATE_SIDE_MENU_NUM(idx);
  }

}
