import {Vue, Component, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';

import {Utils} from '@/utils/utils';
import {ImageFileServiceHelper} from '@/views/service/preview/ImageFileService';
import {AttachFileServiceHelper} from '@/views/service/preview/AttachFileService';
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
        this.allClear();
    }

    private addCoursePopupOpen(idx: number) {
        this.isOpenAddCoursePopup=true;
        this.courseIdx = idx;
    }

    private onCoursePopupClose(value: boolean ) {
        this.isOpenAddCoursePopup=value;
    }
    private onAddCourse() {
        // this.voteData = voteData;
        this.isOpenAddCoursePopup=false;
        // console.log(voteData);
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
     * post 등록을 완료후 formdata 및 배열에 지정되어 있던 데이터들 비우기..
     * @private
     */
    private imgFilesAllClear() {
        this.imgFileService.removeAll();
        this.formData.delete('files');
    }

    private attachFilesAllClear() {
        this.attachFileService.removeAll();
        this.formData.delete('files');
    }


    /**
     * 교육과정 > 등록 버튼 클릭시 팝업 닫기 및 데이터 전송 (
     * @private
     */

    private submitAddPost(): void{
        //시나리오 --> 등록 버튼 클릭 > 이미지 추가한 배열값 formdata 에 입력 > 전송 >전송 성공후> filesAllClear 호출 > 팝업 닫기
        // //이미지 파일 저장.
        // this.imgFileService.save( this.formData );
        //
        // //파일 저장.
        // this.attachFileService.save( this.formData );

        //알림 데이터 전송 ( 투표 및 링크 데이터 )
        this.setCurriculumDataToFormData();
    }

    private onAddPostSubmit() {
        this.submitAddPost();
    }

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
            });

    }

    private allClear() {
        // 등록이 완료되고 나면 해당 저장했던 데이터를 초기화 시켜 두고 해당 팝업의  toggle 변수값을 false 를 전달해 팝업을 닫게 한다.
        this.imgFilesAllClear(); //이미지 데이터 비우기
        this.attachFilesAllClear();//파일 데이터 비우기
        this.makeCurriculumData = {
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
    }

}






