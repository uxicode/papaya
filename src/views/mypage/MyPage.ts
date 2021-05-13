import {Vue, Component} from 'vue-property-decorator';
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

  private gotoMyPageLink( idx: number ): void {
    this.activeNum=idx;

    this.$router.push('/' + this.myPageListModel[idx].key)
      .then(() => {
        console.log(this.myPageListModel[idx].key + '로 이동됨.');
      });
  }
}
