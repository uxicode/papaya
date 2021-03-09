import {Vue, Component} from 'vue-property-decorator';
import {IMyClassList} from '@/views/model/my-class.model';
import WithRender from './myClassList.html';

@WithRender
@Component
export default class MyClassList extends Vue {
  private myClassLists: IMyClassList[] = [
    {
      profile_image: require('@/assets/images/bg-icon.png'),
      name: '',
      nickname: '',
      createdAt: 0,
      status: '',
      memberNum: 0,
      isUpdated: true,
      updatedDiffTime: '',
      is_bookmarked: 1,
    },
    /*
    {
        profile_image: require('@/assets/images/bg-icon.png'),
        name: '꿈꾸는 5학년 1반',
        nickname: '파파야초등학교',
        createdAt: 2019,
        status: '비공개클래스',
        memberNum: 2122,
        isUpdated: true,
        updatedDiffTime: '40분 전 업데이트',
        is_bookmarked: 0,
    },
    {
        profile_image: require('@/assets/images/bg-icon.png'),
        name: '꿈꾸는 5학년 1반',
        nickname: '파파야초등학교',
        createdAt: 2019,
        status: '비공개클래스',
        memberNum: 2122,
        isUpdated: true,
        updatedDiffTime: '2시간 전 업데이트',
        is_bookmarked: 1,
    },
    {
        profile_image: require('@/assets/images/bg-icon.png'),
        name: '꿈꾸는 5학년 1반',
        nickname: '파파야초등학교',
        createdAt: 2019,
        status: '비공개클래스',
        memberNum: 2122,
        isUpdated: true,
        updatedDiffTime: '2019.12.11 업데이트',
        is_bookmarked: 0,
    },
    {
        profile_image: require('@/assets/images/bg-icon.png'),
        name: '꿈꾸는 5학년 1반',
        nickname: '파파야초등학교',
        createdAt: 2019,
        status: '비공개클래스',
        memberNum: 2122,
        isUpdated: false,
        updatedDiffTime: '1주일간 업데이트 없음',
        is_bookmarked: 1,
    },
    */
  ];

  //private classItems: IMyClassList[] = [];

  public created() {
    this.getMyClass();
  }

  /**
   * 하트 버튼 토글
   * @public
   */
  public bookmarkToggle(item: any): void {
    item.is_bookmarked = item.is_bookmarked === 0 ? 1 : 0;
  }

  /**
   * 내 클래스 정보 가져오기
   * @public
   */
  public getMyClass(): void {
    //this.$store.getters.getMyClassList;
    /*
    const myClassList = ClassService.getAllMyClass();

    // axios.all 로 처리해도 됨.
    Promise.all( [myClassList] )
        .then( (data: IMyClassList[] ) => {
            this.classItems = data;
        })
        .then(() => {
            //Promise.all 로 처리하면 리턴값이 배열. 즉 별도 매칭이 필요.
            this.classItems.map( ( item: any, idx: number ) => {
                this.myClass[idx].name = item.myclass_list[idx].name;
                this.myClass[idx].is_bookmarked = item.myclass_list[idx].me.is_bookmarked;
                this.myClass[idx].nickname = item.myclass_list[idx].owner.nickname;
                this.myClass[idx].createdAt=
                    item.myclass_list[idx].owner.createdAt.substr(0,4); // 앞 4자리가 연도
                this.myClass[idx].status=
                    item.myclass_list[idx].owner.status === 1 ? '비공개클래스' : '공개클래스';
            });
        });
      */
  }
}
