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
    private isMoreMenu: boolean = false;

    /**
     * 보관함 비우기 팝업 열기
     * @private
     */
    private resetModalOpen(): void {
        this.isResetModal = !this.isResetModal;
    }

    private moreMenuToggle(item: any): void {
        this.isMoreMenu = !this.isMoreMenu;
    }
}