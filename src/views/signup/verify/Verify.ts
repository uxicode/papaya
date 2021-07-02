import {Vue, Component} from 'vue-property-decorator';
import WithRender from './Verify.html';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';

@WithRender
@Component({
    components:{
        Btn,
        Modal,
    },
})
export default class Verify extends Vue {

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

    private verifyModalOpen(): void {

        // @ts-ignore
        // const {form_chk} = document;
        // window.open('', 'popupChk', 'width=500, height=800');
        // form_chk.action = 'https://nice.checkplus.co.kr/CheckPlusSafeModel/checkplus.cb';
        // form_chk.target = 'popupChk';
        // form_chk.submit();

        window.open('https://wwwtest.papayaclass.com/api/v1/checkplus_main', '_blank', 'width=500, height=800');

        this.verifyComplete = true; // 인증 성공시 실행되어야 하는 부분

    }
}
