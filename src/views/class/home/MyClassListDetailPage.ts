import {Component, Vue} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import SideMenu from '@/components/sideMenu/sideMenu.vue';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import WithRender from './MyClassListDetailPage.html';

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
  @MyClass.Getter
  private classID!: string | number;

  private activeMenuNum: number=0;

  get activeMenuNumModel(): number {
    return this.activeMenuNum;
  }

  public created(){
    //화면 새로고침시에
    if (performance.navigation.type === 1) {
      this.activeMenuNum=0;
    }
  }

  private update(idx: number): void{
    this.activeMenuNum=idx;
    // console.log(this.activeMenuNum);
  }

}
