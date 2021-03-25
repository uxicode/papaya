import {Vue, Component, Prop} from 'vue-property-decorator';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import WithRender from './ClassStaffManage.html';

@WithRender
@Component({
    components: {
        Modal,
        Btn
    }
})

export default class ClassStaffManage extends Vue {

    /**
     * 뒤로가기
     * @private
     */
    private goBack(): void {
        this.$router.push('./')
            .then();
    }
}
