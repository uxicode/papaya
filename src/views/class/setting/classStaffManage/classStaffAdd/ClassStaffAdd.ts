import {Vue, Component} from 'vue-property-decorator';
import WithRender from './ClassStaffAdd.html';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';

@WithRender
@Component({
  components: {
    Btn,
    Modal,
  }
})
export default class ClassStaffAdd extends Vue {

}