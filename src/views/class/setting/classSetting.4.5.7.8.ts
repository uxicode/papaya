import {Vue, Component} from 'vue-property-decorator';
import WithRender from './classSetting.4.5.7.8.html';
import Modal from '@/components/modal/modal.vue';

@WithRender
@Component({
    components:{
        Modal,
    }
})
export default class ClassSettingBasic extends Vue{

}