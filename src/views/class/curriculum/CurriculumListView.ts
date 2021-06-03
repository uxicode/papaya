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
    IModifyCurriculum,
} from '@/views/model/my-class.model';
import {Utils} from '@/utils/utils';
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

    @MyClass.Getter
    private classID!: number;

    @MyClass.Getter
    private myClassHomeModel!: IClassInfo;

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

    private onDetailCurriculumOpen(id: number) {
        console.log(id);
        this.detailCurriculumId = id;
        this.isDetailPopupOpen=true;
        // console.log(this.curriculumDetailData);
    }

    private onDetailCurriculumPopupStatus(value: boolean) {
        this.isDetailPopupOpen=value;
    }


    /**
     * 교육과정 리스트
     */

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

    /**
     * 클래스 교육과정 정보 조회
     */
    // get curriculumList(): ICurriculumList{
    //     return this.curriculumDetailData;
    // }


    /**
     * 클래스 교육과정 수정
     */

    // private getModifyEduCurList(cardId: number): void {
    //     MyClassService.getEduCurList(this.classID, cardId)
    //         .then((data) => {
    //             this.curriculumDetailData = data;
    //             this.modifyClassItems.course_list = this.curriculumList.curriculum.course_list;
    //             this.modifyClassItems.title = this.curriculumList.curriculum.title;
    //             this.modifyClassItems.goal = this.curriculumList.curriculum.text;
    //         });
    // }


    private onAddCurriculumPopupStatus(value: boolean) {
        this.isAddPopupOpen=value;
    }

    private onAddCurriculum(value: boolean) {
        this.isAddPopupOpen=value;
    }

    private onAddCurriculumPopupOpen() {
        this.isAddPopupOpen=true;
    }


    // private modifyCurriculumHandler(curriculumIdx: number) {
    //     this.isModifyClass = true;
    //     this.cardId = curriculumIdx;
    //
    //     this.$nextTick(()=>{
    //         this.getModifyEduCurList(this.cardId);
    //     });
    // }




}






