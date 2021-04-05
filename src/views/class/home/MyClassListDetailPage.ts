import {Component, Vue} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {getAllPromise} from '@/views/model/types';
import SideMenu from '@/components/sideMenu/sideMenu.vue';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import MyClassService from '@/api/service/MyClassService';
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

  private activeMenuNum: number=0;


  @MyClass.Getter
  private classID!: string | number;


  private update(idx: number): void{
    // console.log(idx);
    this.activeMenuNum=idx;
  }

}
