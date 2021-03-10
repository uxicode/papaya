import {Vue, Component, Prop} from 'vue-property-decorator';
import WithRender from './Verify.html';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';
import VerifyComplete from '@/views/signup/verify/verifyComplete/VerifyComplete';

@WithRender
@Component({
    components:{
        Complete: VerifyComplete,
        Btn,
        Modal,
    },
})
export default class Verify extends Vue {

    private isVerifyModal: boolean = false;
    private verifyComplete: boolean= false;

    get isVerifyComplete(){
        return this.verifyComplete;
    }

    private historyBack(): void{
        this.$router.push('/signForm');
        this.$emit('updateStep', 1);
    }

    private gotoNext(): void{
        this.$router.push('signUpForm');
        this.$emit('updateStep', 3);
    }

    private verifyModalOpen() {
        this.isVerifyModal = !this.isVerifyModal;
    }
}
