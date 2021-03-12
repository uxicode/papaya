import {Vue, Component} from 'vue-property-decorator';
import WithRender from './classEducation.4.5.5.html';
import Modal from '@/components/modal/modal.vue';

@WithRender
@Component({
    components:{
        Modal,
    }
})
export default class ClassEducation extends Vue{

}