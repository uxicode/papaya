import {Vue, Component, Prop} from 'vue-property-decorator';
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

    private gotoMyPageLink( idx: number ): void {
        this.activeNum=idx;

        this.$router.push('/' + this.myPageListModel[idx].key)
            .then(() => {
                console.log(this.myPageListModel[idx].key + '로 이동됨.');
            });
    }
}
