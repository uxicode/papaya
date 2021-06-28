import {Vue, Component, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {Utils} from '@/utils/utils';
import TxtField from '@/components/form/txtField.vue';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import AddCoursePopup from '@/views/class/curriculum/AddCoursePopup';
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
    private detailCurriculumId!: number;

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

    // private makeCurriculumData: IMakeEducation={
    //     title: '',
    //     goal: '',
    //     course_list: []
    // };

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


    /**
     * 교육과정 > 등록 버튼 클릭시 팝업 닫기 및 데이터 전송 (
     * @private
     */
    private setCurriculumDataToFormData() {
        if( !this.isSubmitValidate ){return;}

        if (Utils.isUndefined(this.formData)) {
            this.formData = new FormData();
        }

        const temp = JSON.stringify({...this.makeCurriculumData} );

        this.formData.append('data', temp );

        this.ADD_CURRICULUM_ACTION({ classId: Number(this.classID), formData: this.formData })
            .then((data) => {
                this.$emit('submit', false);

                this.GET_CURRICULUM_LIST_ACTION({classId: Number(this.classID)}).then();
                this.formData = new FormData();
                this.makeCurriculumData.title = '';
                this.makeCurriculumData.goal = '';
            });

    }

}






