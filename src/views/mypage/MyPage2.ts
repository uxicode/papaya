import {Vue, Component} from 'vue-property-decorator';
import EventBus from '@/store/EventBus';
import NoticeBoard from '@/views/mypage/noticeBoard/NoticeBoard';
import CustomerCenter from '@/views/mypage/customerCenter/CustomerCenter';
import TermsOfService from '@/views/mypage/termsOfService/TermsOfService';
import WithRender from './MyPage2.html';

interface IPageListMenu{
    title: string;
    key: string;
}

@WithRender
@Component({
    components:{
        NoticeBoard,
        CustomerCenter,
        TermsOfService,
    },
})

export default class MyPage2 extends Vue {

    private activeNum: number = 0;

    private myPageList: IPageListMenu[] = [
        {
            title: '공지사항',
            key:'noticeBoard',
        },
        {
            title: '고객센터',
            key:'customerCenter',
        },
        {
            title: '이용약관',
            key:'termsOfService',
        },
    ];

    get myPageListModel(): IPageListMenu[] {
        return this.myPageList;
    }

    public created() {
        this.initializeLeftMenu();
    }

    /**
     * 좌측 메뉴 활성화
     * activeNum의 초기값으로 인해 라우트 경로 값을 받고, 이후에는 header에서 전달받은 EventBus를 통해 변경
     * @private
     */
    private initializeLeftMenu(): void {
        switch (this.$route.path) {
            case '/noticeBoard':
                this.activeNum = 0;
                break;
            case '/customerCenter':
                this.activeNum = 1;
                break;
            case '/termsOfService':
                this.activeNum = 2;
                break;
            default:
                break;
        }
        EventBus.$on('activeLeftMenu', (idx: number) => {
            this.activeNum = idx;
        });
    }

    private gotoMyPageLink( idx: number ): void {
        this.activeNum=idx;
        this.$router.push('/' + this.myPageListModel[idx].key)
            .then(() => {
                console.log(this.myPageListModel[idx].key + '로 이동됨.');
            });
    }

    /**
     * 타이틀 변경
     * @private
     */
    private currentTitle(): string {
        let result;
        switch (this.activeNum) {
            case 0:
                result = '공지사항';
                break;
            case 1:
                result = '고객센터';
                break;
            case 2:
                result = '이용약관';
                break;
            default:
                result = '';
                break;
        }
        return result;
    }
}
