import {Vue, Component} from 'vue-property-decorator';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';
import WithRender from './ClassStaffAdd.html';

@WithRender
@Component({
  components: {
    Btn,
    Modal,
  }
})
export default class ClassStaffAdd extends Vue {

}