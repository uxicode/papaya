import {Vue, Component} from 'vue-property-decorator';
import EventBus from '@/store/EventBus';
import MyProfile from '@/views/mypage/myProfile/MyProfile';
import Bookmark from '@/views/mypage/bookmark/Bookmark';
import WithRender from './MyPage.html';

interface IPageListMenu{
  title: string;
  icon: string;
  key: string;
}

@WithRender
@Component({
    components:{
        MyProfile,
        Bookmark,
    },
})

export default class MyPage extends Vue {

  private activeNum: number = 0;

  private myPageList: IPageListMenu[] = [
    {
      title: 'MY프로필',
      icon: require('@/assets/images/mypage.svg'),
      key:'myProfile',
    },
    {
      title: '보관함',
      icon: require('@/assets/images/bookmark-outline.svg'),
      key:'bookmark',
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
      case '/myProfile':
        this.activeNum = 0;
        break;
      case '/bookmark':
        this.activeNum = 1;
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
}
