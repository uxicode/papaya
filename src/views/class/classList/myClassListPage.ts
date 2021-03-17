import {Component, Vue} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import { IClassMember, IMyClassList} from '@/views/model/my-class.model';
import {IUserMe} from '@/api/model/user.model';
import MyClassService from '@/api/service/MyClassService';
import {getAllPromise} from '@/views/model/types';
import WithRender from './myClassListPage.html';
import MyClassListView from '@/views/class/classList/myClassListView';

const Auth = namespace('Auth');
const MyClass = namespace('MyClass');

@WithRender
@Component({
  components:{
    MyClassListView //child
  }
})
export default class MyClassList extends Vue {

  //start : 변수 선언부 ================================================
  private pageCount: number=0; // 페이징
  private numOfPage: number=12; // 더보기 클릭 > 불러올 카드 리스트 개수

  //첫번째 배너가 데이터가 아닌 새로운 모임방(클래스)을 생성하는 배너이기에 디폴트 값이 있는 것을 첫 인덱스로 채워둔다.
  private classItems: IMyClassList[]=[
    {
      id: 0,
      name: '',
      me: {
        id:0,
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
  private moreInfos: IClassMember[]=[];

  @Auth.Getter
  private userInfo!: IUserMe;

  @MyClass.Getter
  private myClassLists!: IMyClassList[];

  @MyClass.Action
  private MYCLASS_LIST_ACTION!: ()=> Promise<IMyClassList[]>;
  //end : 변수 선언부 ================================================


  //start : get method ================================================
  get classListMoreInfos():  IClassMember[]{
    return this.moreInfos;
  }

  public setClassItemLists(): void{
    this.classItems = [
      {
        id: 0,
        name: '',
        me: {
          id:0,
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
  }

  get originalClassItems(): IMyClassList[] {
    return this.myClassLists;
  }

  get classItemLists(): IMyClassList[]{
    return this.classItems;
  }

  get userName(): string {
    return ( this.userInfo as IUserMe).fullname;
  }
  //end : get method ================================================

 //start : public ================================================
  public created() {
    this.getMyClass();
  }
 //end : public ================================================

  /**
   * 내 클래스 정보 가져오기
   * @private
   */
  private getMyClass(): void {
    this.MYCLASS_LIST_ACTION().then(() =>{
      if (this.myClassLists !== null && this.myClassLists!==undefined) {
        if (this.myClassLists.length > 0) {
          this.getUpdateList();
        }
      }
    });
  }

  private resetClassLists(): void {
    // this.pageCount=0;
    this.setClassItemLists();
  }

  /**
   * 클래스 리스트 뷰
   * this.pageCount 는 더 보기 클릭시 카운팅 하여 paging 처리 한다.
   */
  private getMoreDisplay(): void{
    ++this.pageCount;
    this.getUpdateList();
  }

  /**
   * 페이징 카운트 범위
   * @private
   */
  private rangeOfCount(): { begin: number, end: number} {
    let begin: number;
    let end: number;

    if( this.pageCount===0 ){
      begin=0;
      end=this.numOfPage-2;
    }else{
      begin=this.pageCount*this.numOfPage;
      end = (this.pageCount*this.numOfPage)+this.numOfPage-1;
    }
    return {
      begin,
      end
    };
  }

  /**
   * myClassLists( 내가 가입한 클래스 목록 데이터 원본 ) 에서 주어진 카운팅에 의해 해당 범위에 있는 멤버를 가져오기.
   * @param begin
   * @param end
   * @private
   */
  private getMemberRange( begin: number, end: number ): IMyClassList[]{
    // console.log('first');
    return this.myClassLists.filter( (item: IMyClassList, idx: number)=> idx>=begin && idx<=end );
  }

  /**
   * 전체 api 에 member_count ( 멤버수 )/ is_private ( 공개/비공개 ) 가 없고 개별 아이템 조회에는 존재하기에 별도의 개별 조회를 한다.
   * @param items
   * @private
   */
  private getFindMemberByRange( items: IMyClassList[] ): any[]{
    // console.log('second');
    const promiseItems: any[]=[];
    items.forEach( (item: IMyClassList)=>{
      promiseItems.push( MyClassService.getClassInfoById( item.me.class_id) );
    });

    return promiseItems;
  }

  /**
   *
   * @param promiseItems
   * @private
   */
  private getDataByMemberRange( promiseItems: any[] ){
    // console.log('third');
    getAllPromise( promiseItems ).then( ( data: any )=>{
      // console.log(data.length);
      //member_count ( 멤버수 )/ is_private ( 공개/비공개 )
      this.moreInfos=data.map( (item: any ) => {
        return {
          member_count:item.classinfo.member_count,
          is_private:item.classinfo.is_private
        };
      });
    }).catch((error)=>{
      console.log('class more info error', error );
    });
  }

  private async findMemberRange( begin: number, end: number ){
    //현재 api 에서 클래스 멤버 전체 조회시 500개이상 이더라도
    //페이징에 대한 쿼리스트링 전달이 없기에 별도로 프론트에서 페이징처리
    const items = await this.getMemberRange(begin, end);
    //전체 조회 api 에서 공개 /비공개에 대한 값과 멤버수 등 항목이 없기에 개별 클래스 조회 api 통신해야 한다.
    // 즉  pagination 1개에 16개씩 노출이라서 전체 api 통신 후 16번의 개별 통신을 다시 해야 한다.
    const promiseData= await this.getFindMemberByRange( items );
    await this.getDataByMemberRange( promiseData );

    return items;
  }

   private getUpdateList(): void{
    //범위 설정.
    const {begin, end} = this.rangeOfCount();
    // console.log(begin, end);
    //end 가 classItem 개수보다 많을 때 여기서 종료
    if( end>= this.myClassLists.length ){ return; }

    this.findMemberRange( begin, end ).then(( data )=>{
      this.classItems=[...this.classItems, ...data];
    });
  }

  private updateBookmark( payload: {classId: number,  memberId: number, nickname: string, bookmarkValue: number } ): void {
    MyClassService.setClassBookmark(
      payload.classId,
      payload.memberId, {
        nickname: payload.nickname,
        is_bookmarked: payload.bookmarkValue
      }).then((data: IClassMember) => {
        //북마크 하려 클릭한 것 class_id 를 대조해 봐서 index 값 구한다.
      /*const findIndex = this.classItems.findIndex((item: IMyClassList) => item.me.class_id === payload.classId);

      this.MYCLASS_LIST_ACTION().then(() => {
        if (this.myClassLists !== null && this.myClassLists !== undefined) {
          if (this.myClassLists.length > 0) {
            this.classItems = [
              ...this.classItems.slice(0, findIndex),
              this.classItems[findIndex],
              ...this.classItems.slice(findIndex + 1, this.classItems.length)
            ];
          }
        }
      });*/
    });
  }

  private moreClickEventHandler(): void {
    this.getMoreDisplay();
  }



}
