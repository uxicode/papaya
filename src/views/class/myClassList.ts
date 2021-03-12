import {Component, Vue} from 'vue-property-decorator';
import Btn from '@/components/button/Btn.vue';
import WithRender from './myClassList.html';
import {namespace} from 'vuex-class';
import {IClassInfo, IMyClassList} from '@/views/model/my-class.model';
import {IUserMe} from '@/api/model/user.model';
import {Utils} from '@/utils/utils';
import MyClassService from '@/api/service/MyClassService';

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
  private numOfPage: number=11;

  //첫번째 배너가 데이터가 아닌 새로운 모임방(클래스)을 생성하는 배너이기에 디폴트 값이 있는 것을 첫 인덱스로 채워둔다.
  private classItems: IMyClassList[]=[
    {
      id: 0,
      name: '',
      me: {
        joinedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        class_id: 0,
        user_id: 0,
        nickname:'',
        profile_image:undefined,
        is_bookmarked:0,
        schedule_color:0,
        level:  0,
        status: 0,
        open_level_id:0,
        open_level_mobileno:0,
        open_level_email: 0,
        onoff_push_noti: 0,
        onoff_post_noti: 0,
        onoff_comment_noti:0,
        onoff_schedule_noti:0,
        schedule_noti_intime:0,
        visited: 0,
      }
    }
  ];
  private moreInfos: IClassInfo[]=[];

  @Auth.Getter
  private userInfo!: IUserMe;

  @MyClass.Getter
  private myClassLists!: IMyClassList[];

  @MyClass.Action
  private MYCLASS_LIST_ACTION!: ()=> Promise<IMyClassList[]>;

  get classItemLists(): IMyClassList[]{
    return this.classItems;
  }

  get originalClassItems(): IMyClassList[] {
    return this.myClassLists;
  }

  get userName(): string {
    return ( this.userInfo as IUserMe).fullname;
  }

  get classMoreInfos(): IClassInfo[] {
    return this.moreInfos;
  }

  public created() {
    this.getMyClass();
  }

  public getYears( dateTxt: string ): string{
    return ( String(dateTxt).split('-') )[0];
  }

  public nullCheck(value: string ): string{
    return (value===null)? '' : value;
  }

  public calcDate(dateValue: Date): number[] {
    const today = Date.now();
    const updateDate = new Date(dateValue);
    const updateDateTime=updateDate.getTime();
    const calcDate=today - updateDateTime;
    const msOfDay = 24*60*60*1000;
    const msOfHour = 60*60*1000;
    const msOfMin = 60*1000;
    // console.log(new Date(dateValue));
    //, new Date(dateValue), calcDate/ 1000 / 60 / 60 / 24/365

    const calcDay: number = Math.floor( calcDate / msOfDay );
    const calcHour: number =( calcDay>7 )? Math.floor( calcDate / msOfMin ) : Math.floor((calcDate%msOfDay) / msOfHour );
    const calcMin: number =( calcDay>7 )? Math.floor( calcDate / msOfHour ) : Math.floor((calcDate %msOfHour) /msOfMin );

    // const calcMonth = Math.floor( calcDate / (msOfDay * 30) );
    // const calcYear = Math.floor( calcDate / (msOfDay * 30 * 12));
    // calcYear=(calcYear>0)? new Date(dateValue).getFullYear() : 0;
    // calcMonth=(calcMonth>12)? calcMonth-12 : calcMonth;
    // console.log(today, '일수 차이=', calcDay, '월수 차이=', calcMonth, '년수차이=', calcYear, result );
    return [ calcDay,  calcHour, calcMin ];
  }
  public updatedDiffDate( dateValue: Date ): string{
    const resultDate=this.calcDate(dateValue);

    return ( resultDate[0]>7 )? Utils.getTodayParseFormat( new Date(dateValue) ) : resultDate[1]+'시 '+resultDate[2]+'분 전';
  }

  public isPostUpdate( dateValue: Date ) {
    const resultDate=this.calcDate(dateValue);
    return ( resultDate[0] <=7 );
  }

  // 트랜지션을 시작할 때 인덱스 * 100 ms 만큼의 딜레이를 적용합니다.
  public beforeEnter(el: HTMLElement): void {
    el.style.transitionDelay =100* parseInt( el.dataset.index as string, 10) + 'ms';
  }

  // 트랜지션을 완료하거나 취소할 때는 딜레이를 제거합니다.
  public afterEnter(el: HTMLElement): void{
    el.style.transitionDelay = '';
  }
  /**
   * 하트 버튼 토글
   * @private
   */
  private bookmarkToggle(item: any): void {
    item.is_bookmarked = item.is_bookmarked === 0 ? 1 : 0;
  }

  /**
   * 내 클래스 정보 가져오기
   * @private
   */
  private getMyClass(): void {
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
  private getMoreDisplay(): void{

    this.pageCount++;
    // const countTotal=this.pageCount*this.numOfPage;
    // console.log( this.pageCount );
    const end=this.pageCount*this.numOfPage;
    const begin=(this.pageCount===1)? 0 : end - this.numOfPage+1;

    // console.log(this.pageCount, begin, end);
    //end 가 classItem 개수보다 많을 때 여기서 종료
    if( end>= this.myClassLists.length ){ return; }

    //현재 api 에서 클래스 멤버 전체 조회시 500개이상 이더라도
    //페이징에 대한 쿼리스트링 전달이 없기에 별도로 프론트에서 페이징처리
    const items=this.myClassLists.filter( (item, idx)=> idx>=begin && idx<=end );

    const memberInfos: any[]=[];

   //전체 조회 api 에서 공개 /비공개에 대한 값과 멤버수 등 항목이 없기에 개별 클래스 조회 api 통신해야 한다.
    // 즉  pagination 1개에 16개씩 노출이라서 전체 api 통신 후 16번의 개별 통신을 다시 해야 한다.
    items.forEach( (item)=>{
      // console.log( item.me.class_id );
      memberInfos.push( MyClassService.getClassInfoById( item.me.class_id) );
    });

    const getAllPromise = <T>( promises: Array< Promise<T>>) => Promise.all(promises);

    getAllPromise( memberInfos ).then( ( data: any )=>{
      console.log( data );
      data.forEach( (item: any) =>{
        console.log( item.classinfo.member_count, item.classinfo.is_private );

        this.moreInfos.push({
          member_count:item.classinfo.member_count,
          is_private:item.classinfo.is_private
        });
        /*this.moreInfos.push({
          member_count:item.classinfo.member_count,
          is_private:item.classinfo.is_private
        });*/
      });
    }).catch((error)=>{
      console.log('class more info error', error );
    });
    // console.log(items);
    this.classItems=[...this.classItems, ...items];

  }


  private getClassPrivateById( idx: number ): string{
    return !this.classMoreInfos[idx - 1].is_private ? '비공개' : '공개';
  }

}
