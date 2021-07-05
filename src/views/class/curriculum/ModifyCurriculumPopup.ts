import {Vue, Component, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import TxtField from '@/components/form/txtField.vue';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import {
    IClassInfo,
    ICurriculumDetailList,
    IMakeEducation,
    IModifyCourse,
    IModifyCurriculum,
} from '@/views/model/my-class.model';
import {IAttachFileModel} from '@/views/model/post.model';
import {Utils} from '@/utils/utils';
import MyClassService from '@/api/service/MyClassService';
import ListInImgPreview from '@/components/preview/ListInImgPreview.vue';
import ListInFilePreview from '@/components/preview/ListInFilePreview.vue';
import ImagePreview from '@/components/preview/imagePreview.vue';
import FilePreview from '@/components/preview/filePreview.vue';
import ModifyCoursePopup from '@/views/class/curriculum/ModifyCoursePopup';
import ImageSettingService from '@/views/service/profileImg/ImageSettingService';
import WithRender from './ModifyCurriculumPopup.html';

const MyClass = namespace('MyClass');

@WithRender
@Component({
    components:{
        TxtField,
        Modal,
        Btn,
        ImagePreview,
        FilePreview,
        ListInImgPreview,
        ListInFilePreview,
        ModifyCoursePopup,
    }
})
export default class ModifyCurriculumPopup extends Vue {
    @Prop(Boolean)
    private isOpen!: boolean;

    @Prop(Number)
    private cardId!: number;

    @MyClass.Action
    private GET_CURRICULUM_DETAIL_ACTION!: (payload: { classId: number, curriculumId: number}) => Promise<any>;

    @MyClass.Action
    private GET_COURSE_DETAIL_ACTION!: (payload: { classId: number, curriculumId: number, courseId: number }) => Promise<any>;

    @MyClass.Action
    private MODIFY_CURRICULUM_ACTION!: (payload: {classId: number, curriculumId: number, formData: FormData}) => Promise<any>;

    @MyClass.Getter
    private classID!: number;

    @MyClass.Getter
    private myClassHomeModel!: IClassInfo;

    @MyClass.Getter
    private curriculumDetailItem!: ICurriculumDetailList;

    private isModifyClassCourse: boolean = false;
    private isCreateError: boolean = false;

    private countCourseNumber: number = 0;
    private curriculumId: number = 0;
    private courseId: number = 0;

    private EduSettingsItems: string[] = ['교육과정 수정', '교육과정 삭제'];

    private CourseSettingsItems: string[] = ['수업 내용 수정', '수업 삭제'];

    /* 수정할 값 */
    private formData: FormData = new FormData();
    private curriculumDetailDataNum: number = 0;
    private eduItems: Array< {title: string }>=[];

    private modifyCurriculumData: IModifyCurriculum = {
        title: '',
        goal: '',
        course_list: [],
        deleted_course_list: [],
    };

    private modifyCourseData: IModifyCourse = {
        id: 0,
        index: 0,
        title: '',
        contents: '',
        startDay: '',
        startTime: '',
        endTime: ''
    };

    private modifyCourseList: any = [];

    private makeCurriculumData: IMakeEducation={
        title: '',
        goal: '',
        course_list: [
            {
                index: 0,
                id: 0,
                startDay: '',
                startTime: '',
                endTime: '',
                title: '',
                contents: ''
            }
        ]
    };

    get curriculumDetailItemModel(): any {
        return this.curriculumDetailItem;
    }

    get currentSettingItems(): string[]{
        return this.EduSettingsItems;
    }

    get currentCourseSettingItems(): string[]{
        return this.CourseSettingsItems;
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


    private countCourseNum(num: number): void{
        this.countCourseNumber = num;
    }

    /**
     * 교육과정 수정 등록
     * 코스 수정 팝업에서 보낸 데이터를 getModifyCourseData 함수를 통해 받아옴.
     * 최종적으로 통신 시에 formData 에 담아서 전송.
     * @private
     */
    private async modifyConfirm() {
        console.log(this.modifyCourseList);
        this.modifyCurriculumData = {
            title: this.curriculumDetailItemModel.title,
            goal: this.curriculumDetailItemModel.text,
            deleted_course_list: [],
            course_list: this.modifyCourseList,
        };
        this.formData = new FormData();
        const temp = JSON.stringify( {...this.modifyCurriculumData} );
        this.formData.append('data', temp );

        await this.MODIFY_CURRICULUM_ACTION({classId: this.classID, curriculumId: this.curriculumDetailItemModel.id, formData: this.formData})
            .then(() => {
                this.popupChange(false);
                this.modifyCourseList = [];
            });
    }

    /**
     * 코스 수정 팝업 오픈
     * @private
     * @param curriculumId
     * @param courseId
     */
    private async onModifyCoursePopupOpen( curriculumId: number, courseId: number) {
        this.courseId = courseId;
        this.curriculumId = curriculumId;
        await this.GET_COURSE_DETAIL_ACTION({classId: Number(this.classID), curriculumId: this.curriculumId, courseId: this.courseId})
            .then((data)=>{
                // console.log(data);
                this.isModifyClassCourse=true;
            });
    }

    private onModifyCoursePopupStatus(value: boolean) {
        this.isModifyClassCourse=value;
    }

    /**
     * 개별 수업내용 삭제
     * @param id
     * @private
     */
    private deleteCourse(id: number): void {
        MyClassService.deleteEduCourse(this.classID, this.cardId, id)
            .then((result) => {
               console.log(result);
               if (this.curriculumDetailItem.course_list !== undefined) {
                   const findIdx = this.curriculumDetailItem.course_list.findIndex((item) => item.id === id);
                   this.curriculumDetailItem.course_list.splice(findIdx, 1);
               }
            });
    }

    /**
     * 코스 수정 팝업에서 emit 으로 보낸 데이터를 받아오는 함수
     * @param course
     * @private
     */
    private getModifyCourseData(course: IModifyCourse): void {
        this.modifyCourseData = course;
        this.modifyCourseList.push(this.modifyCourseData);
    }

    private popupChange( value: boolean ) {
        this.$emit('change', value);
    }

}






