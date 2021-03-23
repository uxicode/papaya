import {Vue, Component} from 'vue-property-decorator';
import WithRender from './ClassAdminDelegate.html';
import Modal from '@/components/modal/modal.vue';

@WithRender
@Component({
    components:{
        Modal,
    }
})
export default class ClassAdminDelegate extends Vue{

}