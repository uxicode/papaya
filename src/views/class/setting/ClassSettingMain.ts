import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IClassInfo, IClassMemberInfo, IQuestionInfo} from '@/views/model/my-class.model';
import MyClassService from '@/api/service/MyClassService';
import ClassMemberService from '@/api/service/ClassMemberService';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import WithRender from './ClassSettingMain.html';

const MyClass = namespace('MyClass');

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
    @MyClass.Action
    private MYCLASS_HOME!: ( id: string | number ) => Promise<any>;

    @MyClass.Action
    private GET_CLASS_MEMBER_INFO!: (payload: {classId: number, memberId: number}) => Promise<IClassMemberInfo>;

    @MyClass.Action
    private MODIFY_CLASS_MEMBER_INFO!: (payload: {classId: number, memberId: number}, data: any) => Promise<any>;

    @MyClass.Action
    private MODIFY_CLASS_QUESTION!: (payload: {classId: number, questionId: number}, text: {new_question: string}) => Promise<IQuestionInfo[]>;

    @MyClass.Getter
    private classID!: number;

    @MyClass.Getter
    private myClassHomeModel!: IClassInfo;

    private classMemberInfo!: IClassMemberInfo;
    private classInfo!: IClassInfo;

    /* Modal 오픈 상태값 */
    private isGuideTxt: boolean = false;
    private isJoinQnaSetting: boolean = false;
    private isWithdraw: boolean = false;
    private isWithdrawDenied: boolean = false;

    /* 클래스 알림 설정 */
    private onOffNoti: boolean | number = true;
    private onOffPostNoti: boolean | number = true;
    private onOffCommentNoti: boolean | number = true;
    private scheduleNotiIntime: number = 0;
    private classNotifyList: string[] = ['새 알림', '새 댓글', '일정'];
    private notiStateList: string[] = ['', '', ''];

    /* 클래스 관리 / 멤버 관리 / 기타 리스트 타이틀 및 링크 */
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
    private listGroup: any = [
        {
            tit: '클래스 관리',
            list: this.classManageList
        },
        {
            tit: '멤버 관리',
            list: this.memberManageList
        },
        {
            tit: '기타',
            list: this.etcList
        }
    ];

    /* 가입 안내 문구 관련 */
    private maxLength: number = 100;
    private remainLength: number = 100;
    private guideTxt: string = '';

    /* 가입 질문 설정 관련 */
    private isQuestionShow: boolean = true;
    private maxQuestion: number = 3; // 최대 질문 갯수
    private questionList: IQuestionInfo[] = [];
    private tempData: string = '';
    private questionId: number = 0;
    private newQuestion: string = '';

    private isChecked: boolean = false; // 클래스 탈퇴하기 체크박스

    get memberInfo(): any {
        return this.classMemberInfo;
    }

    get info(): any {
        return this.classInfo;
    }

    get myClassInfo(): any {
        return this.myClassHomeModel;
    }

    public created() {
        this.getMyClassMemberInfo();
        this.getClassInfo();
    }

    /**
     * 나의 클래스 멤버 정보를 가져오기
     * @private
     */
    private getMyClassMemberInfo(): void {
        this.GET_CLASS_MEMBER_INFO({classId: this.classID, memberId: this.myClassInfo.me.id})
          .then((data: any) => {
              this.classMemberInfo = data.member_info;

              /* 클래스 알림 설정 초기값 삽입 */
              this.onOffNoti = data.member_info.onoff_push_noti;
              this.onOffPostNoti = data.member_info.onoff_post_noti;
              this.onOffCommentNoti = data.member_info.onoff_comment_noti;
              this.scheduleNotiIntime = data.member_info.schedule_noti_intime;
              for (let i = 0; i < 3; i++) {
                  this.notiOnOffTxt(i);
              }

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
              this.isQuestionShow = data.classinfo.question_showYN;
              // console.log(this.classInfo);
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
                return 'manager';
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
     * input 을 이용해 변경할 정보를 임시로 담을 함수
     * @param event
     * @param id
     * @private
     */
    private valueChange(event: any, id: number): void {
        this.tempData = event.target.value;
        this.questionId = id;
    }

    /**
     * 푸시 알림 설정
     * @private
     * @param value
     */
    private pushToggle(value: boolean): void {
        this.onOffNoti = value;
        ClassMemberService.setClassMemberInfo(this.classID, this.myClassInfo.me.id, {onoff_push_noti: this.onOffNoti})
          .then((data) => {
              console.log(data);
              setTimeout(()=>{
                  console.log(this.onOffNoti);
              }, 250 );
          });
    }

    /**
     * 알림 설정 현재 상태 텍스트
     * @param idx
     * @private
     */
    private notiOnOffTxt(idx: number): void {
        let stateTxt: string = '';
        let value: boolean | number = 0;
        switch (idx) {
            case 0:
                value = this.onOffPostNoti;
                break;
            case 1:
                value = this.onOffCommentNoti;
                break;
            case 2:
                value = this.scheduleNotiIntime;
                break;
            default:
                break;
        }
        // 새 알림, 새 댓글
        if (idx !== 2) {
            if (value === (1 || true)) {
                stateTxt = '받기';
            } else {
                stateTxt = '받지 않기';
            }
        } else { // 일정
            switch (value) {
                case 10:
                    stateTxt = '10분 전 받기';
                    break;
                case 30:
                    stateTxt = '30분 전 받기';
                    break;
                case 60:
                    stateTxt = '1시간 전 받기';
                    break;
                case 0:
                    stateTxt = '받지 않기';
                    break;
                default:
                    stateTxt = '';
                    break;
            }
        }
        const findIdx = this.notiStateList.findIndex((item: string, index: number) => index===idx);
        this.notiStateList.splice(findIdx, 1, stateTxt);
        // this.notiStateList[idx] = stateTxt;
    }

    /**
     * 새 알림 / 새 댓글 / 일정 수신 여부 설정
     * @param idx
     * @param value
     * @private
     */
    private notiOnOff(idx: number, value: boolean | number): void {
        let info = {};
        switch (idx) {
            case 0:
                info = {onoff_post_noti: value};
                break;
            case 1:
                info = {onoff_comment_noti: value};
                break;
            case 2:
                info = (value!==0) ? {schedule_noti_intime: value, onoff_schedule_noti: 1} :
                    {schedule_noti_intime: 0, onoff_schedule_noti: 0};
                break;
            default:
                return;
        }
        ClassMemberService.setClassMemberInfo(this.classID, this.myClassInfo.me.id, info)
          .then((data) => {
            console.log(data);
            this.getMyClassMemberInfo();
          });
    }

    /**
     * 가입 안내 문구 설정 팝업 열기
     * @private
     */
    private openGuideTxtPopup(): void {
        this.guideTxt = this.info.description;
        this.isGuideTxt = true;
    }

    /**
     * 가입 안내 문구 설정 팝업 닫기
     * @private
     */
    private closeGuideTxtPopup(): void {
        this.guideTxt = this.info.description;
        this.isGuideTxt = false;
    }

    /**
     * 가입 안내 문구 수정
     * @param text
     * @private
     */
    private guideTxtModify(text: string): void {
        MyClassService.setClassInfoById(this.classID, {description: text})
          .then((data) => {
             console.log(data);
             this.info.description = data.description;
          });
        this.isGuideTxt = false;
    }

    /**
     * 가입 안내 문구 글자 수 제한 (100자)
     * @param text
     * @private
     */
    private textCount(text: string): void {
        this.remainLength = this.maxLength - this.guideTxt.length;
        this.guideTxt = (this.remainLength <= 0) ? this.guideTxt.substring(0, 100) : this.guideTxt;
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
     * @private
     * @param question
     */
    private setJoinQuestion(question: string): void {
        MyClassService.setClassInfoById(this.classID, {question_showYN: this.isQuestionShow})
          .then((msg) => {
            console.log(msg);
          });
        if (this.tempData !== '') {
            MyClassService.setClassQuestion(this.classID, this.questionId, {new_question: question})
                .then(() => {
                    console.log(`question${this.questionId} 수정 성공`);
                });
        }
        this.isJoinQnaSetting = false;
        this.tempData = '';
        this.makeJoinQuestion(this.newQuestion);
    }

    /**
     * 가입 질문 삭제
     * @param idx
     * @param questionId
     * @private
     */
    private deleteJoinQuestion(idx: number, questionId: number): void {
        MyClassService.deleteClassQuestion(this.classID, questionId)
          .then((result: any) => {
              console.log(result);
              const findIdx = this.questionList.findIndex((ele) => ele.id === result.question.id);
              this.questionList.splice(findIdx, 1);
          });
    }

    /**
     * 새 가입 질문 입력값 초기화
     * @private
     */
    private clearQuestionInput(): void {
        this.newQuestion = '';
    }

    /**
     * 가입 질문 생성
     * @param newQuestion
     * @private
     */
    private makeJoinQuestion(newQuestion: string): void {
        if (newQuestion !== '') {
            MyClassService.makeClassQuestion(this.classID, {question: newQuestion})
              .then(() => {
                  console.log(`${newQuestion} 질문 추가 성공`);
              });
        }
        this.newQuestion = '';
    }

    /**
     * 가입 질문 설정 팝업 닫기
     * @private
     */
    private closeQuestionPopup(): void {
        this.isJoinQnaSetting = false;
        this.newQuestion = '';
    }

    /**
     * 각 설정 페이지 이동
     * @param key
     * @private
     */
    private gotoLink(key: string): void {
        if ((this.myClassInfo.me.level!==1) && (key==='classAdminDelegate')) {
            alert('운영자만 접근 가능한 메뉴입니다.');
            return;
        }
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
                this.openGuideTxtPopup();
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
        const {class_members, me} = this.info;
        //console.log(class_members.length, me.level);

        // 클래스에 멤버가 있으며 나의 멤버 등급이 운영자일 경우 탈퇴 불가
        if (class_members.length >= 2 && me.level === 1) {
            this.isWithdraw = false;
            this.isWithdrawDenied = true;
        } else {
            ClassMemberService.deleteClassMemberByUser(this.classID, this.myClassInfo.me.id)
              .then(() => {
                  console.log('클래스 탈퇴 완료');
              });
            this.$router.push({path: `/class/withdrawComplete`})
              .then();
        }
    }
}
