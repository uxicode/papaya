import MyClassService from '@/api/service/MyClassService';
import {IQuestionList} from '@/views/model/my-class.model';
import {Vue, Component} from 'vue-property-decorator';
import WithRender from './EnrollPrivateClass.html';
import SideMenu from '@/components/sideMenu/sideMenu.vue';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';

@WithRender
@Component({
    components:{
        SideMenu,
        Modal,
        Btn
    }
})
export default class EnrollPrivateClass extends Vue {

    /* 추후 동적으로 값을 받아와야 함 (MyClassService.getClassInfoById 이용) */
    private classID: number = 744;
    private isPrivate: boolean = true; // 클래스 공개여부

    private questionList: IQuestionList[] = [];

    private isClassApplyModal: boolean = false;
    private isClassApplyComplete: boolean = false;

    /**
     * 가입신청 modal 오픈 (가입 질문을 바로 가져옴)
     * @private
     */
    private openApplyClassModal(): void {
        this.isClassApplyModal = true;

        MyClassService.getClassQuestion(this.classID)
          .then((data) => {
              console.log(data);
              this.questionList = data.questionlist;
          });
    }

    /**
     * 닉네임과 가입 질문 답변 정보를 포함하여 가입 신청
     * @private
     */
    private enrollClassSubmit(): void {

    }
}
