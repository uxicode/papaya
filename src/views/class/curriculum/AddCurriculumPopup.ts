import {Vue, Component, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {Utils} from '@/utils/utils';
import TxtField from '@/components/form/txtField.vue';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import AddCoursePopup from '@/views/class/curriculum/AddCoursePopup';
import {ImageFileServiceHelper} from '@/views/service/preview/ImageFileServiceHelper';
import {AttachFileServiceHelper} from '@/views/service/preview/AttachFileServiceHelper';

import {
    IClassInfo,
    IMakeEducation,
    ICurriculumList,
} from '@/views/model/my-class.model';
import WithRender from './AddCurriculumPopup.html';


const MyClass = namespace('MyClass');


@WithRender
@Component({
    components:{
        TxtField,
        Modal,
        Btn,
        AddCoursePopup
    }
})
export default class AddCurriculumPopup extends Vue {
    @Prop(Boolean)
    private isOpen!: boolean;

    @Prop(Number)
    private cardId!: number;

    @Prop(Object)
    private makeCurriculumData!: any;

    @MyClass.Getter
    private classID!: number;

    @MyClass.Getter
    private myClassHomeModel!: IClassInfo;

    @MyClass.Getter
    private curriculumListItems!: ICurriculumList;

    @MyClass.Action
    private GET_CURRICULUM_LIST_ACTION!: ( payload: {classId: number}) => Promise<any>;

    @MyClass.Action
    private ADD_CURRICULUM_ACTION!: (payload: {classId: number, formData: FormData}) => Promise<any>;

    @MyClass.Action
    private GET_CURRICULUM_DETAIL_ACTION!: ( payload: { classId: number, curriculumId: number }) =>Promise<any>;

    /* Modal 오픈 상태값 */
    private isOpenAddCoursePopup: boolean=false;


    private courseIdx: number = 0;

    private CourseSettingsItems: string[] = ['수업 내용 수정', '수업 삭제'];
    private CourseSettingsModel: string = '수업 내용 수정';

    private formData: FormData = new FormData();

    private imgFileService: ImageFileServiceHelper=new ImageFileServiceHelper();
    private attachFileService: AttachFileServiceHelper=new AttachFileServiceHelper();

    private imgAttachData: any[] = [];
    private attachFileData: any[] = [];

    private curriculumDetailDataNum: number = 10;
    private eduItems: Array< {title: string }>=[];

    get isSubmitValidate(): boolean{
        return (this.makeCurriculumData.title !== '' && this.makeCurriculumData.goal !== '');
    }

    get currentCourseSettingItems(): string[]{
        return this.CourseSettingsItems;
    }

    private popupChange( value: boolean ) {
        this.$emit('change', value);
    }

    private coursePopupClose(value: boolean){
        this.$emit('change', value);
        this.resetCurriculumAdd();
    }

    private addCoursePopupOpen(idx: number) {
        this.isOpenAddCoursePopup=true;
        this.courseIdx = idx;
    }

    private onCoursePopupClose(value: boolean ) {
        this.isOpenAddCoursePopup=value;
    }
    private onAddCourse() {
        this.isOpenAddCoursePopup=false;
    }

    /**
     * 교육과정 수업 회차 설정
     */
    get courseListNumModel(): Array< {title: string }>{
        this.eduItems.length = 10;
        return this.eduItems;
    }

    private setCourseList( num: number ): void{
        if( this.curriculumDetailDataNum >= 0 ){
            this.curriculumDetailDataNum=num;
            this.eduItems.length=num;

            if( this.curriculumDetailDataNum > 50){
                // this.isCreateError = true;

                num = 50;
                this.curriculumDetailDataNum=50;
                this.eduItems.length=50;
            }
        }

        this.makeCurriculumData.course_list = [];
        this.imgAttachData = [];
        this.attachFileData = [];

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

    private courseListReplace() {
        const courseListLen = this.makeCurriculumData.course_list.length;
        this.curriculumDetailDataNum = courseListLen;
        this.eduItems.length = courseListLen;
    }


    private courseDelete(idx: number){
        const findIdx=this.makeCurriculumData.course_list.findIndex((item: any) => item.id === idx);
        this.makeCurriculumData.course_list.splice(findIdx, 1);

        this.imgFileService.deleteImgFileItem(this.imgAttachData, idx);
        this.attachFileService.deleteImgFileItem(this.attachFileData, idx);

        this.courseListReplace();
    }

    private receiveImgData(){
        return this.imgAttachData;
    }

    private receiveFileData(){
        return this.attachFileData;
    }


    /**
     * 교육과정 > 등록 버튼 클릭시 팝업 닫기 및 데이터 전송 (
     * @private
     */
    private setCurriculumDataToFormData() {
        if( !this.isSubmitValidate ){return;}

        if (Utils.isUndefined(this.formData)) {
            this.formData = new FormData();
        }

        this.imgFileService.saveData(this.formData, this.imgAttachData);
        this.attachFileService.saveData( this.formData, this.attachFileData );

        console.log(this.formData.getAll('files'));
        const temp = JSON.stringify({...this.makeCurriculumData} );

        this.formData.append('data', temp );

        this.ADD_CURRICULUM_ACTION({ classId: Number(this.classID), formData: this.formData })
            .then((data) => {
                this.$emit('submit', false);
            });

        this.resetCurriculumAdd();
    }

    private resetCurriculumAdd(){
        this.formData = new FormData();
        this.makeCurriculumData.title = '';
        this.makeCurriculumData.goal = '';
        this.imgAttachData = [];
        this.attachFileData = [];
        this.imgFileService.removeAll();
        this.attachFileService.removeAll();
        this.setCourseList(10);
    }

}






