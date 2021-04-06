import {IUserMe} from '@/api/model/user.model';
import UserService from '@/api/service/UserService';
import {IClassMemberInfo} from '@/views/model/my-class.model';
import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import WithRender from './ClassSettingMain.html';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';

const MyClass = namespace('MyClass');

interface INotiFlag {
    onoff_push_noti?: boolean;
    onoff_post_noti?: boolean;
    onoff_comment_noti?: boolean;
    onoff_schedule_noti?: boolean;
    schedule_noti_intime?: number;
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
    private memberInfo: IClassMemberInfo[] = [];

    @MyClass.Action
    private CLASS_MEMBER_INFO_ACTION!: (payload: {classId: number, memberId: number}) => Promise<IClassMemberInfo[]>;

    @MyClass.Action
    private MODIFY_CLASS_MEMBER_INFO!: (payload: {classId: number, memberId: number}) => Promise<IClassMemberInfo[]>;

    /* Modal 오픈 상태값 */
    private isGuideTxt: boolean = false;
    private isJoinQnaSetting: boolean = false;
    private isWithdraw: boolean = false;

    private notiFlag: INotiFlag = {
        onoff_push_noti: true,
        onoff_post_noti: true,
        onoff_comment_noti: true,
        onoff_schedule_noti: true,
    };

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

    get classMemberInfo(): IClassMemberInfo[] {
        return this.memberInfo;
    }

    public created() {
        this.getClassMemberInfo({classId: 745, memberId: 826});
    }

    private getClassMemberInfo(payload: { classId: number, memberId: number }): void {
        this.CLASS_MEMBER_INFO_ACTION(payload)
          .then((data) => {
              this.memberInfo = data;
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
     * 각 설정 페이지 이동
     * @param key
     * @private
     */
    private gotoLink(key: string): void {
        this.$router.push(`${key}`)
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

        this.$router.push('../classWithdrawComplete')
            .then();
    }
}