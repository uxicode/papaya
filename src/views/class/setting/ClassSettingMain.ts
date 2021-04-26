import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IClassInfo, IClassMemberInfo, INotifyList, IQuestionList} from '@/views/model/my-class.model';
import MyClassService from '@/api/service/MyClassService';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import WithRender from './ClassSettingMain.html';

const MyClass = namespace('MyClass');

interface INotiMenu {
    title: string;
    active: boolean;
}

interface ISettingMenu {
    title: string;
    type: string;
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
    private myClassHomeModel!: IClassInfo;

    @MyClass.Action
    private CLASS_MEMBER_INFO_ACTION!: (payload: {classId: number, memberId: number}) => Promise<IClassMemberInfo[]>;

    @MyClass.Action
    private MODIFY_CLASS_MEMBER_INFO!: (payload: {classId: number, memberId: number}, data: any) => Promise<IClassMemberInfo[]>;

    @MyClass.Action
    private MODIFY_CLASS_QUESTION!: (payload: {classId: number, questionId: number}, text: {new_question: string}) => Promise<IQuestionList[]>;

    /* Modal 오픈 상태값 */
    private isGuideTxt: boolean = false;
    private isJoinQnaSetting: boolean = false;
    private isWithdraw: boolean = false;

    private onOffNoti: boolean = true;

    private classNotifyList: INotiMenu[] = [
        {
            title: '새 알림',
            active: false
        },
        {
            title: '새 댓글',
            active: false
        },
        {
            title: '일정',
            active: false
        },
    ];

    /* 클래스 관리 / 멤버 관리 / 기타 텍스트 및 링크 */
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

    /* 가입 질문 설정 관련 */
    private questionList: IQuestionList[] = [];
    private tempData: string = '';
    private questionId: number = 0;

    get memberInfo(): IClassMemberInfo[] {
        return this.classMemberInfo;
    }

    get info(): IClassInfo[] {
        return this.classInfo;
    }

    get myClassInfo(): any {
        return this.myClassHomeModel;
    }

    public created() {
        this.getMyClassMemberInfo();
        this.getClassInfo();
        // this.getJoinQuestion();
    }

    /**
     * 나의 클래스 멤버 정보를 가져오기
     * @private
     */
    private getMyClassMemberInfo(): void {
        this.CLASS_MEMBER_INFO_ACTION({classId: this.classID, memberId: this.myClassInfo.me.id})
          .then((data) => {
              this.classMemberInfo = data;
              console.log(this.classMemberInfo);
          });
    }

    /**
     * 클래스 정보 가져오기
     * @private
     */
    private getClassInfo(): void {
        MyClassService.getClassInfoById(this.classID)
          .then((data) => {
              this.classInfo = data.classinfo;
              console.log(this.classInfo);
          });
    }

    /**
     * 멤버 등급에 따른 아이콘 클래스 바인딩
     * @param level
     * @private
     */
    private memberLevelIcon(level: number): string {
        switch (level) {
            case 1:
                return 'admin';
            case 2:
                return 'staff';
            default:
                return 'member';
        }
    }

    /**
     * 멤버 등급 텍스트
     * @param level
     * @private
     */
    private memberLevelTxt(level: number): string {
        switch (level) {
            case 1:
                return '운영자';
            case 2:
                return '스탭 멤버';
            default:
                return '일반 멤버';
        }
    }

    /**
     * input을 이용해 변경할 정보를 임시로 담을 함수
     * @param event
     * @private
     */
    private valueChange(event: any, id: number): void {
        this.tempData = event.target.value;
        this.questionId = id;
    }

    /**
     * 푸시 알림 설정
     * @param item
     * @private
     */
    private pushToggle(value: boolean): void {
        this.onOffNoti = !!value;
        MyClassService.setClassMemberInfo(this.classID, this.myClassInfo.me.id, {onoff_push_noti: this.onOffNoti})
          .then(() => {
              setTimeout(()=>{
                  console.log(this.onOffNoti);
              }, 250 );
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
    private getJoinQuestion(): void {
        console.log('classID=', this.classID);
        MyClassService.getClassQuestion(this.classID)
          .then((data) => {
              this.questionList = data.questionlist;
              console.log(this.questionList);
          });
    }

    /**
     * 클래스 가입 질문 수정
     * @param id
     * @param newQuestion
     * @private
     */
    private setJoinQuestion(newQuestion: string): void {
        MyClassService.setClassQuestion(this.classID, this.questionId, {new_question: newQuestion})
          .then(() => {
            console.log(`question${this.questionId} 수정 성공`);
          });
        this.isJoinQnaSetting = false;
        this.tempData = '';
    }

    /**
     * 가입 질문 삭제
     * @param questionId
     * @private
     */
    private deleteJoinQuestion(questionId: number): void {
        MyClassService.deleteClassQuestion(this.classID, questionId)
          .then(() => {
              console.log('가입 질문 삭제 성공');
          });
    }

    /**
     * 가입 질문 생성
     * @param question
     * @private
     */
    private makeJoinQuestion(text: string): void {
        MyClassService.makeClassQuestion(this.classID, {question: text})
          .then(() => {
            console.log(`${text} 질문 추가 성공`);
          });
    }

    /**
     * 각 설정 페이지 이동
     * @param key
     * @private
     */
    private gotoLink(key: string): void {
        console.log('key=', key, 'classID=', this.classID);
        this.$router.push(`/class/${this.classID}/setting/${key}`)
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
                this.getJoinQuestion();
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
        MyClassService.withdrawClass(this.classID, this.myClassInfo.me.id)
          .then(() => {
             console.log('클래스 탈퇴 완료');
          });
        this.$router.push('../classWithdrawComplete')
          .then();
    }
}