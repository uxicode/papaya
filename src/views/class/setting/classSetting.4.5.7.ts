import {Vue, Component} from 'vue-property-decorator';
import WithRender from './classSetting.4.5.7.html';
import Modal from '@/components/modal/modal.vue';

@WithRender
@Component({
    components:{
        Modal,
    }
})
export default class ClassSetting extends Vue{

}