import {IUserMe} from '@/api/model/user.model';
import MyClassService from '@/api/service/MyClassService';
import {IClassMemberInfo} from '@/views/model/my-class.model';
import {Vue, Component, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import WithRender from './ClassProfile.html';

const Auth = namespace('Auth');
const MyClass = namespace('MyClass');

interface IProfileData {
    type: string;
    data: any;
    open: any;
    isActive: boolean;
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

    @Auth.Getter
    private userInfo!: IUserMe;

    @MyClass.Getter
    private classID!: number;

    @MyClass.Getter
    private memberID!: number;

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
            isActive: false,
        },
        {
            type: '모바일 번호',
            data: 'mobile_no',
            open: 'open_level_mobileno',
            isActive: false
        },
        {
            type: '이메일 주소',
            data: 'email',
            open: 'open_level_email',
            isActive: false
        }
    ];

    get myInfo(): IUserMe {
        return this.userInfo;
    }

    get memberInfo(): IClassMemberInfo[] {
        return this.classMemberInfo;
    }

    public created() {
        this.getClassMemberInfo();
    }

    /**
     * 클래스 멤버 정보 가져오기
     * @private
     */
    private getClassMemberInfo(): void {
        console.log(`classId = ${this.classID}, memberId = ${this.memberID}`);

        this.CLASS_MEMBER_INFO_ACTION({classId: this.classID, memberId: this.memberID})
          .then((data) => {
              console.log(`classId = ${this.classID}, memberId = ${this.memberID}`);
              this.classMemberInfo = data;
          });
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
     * 클래스 닉네임 변경
     * @param newNickname
     * @private
     */
    private modifyNickname(newNickname: string): void {
        MyClassService.setClassMemberInfo(this.classID, this.memberID, {nickname: newNickname})
          .then(() => {
              this.CLASS_MEMBER_INFO_ACTION({classId: this.classID, memberId: this.memberID}).then(() => {
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
                MyClassService.setClassMemberInfo(this.classID, this.memberID, {open_level_id: level})
                  .then(() => {
                    console.log('아이디 공개 여부 수정');
                  });
                break;
            case 'open_level_mobileno':
                MyClassService.setClassMemberInfo(this.classID, this.memberID, {open_level_mobileno: level})
                  .then(() => {
                      console.log('모바일 공개 여부 수정');
                  });
                break;
            case 'open_level_email':
                MyClassService.setClassMemberInfo(this.classID, this.memberID, {open_level_email: level})
                  .then(() => {
                      console.log('이메일 공개 여부 수정');
                  });
                break;
            default:
                return;
        }
    }

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
