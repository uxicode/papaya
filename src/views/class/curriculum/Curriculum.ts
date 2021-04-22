import {Component, Vue} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import SideMenu from '@/components/sideMenu/sideMenu.vue';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import {
    IClassInfo,
    IMakeEducation,
    IEducationList,
    ICurriculumList,
    IClassMembers,
    ICourseList
} from '@/views/model/my-class.model';
import {Utils} from '@/utils/utils';
import MyClassService from '@/api/service/MyClassService';
import WithRender from './Curriculum.html';



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
        SideMenu,
        Modal,
        Btn
    }
})

export default class Curriculum extends Vue {
    /* Modal 오픈 상태값 */
    private isCreateClass: boolean = false;
    private isClassCurr: boolean = false;
    private isClassCurrMore: boolean = false;
    private isClassCurrDetail: boolean = false;

    @MyClass.Getter
    private classID!: number;

    private countNumber: number = 0;

    private cardId: number = 0;
    private courseId: number = 0;

    private EduSettingsItems: string[] = ['교육과정 수정', '교육과정 삭제'];
    private EduSettingsModel: string = '교육과정 수정';

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
    private makeEducation: IMakeEducation[]= [];

    private allEduList: IEducationList[]= [];
    private curList: ICurriculumList[]= [];
    private allCourseList: ICourseList[]= [];

    private currListNum: number = 0;
    private eduItems: Array< {title: string }>=[];
    private settingItems: Array<{ vo: string[], sItem: string }> = [];


    @MyClass.Getter
    private myClassHomeModel!: IClassInfo;

    get currentSettingItems(): string[]{
        return this.EduSettingsItems;
    }

    get currentStartTimeModel(): string{
        return `${this.startTimeSelectModel.apm} ${this.startTimeSelectModel.hour}시 ${this.startTimeSelectModel.minute} 분`;
    }

    get currentEndTimeModel(): string{
        return `${this.endTimeSelectModel.apm} ${this.endTimeSelectModel.hour}시 ${this.endTimeSelectModel.minute} 분`;
    }

    get settingItemsModel(): Array<{ vo: string[], sItem: string }>{
        return this.settingItems;
    }


    /**
     * 교육과정 리스트
     */
    get currListNumModel(): Array< {title: string }>{
        return this.eduItems;
    }

    public created(){
        this.settingItems=this.mItemByMakeEduList();
        this.getMakeEducation();
        this.getEduList();
    }

    public settingMenuClickHandler( mIdx: number, item: string ) {
        console.log(mIdx, item);
        this.settingItems[mIdx].sItem = item;
    }

    // public getSelectedSettingMenuItem( idx: number ): string{
    //     return this.settingItems[idx].sItem;
    // }

    private mItemByMakeEduList(): any[] {
        return this.makeEducation.map( ( item: IMakeEducation ) => {
            return { vo: this.EduSettingsItems, sItem:'반복없음' };
        });
    }

    private setCurriNum( num: number ): void{
        this.currListNum=num;
        this.eduItems.length=num;
    }

    private countNum(num: number): void{
        this.countNumber = num;
    }

    private clickCard(num: number): void{
        this.cardId = num;
        console.log(this.cardId);
    }

    private clickCourse(num: number): void{
        this.courseId = num;
        console.log(this.courseId);
    }

    /**
     * 클래스 교육과정 생성
     */
    get makeNewEducation(): IMakeEducation[] {
        return this.makeEducation;
    }

    private getMakeEducation(): void {
        MyClassService.getMakeEducation(this.classID)
            .then((data) => {
                this.makeEducation = data.makeEducation;
                console.log(this.makeEducation);
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
    get curriculumList(): ICurriculumList[] {
        return this.curList;
    }

    get cardIdNumber() {
        return this.cardId;
    }

    private getEduCurList(): void {
        MyClassService.getEduCurList(this.classID, this.cardIdNumber)
            .then((data) => {
                this.curList = data;
                console.log(data);
            });
    }

    /**
     * 클래스 교육과정 개별코스 정보 조회
     */
    get courseList(): ICourseList[] {
        return this.allCourseList;
    }

    get courseIdNumber() {
        return this.courseId;
    }

    private getEduCourseList(): void {
        MyClassService.getEduCourseList(this.classID, this.cardIdNumber, this.courseIdNumber )
            .then((data) => {
                this.allCourseList = data;
                console.log(data);
                // console.log(this.courseIdNumber);
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
        this.clickCard(idx);
        // console.log(this.cardId);
        this.getEduCurList();
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
    }
}






