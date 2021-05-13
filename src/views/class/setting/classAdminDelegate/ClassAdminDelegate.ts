import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IClassMemberInfo} from '@/views/model/my-class.model';
import MyClassService from '@/api/service/MyClassService';
import Modal from '@/components/modal/modal.vue';
import WithRender from './ClassAdminDelegate.html';

const MyClass = namespace('MyClass');

@WithRender
@Component({
    components:{
        Modal,
    }
})
export default class ClassAdminDelegate extends Vue{
    @MyClass.Getter
    private classID!: number;

    private classMemberList: IClassMemberInfo[] = [];
    private totalMemberNum: number = 0;

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
     * 뒤로가기
     * @private
     */
    private goBack(): void {
        this.$router.push('./')
          .then();
    }
}