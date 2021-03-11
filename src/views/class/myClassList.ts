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
      this.$nextTick( ()=>{
        if (this.myClassLists !== null && this.myClassLists!==undefined) {
          this.getMoreDisplay() ;
        }
      });
    });
  }

  public getMoreDisplay(): void{
    this.pageCount++;
    const numOfPage=16;
    const end=this.pageCount*numOfPage-2;
    const begin=( (end - numOfPage+1)<0 )? 0 : (end - numOfPage+1);

    // console.log(begin, end);
    //end 가 classItem 개수보다 많을 때 여기서 종료
    if( end>= this.myClassLists.length ){ return; }
    // const cloneItems= [...this.myClassLists];
    const items=this.myClassLists.filter( (item, idx)=> idx>=begin && idx<=end );
    this.classItems=[...this.classItems, ...items];

    console.log(this.classItems);
  }

  public paginate(arr: object[], size: number, num: number) {
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    return arr.slice( (num - 1) * size, size * num);
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
    // console.log(updateDate);
    // console.log( new Date(dateValue), (today- updateDate )/1000/60/60 )
  }


}
