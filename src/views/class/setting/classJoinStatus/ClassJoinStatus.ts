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
    private isJoinDetail: boolean = false;

    /**
     * 뒤로가기
     * @private
     */
    private goBack(): void {
        this.$router.push('./')
            .then();
    }
}