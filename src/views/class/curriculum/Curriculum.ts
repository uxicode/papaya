import {Component, Vue} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import SideMenu from '@/components/sideMenu/sideMenu.vue';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import {IClassInfo, IMakeEducation} from '@/views/model/my-class.model';
import {Utils} from '@/utils/utils';
import WithRender from './Curriculum.html';
import ImageSettingService from "@/views/service/profileImg/ImageSettingService";



const MyClass = namespace('MyClass');

interface ICurriculumList{
    listTit: string;
    managerLevel: boolean;
    classAdmin: string;
    classCnt: string;
    classCurrent: string;
    isActive?: boolean;
}


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
    private myClassHomeModel!: IClassInfo;

    @MyClass.Getter
    private classID!: number;

    private countNumber: number = 0;
    private classCardIndex: number = 0;
    private classCurrIndex: number = 0;

    private loopRangeModel: string = '반복없음';
    private loopRangeItems: string[] = ['반복없음', '매일', '매주', '매월', '매년'];
    private loopRangeCheck: boolean=false;

    get currentLoopRangeItems(): string[]{
        return this.loopRangeItems;
    }


    /**
     * 클래스 교육과정 메인리스트
     */

    private makeEducation: IMakeEducation[] = [
        {
            title: '파파야 교육과정 제목1',
            goal: '파파야 교육과정 목표1',
            course_list: [
                {
                    index: 1,
                    title: '1회차수업',
                    startDay: '2019-11-15',
                    startTime: '10:00:00',
                    endTime: '11:00:00',
                    contents: '수업내용 100자이내로 설명1.'
                },
                {
                    index: 2,
                    title: '2회차수업',
                    startDay: '2019-11-16',
                    startTime: '10:00:00',
                    endTime: '11:00:00',
                    contents: '수업내용 100자이내로 설명2.'
                },
                {
                    index: 3,
                    title: '3회차수업',
                    startDay: '2019-11-17',
                    startTime: '10:00:00',
                    endTime: '11:00:00',
                    contents: '수업내용 100자이내로 설명3.'
                }
            ],
        },
        {
            title: '파파야 교육과정 제목2',
            goal: '파파야 교육과정 목표2',
            course_list: [
                {
                    index: 1,
                    title: '1회차수업',
                    startDay: '2019-11-15',
                    startTime: '10:00:00',
                    endTime: '11:00:00',
                    contents: '수``업내용 100자이내로 설명11.'
                },
                {
                    index: 2,
                    title: '2회차수업',
                    startDay: '2019-11-16',
                    startTime: '10:00:00',
                    endTime: '11:00:00',
                    contents: '수업내용 100자이내로 설명.22'
                }
            ],
        },
        {
            title: '파파야 교육과정 제목3',
            goal: '파파야 교육과정 목표3',
            course_list: [
                {
                    index: 1,
                    title: '1회차수업',
                    startDay: '2019-11-15',
                    startTime: '10:00:00',
                    endTime: '11:00:00',
                    contents: '수업내용 100자이내로 설명.'
                },
                {
                    index: 2,
                    title: '2회차수업',
                    startDay: '2019-11-16',
                    startTime: '10:00:00',
                    endTime: '11:00:00',
                    contents: '수업내용 100자이내로 설명.'
                },
                {
                    index: 3,
                    title: '3회차수업',
                    startDay: '2019-11-17',
                    startTime: '10:00:00',
                    endTime: '11:00:00',
                    contents: '수업내용 100자이내로 설명.'
                },
                {
                    index: 4,
                    title: '4회차수업',
                    startDay: '2019-11-17',
                    startTime: '10:00:00',
                    endTime: '11:00:00',
                    contents: '수업내용 100자이내로 설명.'
                }
            ],
        },
    ];


    get makeEducationList(): IMakeEducation[] {
        return this.makeEducation;
    }

    // public created() {
    //     this.getMakeEducation();
    // }

    // private getMakeEducation(): void {
    //     MyClassService.getMakeEducation(this.classID).then();
    // }


    private currListNum: number = 0;

    private eduItems: Array< {title: string }>=[];


    /**
     * 교육과정 리스트
     */

    get currListNumModel(): Array< {title: string }>{
        return this.eduItems;
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
}






