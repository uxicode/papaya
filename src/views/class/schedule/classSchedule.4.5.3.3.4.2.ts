import {Vue, Component} from 'vue-property-decorator';
import WithRender from './classSchedule.4.5.3.3.4.2.html';
import Modal from '@/components/modal/modal.vue';

@WithRender
@Component({
    components:{
        Modal,
    }
})
export default class ClassSchedule extends Vue{

}