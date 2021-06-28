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
    ICurriculumList, IMakeEducation,
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

    @MyClass.Action
    private GET_CURRICULUM_LIST_ACTION!: ( payload: {classId: number}) => Promise<ICurriculumList>;

    @MyClass.Action
    private GET_CURRICULUM_DETAIL_ACTION!: ( payload: { classId: number, curriculumId: number }) =>Promise<any>;

    @MyClass.Action
    private DELETE_CURRICULUM_ACTION!: (payload: { classId: number, curriculumId: number }) => Promise<any>;

    @MyClass.Getter
    private curriculumDetailItem!: ICurriculumDetailList;

    @MyClass.Getter
    private classID!: number;

    @MyClass.Getter
    private myClassHomeModel!: IClassInfo;

    @MyClass.Getter
    private curriculumListItems!: ICurriculumList;

    /* Modal 오픈 상태값 */
    private isDetailPopupOpen: boolean=false;
    private cardId: number=-1; // 동적으로 변경 안되는 상태

    private isCreateError: boolean = false;

    private isAddPopupOpen: boolean=false;
    private isModifyPopupOpen: boolean=false;

    private makeCurriculumData: IMakeEducation={
        title: '',
        goal: '',
        course_list: []
    };

    private curriculumDetailDataNum = 10;

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

    private onAddCurriculumPopupOpen(num: number) {
        this.isAddPopupOpen=true;

        this.makeCurriculumData.course_list = [];

        for (let i = 0; i < num; i++) {
            this.makeCurriculumData.course_list.push({
                index: i,
                id: i,
                title: '',
                startDay: '',
                startTime: '',
                endTime: '',
                contents: ''
            });
        }
    }

    private onDetailCurriculumPopupStatus(value: boolean) {
        this.isDetailPopupOpen=value;
        this.courseDetailArray( this.courseDetailData );
    }

    /**
     * 교육과정 수정 팝업 오픈
     * @param id
     * @private
     */
    private async onModifyCurriculumPopupOpen(id: number) {
        this.cardId = id;
        await this.GET_CURRICULUM_DETAIL_ACTION({classId: Number(this.classID), curriculumId: id})
            .then((data)=>{
                this.isModifyPopupOpen=true;
            });

    }

    private onModifyCurriculumPopupStatus(value: boolean) {
        this.isModifyPopupOpen=value;
        this.courseDetailArray( this.courseDetailData );
    }

    private onModifyCurriculum(value: boolean) {
        this.isModifyPopupOpen=value;
    }

    private courseDetailArray(target: any) {
        target.sort((x: any, y: any)=> x.index - y.index);
    }

    /**
     * 디테일 팝업 오픈
     * @param id
     */
    private async onDetailCurriculumOpen(id: number) {
        this.cardId = id; // update postId

        await this.GET_CURRICULUM_DETAIL_ACTION({classId: Number(this.classID), curriculumId: this.cardId})
            .then((data)=>{
                this.isDetailPopupOpen=true;
            });

        this.courseDetailArray( this.courseDetailData );
    }

    private deleteCurriculum(id: number){
        this.cardId = id;
        console.log(this.classID);
        this.DELETE_CURRICULUM_ACTION({classId: Number(this.classID), curriculumId: id})
            .then((data)=>{
                console.log(`delete curriculum`, data);
            });
    }

}






