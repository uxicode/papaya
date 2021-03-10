import {Vue, Component} from 'vue-property-decorator';
import WithRender from './allSchedule.5.1.html';
import Modal from '@/components/modal/modal.vue';

@WithRender
@Component({
    components:{
        Modal,
    }
})
export default class AllSchedule extends Vue{

}