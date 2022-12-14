import ClassMemberService from '@/api/service/ClassMemberService';
import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IClassMemberInfo} from '@/views/model/my-class.model';
import MyClassService from '@/api/service/MyClassService';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import WithRender from './ClassAdminDelegate.html';

const MyClass = namespace('MyClass');

@WithRender
@Component({
    components:{
        Modal,
        Btn
    }
})
export default class ClassAdminDelegate extends Vue{
    @MyClass.Getter
    private classID!: number;

    private classMemberList: IClassMemberInfo[] = [];
    private totalMemberNum: number = 0;
    private memberId: number = 0;
    private memberInfo!: IClassMemberInfo;
    private myMemberId: number = 0;
    private nickname: string = '';
    private level: number = 0;
    private isChangePopup: boolean = false;
    private isChangeCompletePopup: boolean = false;

    public created() {
        this.getAllClassMembers();
    }

    /**
     * 운영자를 제외한 전체 멤버 리스트를 가져온다.
     * @private
     */
    private getAllClassMembers(): void {
        MyClassService.getClassInfoById(this.classID)
          .then((data) => {
              this.myMemberId = data.classinfo.me.id;
              console.log(data.classinfo);
              // 가입 승인된 스탭 멤버와 일반 멤버만 불러온다.
              this.classMemberList = data.classinfo.class_members.filter(
                (item: IClassMemberInfo) => (item.status === 1 && item.level !== 1));
              console.log(this.classMemberList);
              this.totalMemberNum = this.classMemberList.length;
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
     * 운영자 위임 신청 팝업 열기
     * @param memberId
     * @param nickname
     * @private
     */
    private changePopupOpen(memberId: number, nickname: string, level: number): void {
        this.isChangePopup = true;
        this.memberId = memberId;
        this.nickname = nickname;
        this.level = level;
    }

    /**
     * 운영자 위임 신청 제출
     * @private
     */
    private submitLevelChange(): void {
        this.isChangePopup = false;
        // 위임할 멤버의 레벨을 운영자(1)로 변경
        ClassMemberService.setClassMemberInfo(this.classID, this.memberId, {level: 1})
          .then((data) => {
              console.log(`${data.nickname} : ${data.level} 로 위임완료`);
          });
        // 나의 레벨을 스탭(2)로 변경
        ClassMemberService.setClassMemberInfo(this.classID, this.myMemberId, {level: 2})
            .then((data) => {
                console.log(`내 정보 - ${data.nickname} : ${data.level} 로 변경완료`);
            });
        // 운영자를 변경할 멤버의 정보를 객체에 담는다
        ClassMemberService.getClassMemberInfo(this.classID, this.memberId)
            .then((data: any) => {
                this.memberInfo = data.member_info;
                // 운영자 정보 변경
                MyClassService.setClassInfoById(this.classID, {owner: this.memberInfo})
                    .then((msg) => {
                        console.log(msg);
                    });
            });
        this.isChangeCompletePopup = true;
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