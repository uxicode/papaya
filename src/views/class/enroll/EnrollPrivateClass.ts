import MyClassService from '@/api/service/MyClassService';
import {IQuestionList} from '@/views/model/my-class.model';
import {Vue, Component} from 'vue-property-decorator';
import WithRender from './EnrollPrivateClass.html';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';

@WithRender
@Component({
    components:{
        Modal,
        Btn
    }
})
export default class EnrollPrivateClass extends Vue {

    /* 추후 동적으로 값을 받아와야 함 (MyClassService.getClassInfoById 이용) */
    private classID: number = 744;
    private isPrivate: boolean = true; // 클래스 공개여부

    private inputNickname: string = '';
    private msg: string = '';
    private showMsg: boolean = false;
    private isError: boolean = false;
    private isApproval: boolean = false;
    private questionList: IQuestionList[] = [];

    private isClassEnrollModal: boolean = false;
    private isClassEnrollComplete: boolean = false;
    private isClassSignupComplete: boolean = false;

    /**
     * 가입신청 modal 오픈 (가입 질문을 바로 가져옴)
     * @private
     */
    private openApplyClassModal(): void {
        this.isClassEnrollModal = true;

        MyClassService.getClassQuestion(this.classID)
          .then((data) => {
              console.log(data);
              this.questionList = data.questionlist;
          });
    }

    /**
     * 중복확인 버튼 클릭시 닉네임 검색 통신 후 메시지 표시
     * @param nickname
     * @private
     */
    private async checkDuplicateNickname(nickname: string) {
        this.showMsg = true;
        await MyClassService.searchNickname(this.classID, nickname)
          .then((data) => {
              console.log(data);
              this.isError = true;
              this.msg = '이미 사용중인 닉네임입니다.';
          }).catch((error) => { // 검색 결과가 없을 경우 404 error 발생
              //console.log(error);
              this.isApproval = true;
              this.msg = '사용할 수 있는 닉네임입니다.'
              return Promise.reject(error);
        });
    }

    /**
     * 닉네임과 가입 질문 답변 정보를 포함하여 가입 신청
     * @private
     */
    private enrollClassSubmit(): void {
        this.isClassEnrollModal = false;
        this.isClassEnrollComplete = true;
    }
}
