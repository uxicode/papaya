import {Vue, Component, Prop} from 'vue-property-decorator';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';
import WithRender from './ClassJoinStatus.html';

@WithRender
@Component({
    components: {
        Btn,
        Modal
    }
})

export default class ClassJoinStatus extends Vue {

}