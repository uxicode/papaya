import {Vue, Component} from 'vue-property-decorator';
import WithRender from './apply.4.4.2.html';
import Modal from '@/components/modal/modal.vue';

@WithRender
@Component({
    components:{
        Modal,
    }
})
export default class Apply extends Vue {

}
