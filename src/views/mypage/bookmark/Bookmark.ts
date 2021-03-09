import {Vue, Component, Prop} from 'vue-property-decorator';
import WithRender from './Bookmark.html';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';

@WithRender
@Component({
    components:{
        Btn,
        Modal,
    },
})

export default class Bookmark extends Vue {
    private isResetModal: boolean = false;
    private bookmarkType: string = 'notification';

    private resetModalOpen(): void {
        this.isResetModal = !this.isResetModal;
    }
}