import {Component, Vue} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import SideMenu from '@/components/sideMenu/sideMenu.vue';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import {IClassInfo, IMakeEducation} from '@/views/model/my-class.model';
import {Utils} from '@/utils/utils';
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
    private isMoreMenu: boolean = false;

    @MyClass.Getter
    private classID!: number;

    private countNumber: number = 0;
    private classCardIndex: number = 0;
    private classCurrIndex: number = 0;

    private EduSettingsItems: string[] = ['교육과정 수정', '교육과정 삭제'];


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
    private makeEducation: IMakeEducation[]= [
        {
            title: '파파야 교육과정 제목1',
            goal: '파파야 교육과정 목표1',
            course_list: [
                {
                    index: 1,
                    title: '1회차수업',
                    startDay: new Date( 2019,12,15 ),
                    startTime: new Date( 2019,12,15, 10, 0, 0 ),
                    endTime: new Date( 2019,12,15, 11, 0, 0 ),
                    contents: '수업내용 100자이내로 설명1-1.'
                },
                {
                    index: 2,
                    title: '2회차수업',
                    startDay: new Date( 2019,12,15 ),
                    startTime: new Date( 2019,12,15, 10, 0, 0 ),
                    endTime: new Date( 2019,12,15, 11, 0, 0 ),
                    contents: '수업내용 100자이내로 설명2-1.'
                },
                {
                    index: 3,
                    title: '3회차수업',
                    startDay: new Date( 2019,12,15 ),
                    startTime: new Date( 2019,12,15, 10, 0, 0 ),
                    endTime: new Date( 2019,12,15, 11, 0, 0 ),
                    contents: '수업내용 100자이내로 설명3-1.'
                }
            ],
            isChk: false,
            writer: '김미영선생님',
            level: 1,
        },
        {
            title: '파파야 교육과정 제목2',
            goal: '파파야 교육과정 목표2',
            course_list: [
                {
                    index: 1,
                    title: '1회차수업',
                    startDay: new Date( 2019,12,15 ),
                    startTime: new Date( 2019,12,15, 10, 0, 0 ),
                    endTime: new Date( 2019,12,15, 11, 0, 0 ),
                    contents: '수업내용 100자이내로 설명1-2.'
                },
                {
                    index: 2,
                    title: '2회차수업',
                    startDay: new Date( 2019,12,15 ),
                    startTime: new Date( 2019,12,15, 10, 0, 0 ),
                    endTime: new Date( 2019,12,15, 11, 0, 0 ),
                    contents: '수업내용 100자이내로 설명2-2.'
                }
            ],
            isChk: false,
            writer: '김경희선생님',
            level: 2,
        },
        {
            title: '파파야 교육과정 제목3',
            goal: '파파야 교육과정 목표3',
            course_list: [
                {
                    index: 1,
                    title: '1회차수업',
                    startDay: new Date( 2019,12,15 ),
                    startTime: new Date( 2019,12,15, 10, 0, 0 ),
                    endTime: new Date( 2019,12,15, 11, 0, 0 ),
                    contents: '수업내용 100자이내로 설명1-3.'
                },
                {
                    index: 2,
                    title: '2회차수업',
                    startDay: new Date( 2019,12,15 ),
                    startTime: new Date( 2019,12,15, 10, 0, 0 ),
                    endTime: new Date( 2019,12,15, 11, 0, 0 ),
                    contents: '수업내용 100자이내로 설명2-3.'
                }
            ],
            isChk: false,
            writer: '박수한선생님',
            level: 2,
        },
    ];

    private currListNum: number = 0;
    private eduItems: Array< {title: string }>=[];
    private settingItems: Array<{ vo: string[], sItem: string }> = [];


    @MyClass.Getter
    private myClassHomeModel!: IClassInfo;


    get currentStartTimeModel(): string{
        return `${this.startTimeSelectModel.apm} ${this.startTimeSelectModel.hour}시 ${this.startTimeSelectModel.minute} 분`;
    }

    get currentEndTimeModel(): string{
        return `${this.endTimeSelectModel.apm} ${this.endTimeSelectModel.hour}시 ${this.endTimeSelectModel.minute} 분`;
    }

    get makeEducationList(): IMakeEducation[] {
        return this.makeEducation;
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


    private moreMenuToggle(): void {
        this.isMoreMenu = !this.isMoreMenu;
    }

    private countNum(num: number): void{
        this.countNumber = num;
    }

    private classCard(num: number): void{
        this.classCardIndex = num;
    }
    private classCurr(num: number): void{
        this.classCurrIndex = num;
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
        this.classCard(idx);
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






