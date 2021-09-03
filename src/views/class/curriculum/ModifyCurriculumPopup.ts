import {Vue, Component, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import TxtField from '@/components/form/txtField.vue';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';
import NoticePopup from '@/components/modal/noticePopup.vue';
import ModifyCoursePopup from '@/views/class/curriculum/ModifyCoursePopup';
import {
    IClassInfo,
    ICurriculumDetailList,
    IModifyCourse,
    IModifyCurriculum,
} from '@/views/model/my-class.model';
import MyClassService from '@/api/service/MyClassService';
import WithRender from './ModifyCurriculumPopup.html';

const MyClass = namespace('MyClass');

@WithRender
@Component({
    components:{
        TxtField,
        Btn,
        Modal,
        NoticePopup,
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

    private curriculumId: number = 0;
    private courseId: number = 0;
    private courseIdx: number = 0;

    private EduSettingsItems: string[] = ['교육과정 수정', '교육과정 삭제'];
    private CourseSettingsItems: string[] = ['수업 내용 수정', '수업 삭제'];

    /* 수정할 값 */
    private formData: FormData = new FormData();
    private eduItems: Array< {title: string }>=[];
    private curriculumDetailDataNum: number = 0;

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

    private modifyCourseList: IModifyCourse[] = [];
    private imgAttachData: any[] = [];
    private attachFileData: any[] = [];

    /* 회차 수정 에러 팝업 */
    private isOpenError: boolean = false;
    private errorTitle: string = '교육 회차 수정이 불가능 합니다.';
    private errorMessage: string = '';

    get curriculumDetailItemModel(): any {
        return this.curriculumDetailItem;
    }

    get currentSettingItems(): string[]{
        return this.EduSettingsItems;
    }

    get currentCourseSettingItems(): string[]{
        return this.CourseSettingsItems;
    }

    private inFocus(): void{
        if(this.imgAttachData.length > 0){
            this.isOpenError = true;
            this.errorMessage = '교육 회차에 첨부 파일이 있는 경우 회차 수정이 불가능 합니다.';
        }
    }

    private setCourseList( num: number ): void{
        const courseListLen = this.curriculumDetailItemModel.course_list.length;
        if( this.curriculumDetailDataNum >= courseListLen){
            this.curriculumDetailDataNum=num;
            this.eduItems.length=num;

            // 수업 회차 10개 초과 생성 불가
            if( this.curriculumDetailDataNum > 10){
                this.isOpenError = true;
                this.errorMessage = '수업 회차는 10회까지 생성 가능합니다.';

                num = 10;
                this.curriculumDetailDataNum=10;
                this.eduItems.length=10;
            }
        }
        // 생성되어 있는 교육 회차 갯수 미만 생성 불가
        else {
            this.isOpenError = true;
            this.errorMessage = '이미 생성된 교육 회차보다 적게 생성할 수 없습니다.';
            this.curriculumDetailDataNum = courseListLen;
        }

        this.modifyCurriculumData.course_list = [...this.curriculumDetailItemModel.course_list];

        // 입력한 수에서 기존 교육 회차 갯수를 뺀만큼 리스트에 추가한다.
        for (let i = 0; i < num-courseListLen; i++) {
            this.curriculumDetailItemModel.course_list.push({
                index: num-courseListLen+i+1,
                id: num-courseListLen+i+1,
                title: '',
                startDay: '',
                startTime: '',
                endTime: '',
                contents: ''
            });
        }
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
        const temp = JSON.stringify( {...this.modifyCurriculumData} );
        this.formData.append('data', temp );

        await this.MODIFY_CURRICULUM_ACTION({classId: this.classID, curriculumId: this.curriculumDetailItemModel.id, formData: this.formData})
            .then((res: any) => {
                console.log(res);
                this.popupChange(false);
                this.modifyCourseList = [];
            });
    }

    /**
     * 코스 수정 팝업 오픈
     * @private
     * @param curriculumId
     * @param courseId
     * @param idx
     */
    private async onModifyCoursePopupOpen( curriculumId: number, courseId: number, idx: number) {
        if (courseId > 10) {
            this.courseId = courseId;
            this.curriculumId = curriculumId;
            await this.GET_COURSE_DETAIL_ACTION({classId: Number(this.classID), curriculumId: this.curriculumId, courseId: this.courseId});
        }
        this.courseIdx = idx;
        this.isModifyClassCourse=true;
        console.log(this.courseId);
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

    private onDeleteNoticePopupClose( value: boolean ) {
        this.isOpenError=value;
    }

}
