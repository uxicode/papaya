import MyClassService from '@/api/service/MyClassService';
import {IClassInfo, IClassMemberInfo, IMyClassList} from '@/views/model/my-class.model';
import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import WithRender from './ClassSettingMain.html';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';

const MyClass = namespace('MyClass');

interface ISettingMenu {
    title: string;
    type: string;
}

interface IQuestionList {
    createdAt?: Date;
    id: number;
    class_id: number;
    question: string;
}

@WithRender
@Component({
    components:{
        Modal,
        Btn
    }
})
export default class ClassSettingMain extends Vue{
    private classMemberInfo: IClassMemberInfo[] = [];
    private classInfo: IClassInfo[] = [];

    @MyClass.Getter
    private classID!: number;

    @MyClass.Getter
    private memberID!: number;

    @MyClass.Action
    private CLASS_MEMBER_INFO_ACTION!: (payload: {classId: number, memberId: number}) => Promise<IClassMemberInfo[]>;

    @MyClass.Action
    private MODIFY_CLASS_MEMBER_INFO!: (payload: {classId: number, memberId: number}, data: any) => Promise<IClassMemberInfo[]>;

    /* Modal 오픈 상태값 */
    private isGuideTxt: boolean = false;
    private isJoinQnaSetting: boolean = false;
    private isWithdraw: boolean = false;

    private onOffNoti: boolean = true;

    private classNotifyList: object[] = [
        {
            listTit: '새 알림',
            isActive: false
        },
        {
            listTit: '새 댓글',
            isActive: false
        },
        {
            listTit: '일정',
            isActive: false
        },
    ];

    private classManageList: ISettingMenu[] = [
        {
            title: '클래스 기본 정보 관리',
            type: 'classBasicInfo'
        },
        {
            title: '클래스 태그 관리',
            type: 'classTagManage'
        },
        {
            title: '가입 안내 문구 설정',
            type: 'guideTxtModal'
        },
        {
            title: '가입 질문 설정',
            type: 'joinQnaSettingModal'
        },
        {
            title: '가입 현황 관리',
            type: 'classJoinStatus'
        }
    ];
    private memberManageList: ISettingMenu[] = [
        {
            title: '멤버 활동 관리',
            type: 'classMemberManage'
        },
        {
            title: '스탭 관리',
            type: 'classStaffManage'
        }
    ];
    private etcList: ISettingMenu[] = [
        {
            title: '운영자 위임 신청',
            type: 'classAdminDelegate'
        },
        {
            title: '클래스 탈퇴하기',
            type: 'withdrawModal'
        }
    ];

    /* 가입 안내 문구 관련 */
    private maxLength: number = 100;
    private remainLength: number = 100;
    private guideTxt: string = '';

    private questionList: IQuestionList[] = [];
    private questionId: number = 0;
    private tempData: string = '';

    get memberInfo(): IClassMemberInfo[] {
        return this.classMemberInfo;
    }

    get info(): IClassInfo[] {
        return this.classInfo;
    }

    public created() {
        this.getClassMemberInfo();
        this.getClassInfo();
        this.getClassJoinQuestion();
    }

    private getClassMemberInfo(): void {
        this.CLASS_MEMBER_INFO_ACTION({classId: this.classID, memberId: this.memberID})
          .then((data) => {
              console.log(`classId = ${this.classID}, memberId = ${this.memberID}`);
              this.classMemberInfo = data;
          });
    }

    private getClassInfo(): void {
        MyClassService.getClassInfoById(this.classID)
          .then((data) => {
              this.classInfo = data;
              console.log(this.classInfo);
          });
    }

    private memberLevel(level: number): string {
        switch (level) {
            case 1:
                return '운영자';
            case 2:
                return '스태프';
            default:
                return '일반';
        }
    }

    /**
     * 변경할 정보를 임시로 담을 함수
     * @param event
     * @private
     */
    private valueChange(event: any): void {
        this.tempData = event.target.value;
    }

    /**
     * 푸시 알림 설정
     * @param item
     * @private
     */
    private pushToggle(): void {
        this.onOffNoti = !this.onOffNoti;
        this.MODIFY_CLASS_MEMBER_INFO({classId: this.classID, memberId: this.memberID},
          {onoff_push_noti: this.onOffNoti})
          .then(() => {
              console.log(`onoff_push_noti = ${this.onOffNoti}`);
          });
    }

    /**
     * 가입 안내 문구 수정
     * @param text
     * @private
     */
    private guideTxtModify(text: string): void {
        MyClassService.setClassInfoById(this.classID, {description: text})
          .then(() => {
             console.log('가입 안내 문구 수정 완료');
             this.isGuideTxt = false;
          });
    }

    /**
     * 가입 안내 문구 글자 수 제한
     * @param text
     * @private
     */
    private textCount(text: string): void {
        this.guideTxt = text;
        this.remainLength = this.maxLength - this.guideTxt.length;
        this.guideTxt = (this.remainLength < 0) ? this.guideTxt.substring(0, 100) : this.guideTxt;
        this.remainLength = (this.remainLength < 0) ? 0 : this.remainLength;
    }

    /**
     * 클래스 가입 질문 가져오기
     * @private
     */
    private getClassJoinQuestion(): void {
        MyClassService.getClassQuestion(this.classID)
          .then((data) => {
              this.questionList = data.questionlist;
              console.log(this.questionList);
          });
    }

    private setClassJoinQuestion(id: number, newQuestion: any): void {
        MyClassService.setClassQuestion(this.classID, id, {new_question: newQuestion})
          .then(() => {
            console.log('가입 질문 수정 성공');
          });
        this.isJoinQnaSetting = false;
        this.tempData = '';
    }

    /**
     * 각 설정 페이지 이동
     * @param key
     * @private
     */
    private gotoLink(key: string): void {
        this.$router.push(`setting/${key}`)
          .then(() => {
              console.log(`${key}로 이동`);
          });
    }

    /**
     * 설정 Modal 열기
     * @param key
     * @private
     */
    private openModal(key: string): void {
        switch(key) {
            case 'guideTxtModal':
                this.isGuideTxt = true;
                break;
            case 'joinQnaSettingModal':
                this.isJoinQnaSetting = true;
                break;
            case 'withdrawModal':
                this.isWithdraw = true;
                break;
        }
    }

    /**
     * 클래스 탈퇴 완료
     * @private
     */
    private withdrawSubmit(): void {
        MyClassService.withdrawClass(this.classID, this.memberID)
          .then(() => {
             console.log('클래스 탈퇴 완료');
          });
        this.$router.push('../classWithdrawComplete')
          .then();
    }
}