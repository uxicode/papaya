import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IUserMe} from '@/api/model/user.model';
import {IClassInfo, IClassMemberInfo} from '@/views/model/my-class.model';
import ClassMemberService from '@/api/service/ClassMemberService';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import WithRender from './ClassProfile.html';

const Auth = namespace('Auth');
const MyClass = namespace('MyClass');

interface IProfileData {
    type: string;
    data: any;
    open: any;
}

@WithRender
@Component({
    components: {
        Modal,
        Btn
    }
})

export default class ClassProfile extends Vue {
    private classMemberInfo: IClassMemberInfo[] = [];

    private tempData: any = '';
    private msg: string = '';
    private isError: boolean = false;
    private isApproval: boolean = false;

    @Auth.Getter
    private userInfo!: IUserMe;

    @MyClass.Getter
    private classID!: number;

    @MyClass.Getter
    private myClassHomeModel!: IClassInfo;

    @MyClass.Action
    private CLASS_MEMBER_INFO_ACTION!: (payload: {classId: number, memberId: number}) => Promise<IClassMemberInfo[]>;

    @MyClass.Action
    private MODIFY_CLASS_MEMBER_INFO!: (payload: {classId: number, memberId: number}, data: any) => Promise<IClassMemberInfo[]>;

    private isNicknameModify: boolean = false;

    private profileDataList: IProfileData[] = [
        {
            type: '아이디',
            data: 'user_id',
            open: 'open_level_id',
        },
        {
            type: '모바일 번호',
            data: 'mobile_no',
            open: 'open_level_mobileno',
        },
        {
            type: '이메일 주소',
            data: 'email',
            open: 'open_level_email',
        }
    ];

    get myInfo(): IUserMe {
        return this.userInfo;
    }

    get memberInfo(): any {
        return this.classMemberInfo;
    }

    get myClassInfo(): any {
        return this.myClassHomeModel;
    }

    public created() {
        this.getClassMemberInfo();
    }

    /**
     * 클래스 멤버 정보 가져오기
     * @private
     */
    private getClassMemberInfo(): void {
        this.CLASS_MEMBER_INFO_ACTION({classId: this.classID, memberId: this.myClassInfo.me.id})
          .then((data: any) => {
              console.log(`classId = ${this.classID}, memberId = ${this.myClassInfo.me.id}`);
              this.classMemberInfo = data.member_info;
          });
    }

    /**
     * 중복확인 버튼 클릭시 해당 닉네임 존재여부 확인 후 메시지 표시
     * @param nickname
     * @private
     */
    private checkDuplicateNickname(nickname: string): void {
        this.showMessage();
        ClassMemberService.searchNickname(this.classID, nickname)
          .then((data) => {
              console.log(data);
              this.isApproval = false;
              this.isError = true;
              this.msg = '이미 사용중인 닉네임입니다.';
          }).catch((error) => { // 검색 결과가 없을 경우 404 error 발생하므로 예외처리
            console.log(error);
            this.isError = false;
            this.isApproval = true;
            this.msg = '사용할 수 있는 닉네임입니다.';
        });
    }

    /**
     * 중복확인 버튼 클릭시 안내메시지 노출 여부
     * @private
     */
    private showMessage(): boolean {
        if (this.tempData !== this.memberInfo.nickname) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 리스트 팝업 토글
     * @param idx
     * @private
     */
    private listPopupToggle(idx: number): void {
        const listPopup = document.querySelectorAll('.basic-info .list-popup-menu');
        // listPopup.forEach((item) => item.classList.remove('active'));
        listPopup[idx].classList.toggle('active');
    }

    /**
     * 토글 메뉴 바깥 영역 클릭시 메뉴 닫기
     * @private
     */
    private closeToggle(): void {
        const listPopup = document.querySelectorAll('.list-popup-menu');
        listPopup.forEach((item) => item.classList.remove('active'));
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
     * 닉네임 변경 팝업 열기
     * @private
     */
    private openNicknameModal(prevNickname: string): void {
        this.isNicknameModify = true;
        this.tempData = prevNickname;
    }

    /**
     * 닉네임 변경 팝업 닫기
     * @private
     */
    private closeNicknameModal(): void {
        this.isNicknameModify = false;
        this.tempData = '';
    }

    /**
     * 클래스 닉네임 변경
     * @param newNickname
     * @private
     */
    private modifyNickname(newNickname: string): void {
        ClassMemberService.setClassMemberInfo(this.classID, this.myClassInfo.me.id, {nickname: newNickname})
          .then(() => {
              this.CLASS_MEMBER_INFO_ACTION({classId: this.classID, memberId: this.myClassInfo.me.id}).then(() => {
                  console.log('닉네임 변경 완료');
                  this.tempData = '';
              });
          });
        this.isNicknameModify = false;
    }

    /**
     * 정보 공개 여부 수정
     * @param data
     * @param level
     * @private
     */
    private openLevelModify(data: string, level: number): void {
        switch (data) {
            case 'open_level_id':
                ClassMemberService.setClassMemberInfo(this.classID, this.myClassInfo.me.id, {open_level_id: level})
                  .then(() => {
                    console.log('아이디 공개 여부 수정');
                  });
                break;
            case 'open_level_mobileno':
                ClassMemberService.setClassMemberInfo(this.classID, this.myClassInfo.me.id, {open_level_mobileno: level})
                  .then(() => {
                      console.log('모바일 공개 여부 수정');
                  });
                break;
            case 'open_level_email':
                ClassMemberService.setClassMemberInfo(this.classID, this.myClassInfo.me.id, {open_level_email: level})
                  .then(() => {
                      console.log('이메일 공개 여부 수정');
                  });
                break;
            default:
                return;
        }
        this.closeToggle();
    }

    /**
     * 정보 공개 여부 텍스트 바인딩
     * @param level
     * @private
     */
    private openLevelTxt(level: number): string {
        switch (level) {
            case 0:
                return '비공개';
            case 1:
                return '전체 공개';
            case 2:
                return '운영자에게만 공개';
            default:
                return '';
        }
    }

    /**
     * 뒤로가기
     * @private
     */
    private goBack(): void {
        this.$router.push('./')
            .then();
    }
}