import {Vue, Component} from 'vue-property-decorator';
import WithRender from './notify.4.5.2.4.html';
import Modal from '@/components/modal/modal.vue';

@WithRender
@Component({
    components:{
        Modal,
    }
})
export default class Notify extends Vue {

}
