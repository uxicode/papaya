import {Vue, Component} from 'vue-property-decorator';
import WithRender from './classMember.4.5.6.html';
import Modal from '@/components/modal/modal.vue';

@WithRender
@Component({
    components:{
        Modal,
    }
})
export default class ClassMember extends Vue{

}