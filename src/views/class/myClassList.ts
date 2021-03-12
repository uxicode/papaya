import {Vue, Component} from 'vue-property-decorator';
import Btn from '@/components/button/Btn.vue';
import WithRender from './myClassList.html';
import {namespace} from 'vuex-class';
import {IMyClassList} from '@/views/model/my-class.model';
import {IMaybe, INullable} from '@/views/model/init.model';
import { IUserMe} from '@/api/model/user.model';

const Auth = namespace('Auth');
const MyClass = namespace('MyClass');


@WithRender
@Component({
  components:{
    Btn,
  }
})
export default class MyClassList extends Vue {

  private pageCount: number=0;
  private classItems: IMyClassList[]=[];

  @Auth.Getter
  private userInfo!: IUserMe;

  @MyClass.Getter
  private myClassLists!: IMyClassList[];

  @MyClass.Action
  private MYCLASS_LIST_ACTION!: ()=> Promise<IMyClassList[]>;
  //private classItems: IMyClassList[] = [];

  get classItemLists(): IMyClassList[]{
    return this.classItems;
  }

  get originalClassItems(): IMyClassList[] {
    return this.myClassLists;
  }

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
      if (this.myClassLists !== null && this.myClassLists!==undefined) {
        if (this.myClassLists.length > 0) {
          this.getMoreDisplay() ;
        }
      }
    });
  }

  /**
   * 클래스 리스트 뷰
   * this.pageCount 는 더 보기 클릭시 카운팅 하여 paging 처리 한다.
   */
  public getMoreDisplay(): void{
    this.pageCount++;
    const numOfPage=16;
    const end=this.pageCount*numOfPage-1;
    const begin=( (end - numOfPage+1)<0 )? 0 : (end - numOfPage+1);

    // console.log(begin, end);
    //end 가 classItem 개수보다 많을 때 여기서 종료
    if( end>= this.myClassLists.length ){ return; }
    // const cloneItems= [...this.myClassLists];
    const items=this.myClassLists.filter( (item, idx)=> idx>=begin && idx<=end );
    this.classItems=[...this.classItems, ...items];

  }

  public getYears( dateTxt: string ): string{
    return ( String(dateTxt).split('-') )[0];
  }

  public imgNullCheck( value: string ): string{
    return (value===null)? '' : value;
  }

  public updatedDiffDate( dateValue: Date ): void{
    const today = new Date().getTime();
    const updateDate = new Date(dateValue).getTime();
    const calcDate=today-updateDate;
    // console.log(new Date(dateValue));
    console.log(new Date(dateValue), calcDate/ 1000 / 60 / 60 / 24/365 );
  }

  // 트랜지션을 시작할 때 인덱스 * 100 ms 만큼의 딜레이를 적용합니다.
  public beforeEnter(el: HTMLElement) {
    el.style.transitionDelay =100* parseInt( el.dataset.index as string, 10) + 'ms';
  }

  // 트랜지션을 완료하거나 취소할 때는 딜레이를 제거합니다.
  public afterEnter(el: HTMLElement) {
    el.style.transitionDelay = '';
  }


}
