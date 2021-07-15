import {Vue, Component, Watch} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';
import NoticePopup from '@/components/modal/noticePopup.vue';
import WithRender from './Verify.html';

const Auth = namespace('Auth');

@WithRender
@Component({
    components:{
        Btn,
        Modal,
        NoticePopup,
    },
})
export default class Verify extends Vue {

    @Auth.Getter
    private pageTitle!: string;

    private verifyComplete: boolean= false;
    private verifyVal: string | number = '';
    private isNoticePopupOpen: boolean = false;
    private under14: boolean = false;
    private isAgreed: boolean = false;
    private isVerifyFail: boolean = false;

    get isVerifyComplete(){
        return this.verifyComplete;
    }

    get isUnder14() {
        this.under14 = this.pageTitle !== '일반 회원가입';
        return this.under14;
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

        // 업로드시 url - https://wwwtest.papayaclass.com/api/v1/checkplus_main
        // 로컬테스트용 url - ../testOpen.html
        const windowOpener=window.open('https://wwwtest.papayaclass.com/api/v1/checkplus_main', '_blank', 'width=500, height=800, status=yes, toolbar=yes');

    }

    private onUpdateVerify(val: string){
        console.log(val); // mobileNum+'_'+age
        const age = Number(val.split('_')[1]);
        if ( age >= 14 ){
            this.isNoticePopupOpen = true;
        } else {
            this.isVerifyFail = true;
        }
    }

    private onNoticePopupStatus(value: boolean) {
        this.isNoticePopupOpen=value;
        this.verifyComplete = true;
    }

    private gotoSignUpPage() {
        this.$router.push('/signup');
    }

}
