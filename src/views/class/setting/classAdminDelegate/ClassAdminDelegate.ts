import {Vue, Component} from 'vue-property-decorator';
import Modal from '@/components/modal/modal.vue';
import WithRender from './ClassAdminDelegate.html';

@WithRender
@Component({
    components:{
        Modal,
    }
})
export default class ClassAdminDelegate extends Vue{
    private goBack(): void {
        this.$router.push('./')
          .then();
    }
}