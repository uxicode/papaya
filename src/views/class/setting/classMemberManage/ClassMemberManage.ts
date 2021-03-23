import {Vue, Component} from 'vue-property-decorator';
import WithRender from './ClassMemberManage.html';
import Modal from '@/components/modal/modal.vue';

@WithRender
@Component({
    components:{
        Modal,
    }
})
export default class ClassMemberManage extends Vue{

}