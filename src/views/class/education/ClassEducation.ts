import {Component, Vue} from 'vue-property-decorator';

import SideMenu from '@/components/sideMenu/sideMenu.vue';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import {IClassInfo} from '@/views/model/my-class.model';
import {namespace} from 'vuex-class';
import {Utils} from '@/utils/utils';
import WithRender from './ClassEducation.html';

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

export default class ClassEducation extends Vue {
    @MyClass.Getter
    private myClassHomeModel!: IClassInfo;

    /* Modal 오픈 상태값 */
    private isCreateClass: boolean = false;
    private isClassCurr: boolean = false;
    private isClassCurrMore: boolean = false;
    private isClassCurrDetail: boolean = false;
    private isMoreMenu: boolean = false;

    private countNumber: number = 0;

    private classCardIndex: number = 0;
    private classCurrIndex: number = 0;

    private classCurrList: object[] = [
        {
            listTit:'5학년 2학기 수학 교육과정',
            managerLevel: true,
            classAdmin:'김미영선생님',
            classCnt:
                '요즘 여러분 덕분에우리 단원평가 거뜬히 준비하고 있어요.'+
                '거기에 문장제 학습!스쿨수학에 서 빼놓을수 없는 부분인데요. 이럴 때일수록 한 마음을 모아서 꿈꾸는 5학년 1반 여러분과 함께  거기에 문장제 학습!스쿨수학에 서 빼놓을수 없는 부분인데요. 우리 한번 열심히 해보아요.',
            classCurrent:'총 5회차 수업 등록',
            isActive: false,
        },
        {
            listTit:'2학기 국어 교육과',
            managerLevel: false,
            classAdmin:'김경희선생님',
            classCnt:'요즘 여러분 덕분에우리 단원평가 거뜬히 준비하고 있어요.' +
                '거기에 문장제 학습!스쿨수학에 서 빼놓을수 없는 부분인데요. 이럴 때일수록 한 마음을 모아서 꿈꾸는 5학년 1반 여러분과 함께  거기에 문장제 학습!스쿨수학에 서 빼놓을수 없는 부분인데요. 우리 한번 열심히 해보아요.' +
                '스쿨수학에 서 빼놓을수 없는 부분인데거기에 문장제 학습!스쿨수학에 서 빼놓을수 없는 부분인데요. 이럴 때일수록 한 마음을 모아서 꿈꾸는 5학년 1반 여러분과 함께  거기에 문장제 학습!스쿨수학에… 빼놓을수 없는 부분인데요.',
            classCurrent:'총 50회차 수업 등록',
            isActive: false,
        },
        {
            listTit:'일이삼사오육칠팔구십일이삼사오육칠팔구십',
            managerLevel: true,
            classAdmin:'김경희선생님1',
            classCnt:'감사합니다.',
            classCurrent:'총 3회차 수업 등록',
            isActive: false,
        },
        {
            listTit:'2학기 국어 교육과',
            managerLevel: false,
            classAdmin:'김경희선생님2',
            classCnt:'요즘 여러분 덕분에우리 단원평가 거뜬히 준비하고 있어요.' +
                '거기에 문장제 학습!스쿨수학에 서 빼놓을수 없는 부분인데요. 이럴 때일수록 한 마음을 모아서 꿈꾸는 5학년 1반 여러분과 함께  거기에 문장제 학습!스쿨수학에 서 빼놓을수 없는 부분인데요. 우리 한번 열심히 해보아요.' +
                '스쿨수학에 서 빼놓을수 없는 부분인데거기에 문장제 학습!스쿨수학에 서 빼놓을수 없는 부분인데요. 이럴 때일수록 한 마음을 모아서 꿈꾸는 5학년 1반 여러분과 함께  거기에 문장제 학습!스쿨수학에… 빼놓을수 없는 부분인데요.',
            classCurrent:'총 50회차 수업 등록',
            isActive: false,
        },
        {
            listTit:'2학기 국어 교육과',
            managerLevel: true,
            classAdmin:'김경희선생님3',
            classCnt:'요즘 여러분 덕분에우리 단원평가 거뜬히 준비하고 있어요.' +
                '거기에 문장제 학습!스쿨수학에 서 빼놓을수 없는 부분인데요. 이럴 때일수록 한 마음을 모아서 꿈꾸는 5학년 1반 여러분과 함께  거기에 문장제 학습!스쿨수학에 서 빼놓을수 없는 부분인데요. 우리 한번 열심히 해보아요.' +
                '스쿨수학에 서 빼놓을수 없는 부분인데거기에 문장제 학습!스쿨수학에 서 빼놓을수 없는 부분인데요. 이럴 때일수록 한 마음을 모아서 꿈꾸는 5학년 1반 여러분과 함께  거기에 문장제 학습!스쿨수학에… 빼놓을수 없는 부분인데요.',
            classCurrent:'총 50회차 수업 등록',
            isActive: false,
        },
    ];

    private classCurrDetail: object[] = [
        {
            classList:[
                {
                    index: '1',
                    currTit:'4단원 복습',
                    currDate:'2019. 9. 1 월요일',
                    currTime:'오전 10시 ~ 11시',
                    currImg: '이미지 3',
                    currFile: '파일 1',
                    fileList: [
                        {
                            fileTit:'testFile1.pdf'
                        },
                        {
                            fileTit:'testFile2.hwp'
                        }
                    ],
                    imgFile:[
                        {
                            imgUrl:'@/assets/images/pic.png'
                        },
                        {
                            imgUrl:'@/assets/images/pic2.png'
                        },
                        {
                            imgUrl:'@/assets/images/pic3.png'
                        },
                    ]
                },
                {
                    index: '2',
                    currTit:'5단원 복습 - 소수의 곱셈과 나눗셈',
                    currDate:'2019. 9. 2 화요일',
                    currTime:'오전 10시 ~ 11시',
                    currFile: '파일 1',
                    fileList: [
                        {
                            fileTit:'testFile1.pdf'
                        },
                        {
                            fileTit:'testFile2.hwp'
                        }
                    ],
                },
                {
                    index: '3',
                    currTit:'6단원 - 학습',
                    currDate:'2019. 9. 3 수요일',
                    currTime:'오전 10시 ~ 11시',
                },
                {
                    index: '4',
                    currTit:'7단원 - 일차방정식',
                    currDate:'2019. 9. 4 목요일',
                    currTime:'오전 10시 ~ 11시',
                    currImg: '이미지 3',
                    currFile: '파일 1',
                    fileList: [
                        {
                            fileTit:'testFile1.pdf'
                        },
                        {
                            fileTit:'testFile2.hwp'
                        }
                    ],
                    imgFile:[
                        {
                            imgUrl:'@/assets/images/pic.png'
                        },
                        {
                            imgUrl:'@/assets/images/pic2.png'
                        },
                        {
                            imgUrl:'@/assets/images/pic3.png'
                        },
                    ]
                },
                {
                    index: '5',
                    currTit:'8단원 복습',
                    currDate:'2019. 9. 5 금요일',
                    currTime:'오전 10시 ~ 11시',
                }
            ]
        },
        {
            classList: [
                {
                    index: '1',
                    currTit:'1단원 - 학습',
                    currDate:'2019. 9. 1 월요일',
                    currTime:'오전 10시 ~ 11시',
                    currImg: '이미지 3',
                    currFile: '파일 1',
                    fileList:[
                        {
                            fileTit:'6학년 2학기 국어 II 3단원 .pdf'
                        },
                        {
                            fileTit:'국어 II 3단원 정리 .hwp'
                        },
                        {
                            fileTit:'국어 I 개념 정리.pdf'
                        }
                    ]
                },
                {
                    index: '2',
                    currTit:'2단원 - 학습',
                    currDate:'2019. 9. 2 화요일',
                    currTime:'오전 10시 ~ 11시',
                    currFile: '파일 1',
                    fileList:[
                        {
                            fileTit:'6학년 2학기 국어 II 3단원 .pdf'
                        },
                        {
                            fileTit:'국어 II 3단원 정리 .hwp'
                        },
                        {
                            fileTit:'국어 I 개념 정리.pdf'
                        }
                    ]
                },
                {
                    index: '3',
                    currTit:'3단원 - 학습',
                    currDate:'2019. 9. 3 수요일',
                    currTime:'오전 10시 ~ 11시',
                },
                {
                    index: '4',
                    currTit:'4단원 - 학습',
                    currDate:'2019. 9. 4 목요일',
                    currTime:'오전 10시 ~ 11시',
                    currImg: '이미지 2',
                    currFile: '파일 1',
                    fileList:[
                        {
                            fileTit:'6학년 2학기 국어 II 3단원 .pdf'
                        },
                        {
                            fileTit:'국어 II 3단원 정리 .hwp'
                        },
                        {
                            fileTit:'국어 I 개념 정리.pdf'
                        }
                    ]
                },
                {
                    index: '5',
                    currTit:'5단원 - 학습',
                    currDate:'2019. 9. 5 금요일',
                    currTime:'오전 10시 ~ 11시',
                }
            ]
        },
        {
            classList: [
                {
                    index: '1',
                    currTit:'9단원 - 학습',
                    currDate:'2019. 9. 1 월요일',
                    currTime:'오전 10시 ~ 11시',
                    currImg: '이미지 2',
                    currFile: '파일 1'
                },
                {
                    index: '2',
                    currTit:'9단원 - 복습',
                    currDate:'2019. 9. 2 화요일',
                    currTime:'오전 10시 ~ 11시',
                    currFile: '파일 1'
                },
                {
                    index: '3',
                    currTit:'10단원 - 학습',
                    currDate:'2019. 9. 3 수요일',
                    currTime:'오전 10시 ~ 11시',
                },
                {
                    index: '4',
                    currTit:'10단원 - 복습',
                    currDate:'2019. 9. 4 목요일',
                    currTime:'오전 10시 ~ 11시',
                    currImg: '이미지 2',
                    currFile: '파일 1'
                },
                {
                    index: '5',
                    currTit:'11단원 - 학습',
                    currDate:'2019. 9. 5 금요일',
                    currTime:'오전 10시 ~ 11시',
                }
            ]
        },
        {
            classList: [
                {
                    index: '1',
                    currTit:'10단원 - 학습',
                    currDate:'2019. 9. 1 월요일',
                    currTime:'오전 10시 ~ 11시',
                    currImg: '이미지 2',
                    currFile: '파일 1'
                },
                {
                    index: '2',
                    currTit:'10단원 - 복습',
                    currDate:'2019. 9. 2 화요일',
                    currTime:'오전 10시 ~ 11시',
                    currFile: '파일 1'
                },
                {
                    index: '3',
                    currTit:'11단원 - 학습',
                    currDate:'2019. 9. 3 수요일',
                    currTime:'오전 10시 ~ 11시',
                },
                {
                    index: '4',
                    currTit:'11단원 - 복습',
                    currDate:'2019. 9. 4 목요일',
                    currTime:'오전 10시 ~ 11시',
                    currImg: '이미지 2',
                    currFile: '파일 1'
                },
                {
                    index: '5',
                    currTit:'12단원 - 학습',
                    currDate:'2019. 9. 5 금요일',
                    currTime:'오전 10시 ~ 11시',
                }
            ]
        },
        {
            classList: [
                {
                    index: '1',
                    currTit:'20단원 - 학습',
                    currDate:'2019. 9. 1 월요일',
                    currTime:'오전 10시 ~ 11시',
                    currImg: '이미지 2',
                    currFile: '파일 1'
                },
                {
                    index: '2',
                    currTit:'20단원 - 학습',
                    currDate:'2019. 9. 2 화요일',
                    currTime:'오전 10시 ~ 11시',
                    currFile: '파일 1'
                },
                {
                    index: '3',
                    currTit:'21단원 - 학습',
                    currDate:'2019. 9. 3 수요일',
                    currTime:'오전 10시 ~ 11시',
                },
                {
                    index: '4',
                    currTit:'21단원 - 복습',
                    currDate:'2019. 9. 4 목요일',
                    currTime:'오전 10시 ~ 11시',
                    currImg: '이미지 2',
                    currFile: '파일 1'
                },
                {
                    index: '5',
                    currTit:'22단원 - 학습',
                    currDate:'2019. 9. 5 금요일',
                    currTime:'오전 10시 ~ 11시',
                }
            ]
        }


    ];



    /*start: 추가 테스트*/
    //datepicker
    private startDatePickerModel: string= new Date().toISOString().substr(0, 10);
    private startTimeSelectModel: ITimeModel={ apm:'오전', hour:'12', minute: '30'};
    private startDateMenu: boolean= false; // 캘린 셀렉트 열고 닫게 하는 toggle 변수
    private startTimeMenu: boolean=false;  // 시간 셀렉트 열고 닫게 하는 toggle 변수
    private endTimeSelectModel: ITimeModel={ apm:'오전', hour:'12', minute: '30'};
    private endTimeMenu: boolean=false;  // 시간 셀렉트 열고 닫게 하는 toggle 변수

    /*end: 추가 테스트*/




    private currListNum: number = 0;

    private eduItems: Array< {title: string }>=[];


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


    /*start: 추가 테스트*/
    get currentStartTimeModel(): string{
        return `${this.startTimeSelectModel.apm} ${this.startTimeSelectModel.hour}시 ${this.startTimeSelectModel.minute} 분`;
    }

    get currentEndTimeModel(): string{
        return `${this.endTimeSelectModel.apm} ${this.endTimeSelectModel.hour}시 ${this.endTimeSelectModel.minute} 분`;
    }
    /*end: 추가 테스트*/




    /*start: 추가 테스트*/





    /*end: 추가 테스트*/















}





