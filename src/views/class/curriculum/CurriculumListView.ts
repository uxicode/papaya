import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import TxtField from '@/components/form/txtField.vue';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import {
    IClassInfo,
    IMakeEducation,
    IMakeCourse,
    IEducationList,
    ICurriculumList,
    ICourseList
} from '@/views/model/my-class.model';
import {Utils} from '@/utils/utils';
import MyClassService from '@/api/service/MyClassService';
import WithRender from './CurriculumListView.html';


const MyClass = namespace('MyClass');

/*start: 추가 테스트*/
interface ITimeModel{
    apm: string;
    hour: string;
    minute: string;
}
/*end: 추가 테스트*/

@WithRender
@Component({
    components:{
        TxtField,
        Modal,
        Btn
    }
})
export default class CurriculumListView extends Vue {
    /* Modal 오픈 상태값 */
    private isCreateClass: boolean = false;
    private isClassCurr: boolean = false;
    private isClassCurrMore: boolean = false;
    private isClassCurrDetail: boolean = false;
    private isCreateError: boolean = false;

    @MyClass.Getter
    private classID!: number;

    private countNumber: number = 0;

    private cardId: number = 0;
    private courseId: number = 0;

    private EduSettingsItems: string[] = ['교육과정 수정', '교육과정 삭제'];
    private EduSettingsModel: string = '교육과정 수정';

    private CourseSettingsItems: string[] = ['수업 내용 수정', '수업 삭제'];
    private CourseSettingsModel: string = '수업 내용 수정';

    /**
     * 클래스 교육과정 메인리스트
     */

        //datepicker
    private startDatePickerModel: string= new Date().toISOString().substr(0, 10);
    private startTimeSelectModel: ITimeModel={ apm:'오전', hour:'12', minute: '30'};
    private startDateMenu: boolean= false; // 캘린 셀렉트 열고 닫게 하는 toggle 변수
    private startTimeMenu: boolean=false;  // 시간 셀렉트 열고 닫게 하는 toggle 변수

    private endTimeMenu: boolean=false;  // 시간 셀렉트 열고 닫게 하는 toggle 변수
    private endTimeSelectModel: ITimeModel={ apm:'오전', hour:'12', minute: '30'};


    // 날짜 시간 지정 - new Date(year, month, day, hours, minutes, seconds, milliseconds)
    private makeCurriculumItems: IMakeEducation={
        title: '',
        goal: '',
        course_list: [
            {
                index: 1,
                title: '',
                startDay:'2019-11-17',
                startTime:'10:00:00',
                endTime:'10:00:00',
                contents: '',
            }
        ]
    };

    private allEduList: IEducationList[]= [];
    private currList: ICurriculumList={
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
                    createdAt: '2019-11-17 10:00:00',
                    updatedAt: '2019-11-17 10:00:00',
                    id: 0,
                    curriculum_id: 0,
                    class_id: 0,
                    index: 0,
                    title: '',
                    contents: '',
                    startTime: '10:00:00',
                    endTime: '10:00:00',
                    deletedYN: false,
                    attachment: [],
                },
            ]
        }
    };

    private makeCourseItems: IMakeCourse={
        title: '',
        contents: '',
        startDay:new Date(),
        startTime:new Date(),
        endTime:new Date(),
    };

    private allCourseList: ICourseList={
        course: {
            startDay:new Date(),
            createdAt:new Date(),
            updatedAt:new Date(),
            id: 0,
            curriculum_id: 0,
            class_id: 0,
            index: 0,
            title: '',
            contents: '',
            startTime:new Date(),
            endTime:new Date(),
        }
    };

    private currListNum: number = 10;
    private eduItems: Array< {title: string }>=[];
    // private settingItems: Array<{ vo: string[], sItem: string }> = [];


    @MyClass.Getter
    private myClassHomeModel!: IClassInfo;

    get currentSettingItems(): string[]{
        return this.EduSettingsItems;
    }

    get currentCourseSettingItems(): string[]{
        return this.CourseSettingsItems;
    }

    get currentStartTimeModel(): string{
        return `${this.startTimeSelectModel.apm} ${this.startTimeSelectModel.hour}시 ${this.startTimeSelectModel.minute} 분`;
    }

    get currentEndTimeModel(): string{
        return `${this.endTimeSelectModel.apm} ${this.endTimeSelectModel.hour}시 ${this.endTimeSelectModel.minute} 분`;
    }

    // get settingItemsModel(): Array<{ vo: string[], sItem: string }>{
    //     return this.settingItems;
    // }


    /**
     * 교육과정 리스트
     */
    public created(){
        // this.settingItems=this.mItemByMakeEduList();
        this.getEduList();
    }

    // public settingMenuClickHandler( mIdx: number, item: string ) {
    //     console.log(mIdx, item);
    //     this.settingItems[mIdx].sItem = item;
    // }

    // public getSelectedSettingMenuItem( idx: number ): string{
    //     return this.settingItems[idx].sItem;
    // }

    // private mItemByMakeEduList(): any[] {
    //     return this.makeCurriculumItems.map( ( item: IMakeEducation ) => {
    //         return { vo: this.EduSettingsItems, sItem:'반복없음' };
    //     });
    // }

    /**
     * 교육과정 수업 회차 설정
     */
    get currListNumModel(): Array< {title: string }>{
        this.eduItems.length = 10;
        return this.eduItems;
    }

    private setCurriNum( num: number ): void{

        if( this.currListNum > 50 ){
            this.isCreateError = true;
            this.currListNum=50;
            this.eduItems.length=50;
        }else {
            this.currListNum=num;
            this.eduItems.length=num;
        }

    }

    private countNum(num: number): void{
        this.countNumber = num;
    }

    /**
     * 클래스 교육과정 생성
     */
    private makeCurriculumSubmit(): void{
        // console.log(this.classID, this.makeCurriculumItems);
        MyClassService.setEducationList( this.classID, this.makeCurriculumItems )
            .then((data) => {
                console.log( '교육과정 생성 성공', data );
                this.isCreateClass = false;
            });
    }

    /**
     * 클래스 교육과정 삭제
     */
    private deleteCurriculum( curriculumID: number ): void{
        MyClassService.deleteEducationList ( this.classID, curriculumID )
            .then(() => {
                console.log('교육과정 삭제 성공');
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
                console.log(this.allEduList);
            });
    }


    /**
     * 클래스 교육과정 정보 조회
     */
    get curriculumList(): ICurriculumList{
        return this.currList;
    }

    get cardIdNumber() {
        return this.cardId;
    }

    private getEduCurrList(cardId: number): void {
        MyClassService.getEduCurrList(this.classID, cardId)
            .then((data) => {
                this.currList = data;
                console.log(cardId);
                console.log('getEduCurrList 함수 데이터', data);
            });
    }

    /**
     * 클래스 교육과정 개별코스 정보 조회
     */
    private clickCourse(num: number): void{
        this.courseId = num;
        console.log(this.courseId);
    }

    get courseList(): ICourseList{
        return this.allCourseList;
    }

    get courseIdNumber() {
        return this.courseId;
    }

    private getEduCourseList(): void {
        MyClassService.getEduCourseList(this.classID, this.cardIdNumber, this.courseIdNumber )
            .then((data) => {
                this.allCourseList = data;
                console.log('getEduCourseList 함수 데이터', data);
            });
    }


    private getProfileImg( imgUrl: string | null | undefined ): string{
        const randomImgItems = [
            'image-a.jpg',
            'image-b.jpg',
            'image-c.jpg',
            'image-d.jpg',
            'image-e.jpg'
        ];
        let img: string= '';
        if( imgUrl === null || imgUrl === undefined){
            img=randomImgItems[ Utils.getRandomNum(0, 5) ];
        }else if( !isNaN( parseInt(imgUrl, 10) ) ){
            img=randomImgItems[ parseInt(imgUrl, 10) ];
        }else{
            img=imgUrl;
        }

        return ( imgUrl !== null && imgUrl !== undefined )? img : require( `@/assets/images/${img}` );
    }

    private cardClickHandler( idx: number ) {
        this.isClassCurrMore = true;
        // this.clickCard(idx);
        this.cardId=idx;
        this.$nextTick(()=>{
            this.getEduCurrList(this.cardId);
        });

        // console.log(this.cardId);
    }

    private curriculumClickHandler( idx: number ) {
        this.isClassCurr = true;
        this.countNum(idx);
    }

    private curriculumDetailClickHandler( idx: number ) {
        this.isClassCurrDetail = true;
        this.clickCourse(idx);
        this.getEduCourseList();
    }



    /**
     * 멤버 등급별 아이콘
     * @param level
     * @private
     */
    private memberLevelIcon(level: number): string {
        switch (level) {
            case 1:
                return 'manager';
            case 2:
                return 'staff';
            default:
                return 'member';
        }

        console.log('test' , level);
    }

    private getCurrItemTitleById( title: string): string {
        return (title)? title : '';
    }

    private getCurrCourseItemTitleById( title: string ): string {
        return (title)? title: '';
    }
}






