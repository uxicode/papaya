import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IClassMemberInfo} from '@/views/model/my-class.model';
import MyClassService from '@/api/service/MyClassService';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import WithRender from './ClassStaffManage.html';

const MyClass = namespace('MyClass');

@WithRender
@Component({
    components: {
        Modal,
        Btn
    }
})

export default class ClassStaffManage extends Vue {
    @MyClass.Getter
    private classID!: number;

    private classStaffList: IClassMemberInfo[] = [];
    private totalStaffNum: number = 0;

    public created() {
        this.getClassStaffs();
    }

    /**
     * 전체 스탭 멤버 리스트를 가져온다.
     * @private
     */
    private getClassStaffs(): void {
        MyClassService.getClassInfoById(this.classID)
          .then((data) => {
              // 가입 승인된 스탭 멤버만 불러온다.
              this.classStaffList = data.classinfo.class_members.filter(
                (item: IClassMemberInfo) => (item.status === 1 && item.level === 2));
              console.log(this.classStaffList);
              this.totalStaffNum = this.classStaffList.length;
          });
    }

    /**
     * 스탭 추가 페이지로 이동
     * @private
     */
    private gotoAddStaff(): void {
        this.$router.push(`/class/${this.classID}/setting/classStaffAdd`)
          .then();
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
