import {Vue, Component, Prop} from 'vue-property-decorator';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';
import WithRender from './ClassTagManage.html';

@WithRender
@Component({
    components: {
        Btn,
        Modal
    }
})

export default class ClassTagManage extends Vue {

}