import {Component, Vue} from 'vue-property-decorator';
import WithRender from './allNotify.5.1.html';
import Modal from '@/components/modal/modal.vue';

@WithRender
@Component({
    components:{
        Modal,
    }
})
export default class AllNotify extends Vue {

}
