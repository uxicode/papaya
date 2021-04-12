import {IUserMe} from '@/api/model/user.model';
import MyClassService from '@/api/service/MyClassService';
import {IClassInfo, IClassMemberInfo} from '@/views/model/my-class.model';
import {Vue, Component, Prop} from 'vue-property-decorator';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import {namespace} from 'vuex-class';
import WithRender from './ClassProfile.html';

const Auth = namespace('Auth');
const MyClass = namespace('MyClass');

interface IProfileData {
    type: string;
    data: any;
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
    private classInfo: IClassInfo[] = [];

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
            isActive: false,
        },
        {
            type: '모바일 번호',
            data: 'mobile_no',
            isActive: false
        },
        {
            type: '이메일 주소',
            data: 'email',
            isActive: false
        }
    ];

    get myInfo(): object {
        return this.userInfo;
    }

    get memberInfo(): IClassMemberInfo[] {
        return this.classMemberInfo;
    }

    get info(): IClassInfo[] {
        return this.classInfo;
    }

    public created() {
        this.getClassMemberInfo();
        this.getClassInfo();
    }

    /**
     * 클래스 멤버 정보 가져오기
     * @private
     */
    private getClassMemberInfo(): void {
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
        this.$emit('input', this.tempData);
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
              });
          });
        // this.MODIFY_CLASS_MEMBER_INFO({classId: this.classID, memberId: this.memberID},
        //   {nickname: newNickname})
        //   .then(() => {
        //         console.log('닉네임 변경 완료');
        //   });
        this.isNicknameModify = false;
    }

    /**
     * 클래스 정보 가져오기
     * @private
     */
    private getClassInfo(): void {
        MyClassService.getClassInfoById(this.classID)
          .then((data) => {
              this.classInfo = data;
              console.log(this.classInfo);
          });
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