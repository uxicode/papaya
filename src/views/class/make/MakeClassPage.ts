import {Vue, Component} from 'vue-property-decorator';
import Modal from '@/components/modal/modal.vue';
import WithRender from './MakeClassPage.html';

@WithRender
@Component({
  components:{
    Modal,
  }
})
export default class MakeClassPage extends Vue{

  private currentStep: number=1;
  private stepTotal: number=3;

  private updateCount( count: number ) {
    this.currentStep= count;
  }
}

