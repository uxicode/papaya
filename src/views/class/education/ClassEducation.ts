import {Vue, Component} from 'vue-property-decorator';
import WithRender from './ClassEducation.html';
import SideMenu from '@/components/sideMenu/sideMenu.vue';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';

interface IcurrNum {
    currNum?: number;
}

@WithRender
@Component({
    components:{
        Modal,
        Btn,
        SideMenu
    }
})

export default class ClassEducation extends Vue {
    private activeMenuNum: number = 4;

    /* Modal 오픈 상태값 */
    private isCreateClass: boolean = false;
    private isClassCurr: boolean = false;
    private isClassCurrDetail: boolean = false;
    private isMoreMenu: boolean = false;

    private update(idx: number): void{
        // console.log(idx);
        this.activeMenuNum=idx;
    }


    private classCurrList: object[] = [
        {
            listTit:'5학년 2학기 수학 교육과정',
            managerLevel: true,
            classAdmin:'김미영선생님',
            classCnt:
                '요즘 여러분 덕분에우리 단원평가 거뜬히 준비하고 있어요.'+
                '거기에 문장제 학습!스쿨수학에 서 빼놓을수 없는 부분인데요. 이럴 때일수록 한 마음을 모아서 꿈꾸는 5학년 1반 여러분과 함께  거기에 문장제 학습!스쿨수학에 서 빼놓을수 없는 부분인데요. 우리 한번 열심히 해보아요.',
            classCurrent:'총 5회차 수업 등록',
            isActive: false
        },
        {
            listTit:'2학기 국어 교육과',
            managerLevel: false,
            classAdmin:'김경희선생님',
            classCnt:'요즘 여러분 덕분에우리 단원평가 거뜬히 준비하고 있어요.' +
                '거기에 문장제 학습!스쿨수학에 서 빼놓을수 없는 부분인데요. 이럴 때일수록 한 마음을 모아서 꿈꾸는 5학년 1반 여러분과 함께  거기에 문장제 학습!스쿨수학에 서 빼놓을수 없는 부분인데요. 우리 한번 열심히 해보아요.' +
                '스쿨수학에 서 빼놓을수 없는 부분인데거기에 문장제 학습!스쿨수학에 서 빼놓을수 없는 부분인데요. 이럴 때일수록 한 마음을 모아서 꿈꾸는 5학년 1반 여러분과 함께  거기에 문장제 학습!스쿨수학에… 빼놓을수 없는 부분인데요.',
            classCurrent:'총 50회차 수업 등록',
            isActive: false
        },
        {
            listTit:'일이삼사오육칠팔구십일이삼사오육칠팔구십',
            managerLevel: true,
            classAdmin:'김경희선생님',
            classCnt:'감사합니다.',
            classCurrent:'총 3회차 수업 등록',
            isActive: false
        },
        {
            listTit:'2학기 국어 교육과',
            managerLevel: false,
            classAdmin:'김경희선생님',
            classCnt:'요즘 여러분 덕분에우리 단원평가 거뜬히 준비하고 있어요.' +
                '거기에 문장제 학습!스쿨수학에 서 빼놓을수 없는 부분인데요. 이럴 때일수록 한 마음을 모아서 꿈꾸는 5학년 1반 여러분과 함께  거기에 문장제 학습!스쿨수학에 서 빼놓을수 없는 부분인데요. 우리 한번 열심히 해보아요.' +
                '스쿨수학에 서 빼놓을수 없는 부분인데거기에 문장제 학습!스쿨수학에 서 빼놓을수 없는 부분인데요. 이럴 때일수록 한 마음을 모아서 꿈꾸는 5학년 1반 여러분과 함께  거기에 문장제 학습!스쿨수학에… 빼놓을수 없는 부분인데요.',
            classCurrent:'총 50회차 수업 등록',
            isActive: false
        },
        {
            listTit:'2학기 국어 교육과',
            managerLevel: true,
            classAdmin:'김경희선생님',
            classCnt:'요즘 여러분 덕분에우리 단원평가 거뜬히 준비하고 있어요.' +
                '거기에 문장제 학습!스쿨수학에 서 빼놓을수 없는 부분인데요. 이럴 때일수록 한 마음을 모아서 꿈꾸는 5학년 1반 여러분과 함께  거기에 문장제 학습!스쿨수학에 서 빼놓을수 없는 부분인데요. 우리 한번 열심히 해보아요.' +
                '스쿨수학에 서 빼놓을수 없는 부분인데거기에 문장제 학습!스쿨수학에 서 빼놓을수 없는 부분인데요. 이럴 때일수록 한 마음을 모아서 꿈꾸는 5학년 1반 여러분과 함께  거기에 문장제 학습!스쿨수학에… 빼놓을수 없는 부분인데요.',
            classCurrent:'총 50회차 수업 등록',
            isActive: false
        },

    ];


    private moreMenuToggle(): void {
        this.isMoreMenu = !this.isMoreMenu;
    }

    private currListNum: IcurrNum = {
        currNum: 10,
    }

}