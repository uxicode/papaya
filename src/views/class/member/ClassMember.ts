import MyClassService from '@/api/service/MyClassService';
import {IClassInfo, IClassMembers} from '@/views/model/my-class.model';
import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import Modal from '@/components/modal/modal.vue';
import WithRender from './ClassMember.html';

const MyClass = namespace('MyClass');

@WithRender
@Component({
    components:{
        Modal,
    }
})
export default class ClassMember extends Vue{
    @MyClass.Getter
    private classID!: number;

    @MyClass.Getter
    private memberID!: number;

    /* 운영자/스탭/일반 멤버 토글 상태값 */
    private isAdminToggle: boolean = false;
    private isStaffToggle: boolean = false;
    private isMemberToggle: boolean = false;

    private isDetailPopup: boolean = false;
    private isBlockModal: boolean = false;
    private isBanModal: boolean = false;

    private memberLevel: number = 0;
    private totalMemberNum: number = 0;

    private classMembers: IClassMembers[] = [];
    private adminList: IClassMembers[] = [];
    private staffList: IClassMembers[] = [];
    private memberList: IClassMembers[] = [];


    public created() {
        this.getClassMembers();
        this.getClassMemberLevel();
    }

    /**
     * 전체 멤버 리스트를 가져와서 등급별로 나눈다.
     * @private
     */
    private getClassMembers(): void {
        MyClassService.getClassInfoById(this.classID)
          .then((data) => {
              this.adminList = data.classinfo.class_members.filter(
                (item: IClassMembers) => item.level === 1);
              this.staffList = data.classinfo.class_members.filter(
                (item: IClassMembers) => item.level === 2);
              this.memberList = data.classinfo.class_members.filter(
                (item: IClassMembers) => item.level === 3);
              this.totalMemberNum = data.classinfo.class_members.length;
              this.classMembers = data.classinfo.class_members;
              console.log(this.classMembers);
          });
    }

    private getClassMemberLevel(): void {
        MyClassService.getClassMemberInfo(this.classID, this.memberID)
          .then((data) => {
            //console.log(data.member_info);
            this.memberLevel = data.member_info.level;
            console.log(this.memberLevel);
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
}