import {Vue, Component} from 'vue-property-decorator';
import WithRender from './myClassList.html';
import {namespace} from 'vuex-class';
import {IMyClassList} from '@/views/model/my-class.model';
import { IUserMe} from '@/api/model/user.model';

const Auth = namespace('Auth');
const MyClass = namespace('MyClass');

@WithRender
@Component
export default class MyClassList extends Vue {

  @Auth.Getter
  public userInfo!: IUserMe;

  @MyClass.Getter
  private myClassLists: IMyClassList[] | undefined;

  @MyClass.Action
  private MYCLASS_LIST_ACTION!: ()=> Promise<IMyClassList>;
  //private classItems: IMyClassList[] = [];

  get userName(): string {
    // console.log( 'this.userInfo=', this.userInfo );
    return ( this.userInfo as IUserMe).fullname;
  }

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

    this.MYCLASS_LIST_ACTION().then(() =>{
      console.log(this.myClassLists);
    });
    //this.$store.getters.getMyClassList;
   /* const myClassList = ClassService.getAllMyClass();

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
        });*/
  }


}
