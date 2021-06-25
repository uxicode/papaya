import {Vue, Component, Emit,} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import TxtField from '@/components/form/txtField.vue';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import AddCurriculumPopup from '@/views/class/curriculum/AddCurriculumPopup';
import CurriculumDetailPopup from '@/views/class/curriculum/CurriculumDetailPopup';
import ModifyCurriculumPopup from '@/views/class/curriculum/ModifyCurriculumPopup';
import {
    IClassInfo, ICurriculumDetailList,
    ICurriculumList,
} from '@/views/model/my-class.model';
import WithRender from './CurriculumListView.html';


const MyClass = namespace('MyClass');


@WithRender
@Component({
    components:{
        TxtField,
        Modal,
        Btn,
        AddCurriculumPopup,
        CurriculumDetailPopup,
        ModifyCurriculumPopup,
    }
})
export default class CurriculumListView extends Vue {
    @MyClass.Getter
    private classID!: number;

    @MyClass.Getter
    private myClassHomeModel!: IClassInfo;

    @MyClass.Getter
    private curriculumListItems!: ICurriculumList;

    @MyClass.Action
    private GET_CURRICULUM_LIST_ACTION!: ( payload: {classId: number}) => Promise<ICurriculumList>;

    @MyClass.Action
    private GET_CURRICULUM_DETAIL_ACTION!: ( payload: { classId: number, curriculumId: number }) =>Promise<any>;

    @MyClass.Action
    private DELETE_CURRICULUM_ACTION!: (payload: { classId: number, curriculumId: number }) => Promise<any>;

    @MyClass.Getter
    private curriculumDetailItem!: ICurriculumDetailList;

    /* Modal 오픈 상태값 */
    private isDetailPopupOpen: boolean=false;
    private detailCurriculumId: number=-1; // 동적으로 변경 안되는 상태

    private isCreateError: boolean = false;

    private isAddPopupOpen: boolean=false;
    private isModifyPopupOpen: boolean=false;


    public created() {
        this.getList().then();
    }

    get courseDetailData(): any {
        return this.curriculumDetailItem.course_list;
    }

    private async getList() {
        await this.GET_CURRICULUM_LIST_ACTION({classId: Number(this.classID)});
    }

    private isOwner( ownerId: number, userId: number): boolean {
        return (ownerId === userId);
    }

    /**
     * 팝업 상태
     * @param value
     */
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

    /**
     * 교육과정 수정 팝업 오픈
     * @param id
     * @private
     */
    private async onModifyCurriculumPopupOpen(id: number) {
        this.detailCurriculumId = id;
        await this.GET_CURRICULUM_DETAIL_ACTION({classId: Number(this.classID), curriculumId: id})
            .then((data)=>{
                this.isModifyPopupOpen=true;
            });

    }

    private onModifyCurriculumPopupStatus(value: boolean) {
        this.isModifyPopupOpen=value;
    }

    private onModifyCurriculum(value: boolean) {
        this.isModifyPopupOpen=value;
    }

    private courseDetailArray(x: any, y: any){
        return x.index - y.index;
    }

    /**
     * 디테일 팝업 오픈
     * @param id
     */
    private async onDetailCurriculumOpen(id: number) {
        this.detailCurriculumId = id; // update postId

        await this.GET_CURRICULUM_DETAIL_ACTION({classId: Number(this.classID), curriculumId: this.detailCurriculumId})
            .then((data)=>{
                this.isDetailPopupOpen=true;
                this.courseDetailData.sort(this.courseDetailArray);
            });
    }

    private deleteCurriculum(id: number){
        this.detailCurriculumId = id;
        this.DELETE_CURRICULUM_ACTION({classId: Number(this.classID), curriculumId: id})
            .then((data)=>{
                console.log(`delete curriculum`, data);
            });
    }

}






