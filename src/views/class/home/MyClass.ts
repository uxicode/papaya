import {Component, Vue} from 'vue-property-decorator';
import SideMenu from '@/components/sideMenu/sideMenu.vue';
import WithRender from './MyClass.html';

@WithRender
@Component({
  components:{
    SideMenu,
  }
})
export default class MyClass extends Vue {
  private activeMenuNum: number=0;

  private update(idx: number): void{
    console.log(idx);
    this.activeMenuNum=idx;
  }
}
