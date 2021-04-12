import {Vue, Component, Prop} from 'vue-property-decorator';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import WithRender from './BlockedMemberList.html';

@WithRender
@Component({
    components: {
        Modal,
        Btn
    }
})

export default class BlockedMemberList extends Vue {
    private isUnblockModal: boolean = false;
    private isUnblockCompleteModal: boolean = false;

    private goBack(): void {
        this.$router.push('./')
          .then();
    }
}