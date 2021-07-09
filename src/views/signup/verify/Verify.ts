import {Vue, Component, Watch} from 'vue-property-decorator';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';
import NoticePopup from '@/components/modal/noticePopup.vue';
import WithRender from './Verify.html';

@WithRender
@Component({
    components:{
        Btn,
        Modal,
        NoticePopup,
    },
})
export default class Verify extends Vue {

    private verifyComplete: boolean= false;
    private verifyVal: string | number = '';
    private isNoticePopupOpen: boolean = false;

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

        //https://wwwtest.papayaclass.com/api/v1/checkplus_main
        const windowOpener=window.open('https://wwwtest.papayaclass.com/api/v1/checkplus_main', '_blank', 'width=500, height=800, status=yes, toolbar=yes');

        // this.verifyComplete = true; // 인증 성공시 실행되어야 하는 부분

    }

    @Watch('verifyVal')
    private onUpdateVerify(val: string){
        console.log(val);
        if (val !== '') {
            this.isNoticePopupOpen = true;
        }
    }

    private onNoticePopupStatus(value: boolean) {
        this.isNoticePopupOpen=value;
        this.verifyComplete = true;
    }

}
