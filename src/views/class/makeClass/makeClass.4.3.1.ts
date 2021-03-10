import {Vue, Component} from 'vue-property-decorator';
import WithRender from './makeClass.4.3.1.html';
import Modal from '@/components/modal/modal.vue';

@WithRender
@Component({
  components:{
    Modal,
  }
})
export default class MakeClass extends Vue{

}

