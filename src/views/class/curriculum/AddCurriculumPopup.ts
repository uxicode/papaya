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
import MyClassService from '@/api/service/MyClassService';
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

    @MyClass.Getter
    private classID!: number;

    @MyClass.Getter
    private myClassHomeModel!: IClassInfo;

    /* Modal 오픈 상태값 */
    private isOpenAddCoursePopup: boolean=false;


    private courseIdx: number = 0;
    private countCourseNumber: number = 0;

    private CourseSettingsItems: string[] = ['수업 내용 수정', '수업 삭제'];
    private CourseSettingsModel: string = '수업 내용 수정';

    private imageLoadedCount: number=0;

    private imgFileURLItems: string[] = [];
    private imgFileDatas: any[] = [];
    private attachFileItems: any[] = [];
    private formData!: FormData;

    /**
     * 클래스 교육과정 메인리스트
     */

    private makeCurriculumItems: IMakeEducation={
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


    private curriculumDetailData: ICurriculumList={
        curriculum: {
            startAt: '2019-11-17 10:00:00',
            endAt: '2019-11-17 10:00:00',
            expiredAt: '2019-11-17 10:00:00',
            createdAt: '2019-11-17 10:00:00',
            updatedAt: '2019-11-17 10:00:00',
            id: 0,
            class_id: 0,
            board_id: 0,
            post_type: 0,
            type: 0,
            user_id: 0,
            user_member_id: 0,
            title: '',
            text: '',
            count: 0,
            param1: 0,
            deletedYN: false,
            owner: {
                nickname: '',
                level: 0,
            },
            course_list: [
                {
                    startDay: '2019-11-17',
                    createdAt: '2019-11-17',
                    updatedAt: '2019-11-17',
                    id: 0,
                    curriculum_id: 0,
                    class_id: 0,
                    index: 0,
                    title: '',
                    contents: '',
                    startTime: '2019-11-17',
                    endTime: '2019-11-17',
                    deletedYN: false,
                    attachment: [],
                },
            ],
        }
    };

    private curriculumDetailDataNum: number = 10;
    private eduItems: Array< {title: string }>=[];


    get isSubmitValidate(): boolean{
        return (this.makeCurriculumItems.title !== '' && this.makeCurriculumItems.goal !== '');
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

        this.makeCurriculumItems.course_list = [];

        for (let i = 0; i < num; i++) {
            this.makeCurriculumItems.course_list.push({
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
    private submitAddCurriculum(): void{
        //시나리오 --> 등록 버튼 클릭 > 이미지 추가한 배열값 formdata에 입력 > 전송 >전송 성공후> filesAllClear 호출 > 팝업 닫기

        // this.setImageFormData();
        // this.setAttachFileFormData();
        this.setCurriculumDataToFormData();
    }

    private onAddCurriculumSubmit() {
        this.submitAddCurriculum();
    }

    private setCurriculumDataToFormData() {
        if( !this.isSubmitValidate ){return;}

        if (Utils.isUndefined(this.formData)) {
            this.formData = new FormData();
        }

        const temp = JSON.stringify( {...this.makeCurriculumItems} );
        this.formData.append('data', temp );

        MyClassService.setEducationList( this.classID, this.formData )
            .then((data)=>{
                console.log( '교육과정 생성 성공', data );
                this.$emit('submit', false);
                this.imgFilesAllClear();
                this.attachFilesAllClear();
            });
    }



    private attachFilesAllClear() {
        this.attachFileItems = [];
        this.formData.delete('files');
        // this.imageLoadedCount=0;
    }

    private imgFilesAllClear() {
        this.imgFileURLItems = [];
        this.imgFileDatas=[];
        this.makeCurriculumItems={
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
        this.formData.delete('files');
        this.imageLoadedCount=0;
    }


    /**
     * 클래스 교육과정 정보 조회
     */
    get curriculumList(): ICurriculumList{
        return this.curriculumDetailData;
    }


    private curriculumClickHandler( idx: number ) {
        // this.isClassCurr = true;
        this.countCourseNumber = idx;
    }

}






