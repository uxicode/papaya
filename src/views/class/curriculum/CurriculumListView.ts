import {Vue, Component, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import TxtField from '@/components/form/txtField.vue';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import AddCurriculumPopup from '@/views/class/curriculum/AddCurriculumPopup';
import CurriculumDetailPopup from '@/views/class/curriculum/CurriculumDetailPopup';
import {
    IClassInfo,
    IEducationList,
    ICurriculumList,
} from '@/views/model/my-class.model';
import MyClassService from '@/api/service/MyClassService';
import WithRender from './CurriculumListView.html';

const MyClass = namespace('MyClass');


@WithRender
@Component({
    components:{
        TxtField,
        Modal,
        Btn,
        AddCurriculumPopup,
        CurriculumDetailPopup
    }
})
export default class CurriculumListView extends Vue {
    @Prop(Boolean)
    private isOpen!: boolean;

    @Prop(Array)
    private readonly curriculumListItems!: ICurriculumList;

    @MyClass.Getter
    private classID!: number;

    @MyClass.Getter
    private myClassHomeModel!: IClassInfo;

    @MyClass.Action
    private GET_CURRICULUM_DETAIL_ACTION!: ( payload: { classId: number, curriculumId: number }) =>Promise<any>;

    /* Modal 오픈 상태값 */
    private isDetailPopupOpen: boolean=false;
    private detailCurriculumId: number=-1; // 동적으로 변경 안되는 상태

    private isCreateError: boolean = false;

    private isAddPopupOpen: boolean=false;

    private imgFileURLItems: string[] = [];

    get imgFileURLItemsModel(): string[] {
        return this.imgFileURLItems;
    }

    /**
     * 클래스 교육과정 메인리스트
     */


    private allEduList: IEducationList[]= [];

    public created(){
        // this.settingItems=this.mItemByMakeEduList();
        this.getEduList();
    }

    private isOwner( ownerId: number, userId: number): boolean {
        return (ownerId === userId);
    }


    /**
     * 클래스 교육과정 삭제
     */
    private deleteCurriculum( curriculumID: number ): void{
        MyClassService.deleteEducationList ( this.classID, curriculumID )
            .then(() => {
                console.log('교육과정 삭제 성공');
                alert('선택하신 교육과정이 삭제 되었습니다.');
            });
    }


    /**
     * 클래스 교육과정 전체 조회
     */
    get allEducationList(): IEducationList[] {
        return this.allEduList;
    }

    private getEduList(): void {
        MyClassService.getEducationList(this.classID)
            .then((data) => {
                this.allEduList = data;
                // console.log(this.allEduList);
            });
    }


    private onAddCurriculumPopupStatus(value: boolean) {
        this.isAddPopupOpen=value;
    }

    private onAddCurriculum(value: boolean) {
        this.isAddPopupOpen=value;
    }

    private onAddCurriculumPopupOpen() {
        this.isAddPopupOpen=true;
    }

    private onDetailCurriculumPopupStatus(value: boolean) {
        this.isDetailPopupOpen=value;
    }

    private async onDetailCurriculumOpen(id: number) {
        this.detailCurriculumId = id; // update postId
        await this.GET_CURRICULUM_DETAIL_ACTION({classId: Number(this.classID), curriculumId: this.detailCurriculumId})
            .then((data)=>{
                this.isDetailPopupOpen=true;
            });
    }


}






