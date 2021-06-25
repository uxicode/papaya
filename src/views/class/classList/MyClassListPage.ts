import {Component, Mixins, Vue} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import { getAllPromise } from '@/types/types';
import {CLASS_BASE_URL} from '@/api/base';
import { IMyClassList, ClassEachInfo} from '@/views/model/my-class.model';
import {IUserMe} from '@/api/model/user.model';
import MyClassService from '@/api/service/MyClassService';
import MyClassListView from '@/views/class/classList/MyClassListView';
import WithRender from './MyClassListPage.html';
import {MYCLASS_LIST} from '@/store/mutation-class-types';
import PagingMixins from '@/mixin/PagingMixins';

const Auth = namespace('Auth');
const MyClass = namespace('MyClass');



@WithRender
@Component({
  components:{
    MyClassListView
  }
})
export default class MyClassListPage extends Mixins(PagingMixins) {

  //start : 변수 선언부 ================================================
  public numOfPage: number=12; // 더보기 클릭 > 불러올 카드 리스트 개수
  public pageCount: number=0; // 페이징
  // public dummyData: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  public startNum: number =0;
  public endNum: number =0;

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
  // private moreInfos: IClassMember[]=[];
  private moreInfos: ClassEachInfo[]=[];

  @Auth.Getter
  private userInfo!: IUserMe;

  @MyClass.Getter
  private myClassLists!: IMyClassList[];

  @MyClass.Getter
  private classID!: number;

  @MyClass.Action
  private MYCLASS_LIST_ACTION!: ()=> Promise<IMyClassList[]>;

  @MyClass.Action
  private MYCLASS_HOME!: ( id: string | number ) => Promise<any>;
  //end : 변수 선언부 ================================================


  //start : get method ================================================
  get classIdModel() {
    return this.classID;
  }

  get classListMoreInfos(): ClassEachInfo[] {
    return this.moreInfos;
  }
  get originalClassItems(): IMyClassList[] {
    return this.myClassLists;
  }

  get classItemLists(): IMyClassList[]{
    return this.classItems;
  }

  get userName(): string {
    return ( this.userInfo )? ( this.userInfo as IUserMe).fullname : '';
  }

  get totalCount(): number{
    return this.originalClassItems.length;
  }
  //end : get method ================================================

 //start : public ================================================
  public created() {
    this.getMyClass();
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
 //end : public ================================================

  /**
   * 내 클래스 정보 가져오기
   * @private
   */
  private getMyClass(): void {
    this.MYCLASS_LIST_ACTION().then(() =>{
      if (this.myClassLists !== null && this.myClassLists!==undefined) {
        if (this.myClassLists.length > 0) {
          console.log(this.myClassLists);
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
    this.getUpdateList();
  }




  private getUpdateList(): void{
    //범위 설정.
    const {begin, end} = this.rangeOfCount();

    // console.log(begin, end);
    this.startNum=begin;
    this.endNum=end;

    // console.log(begin, end);
    //총 페이지 카운트
    const totalPageCount=this.getTotalPageCount({total: this.totalCount, numOfPage: this.numOfPage});
    //페이지 카운트 구하기
    const pageItems = this.getPageNum({ totalPageCount, pageSize: totalPageCount, curPageNum: 1});
    // console.log('num=', num, num[this.pageCount]*this.numOfPage );

    //마지막 페이지 카운트
    const lastPageNum = pageItems[pageItems.length - 1];
    // console.log(lastPageNum,  this.totalCount );
    // console.log( this.endNum, this.totalCount );

    //마지막 범위 숫자가 총 개수 보다 크지 않으면 카드리스트를 생성시킴.
    if( this.endNum<= this.totalCount){
      this.createClassCardList({begin, end});
      ++this.pageCount;
    }else{
      this.endNum=this.totalCount;
      this.pageCount=lastPageNum;

      if (this.totalCount > 0) {
        this.createClassCardList({begin, end});
      }

    }

  }

  /**
   * 멤버가 가입한 클래스 뷰 카드 리스트  생성.
   * @param range
   * @private
   */
  private createClassCardList(range: { begin: number, end: number }) {
    const {begin, end}=range;
    this.findMemberRange( begin, end ).then(( data )=>{
      this.classItems=[...this.classItems, ...data];
    });
  }

  /**
   * 지정된 범위 만큼 클래스 목록 추가
   * @param begin
   * @param end
   * @private
   */
  private async findMemberRange( begin: number, end: number ){
    //현재 api 에서 클래스 멤버 전체 조회시 500개이상 이더라도
    //페이징에 대한 쿼리스트링 전달이 없기에 별도로 프론트에서 페이징처리
    const items = await this.getMemberRange(begin, end);
    //전체 조회 api 에서 공개 /비공개에 대한 값과 멤버수 등 항목이 없기에 개별 클래스 조회 api 통신해야 한다.
    // 즉  pagination 1개에 16개씩 노출이라서 전체 api 통신 후 16번의 개별 통신을 다시 해야 한다.
    //개별 조회 api promise 를 배열에 담아둔다.
    const promiseData= await this.getFindMemberByRange( items );

    //배열에 담아둔 promise 들을 promise.all 로 조회
    await this.getDataByMemberRange( promiseData );

    return items;
  }

  /**
   * 페이징 카운트 범위
   * @private
   */
  private rangeOfCount(): { begin: number, end: number} {

    let pageNumByTotalCount= Math.ceil(this.totalCount / this.numOfPage );

    if (this.totalCount % this.numOfPage > 0) {
      pageNumByTotalCount++;
    }


    //현재 페이지가 pageCount와 같을 때를 유의하며 (page-1)을 하고
     // +1은 첫페이지가 0이나 10이 아니라 1이나 11로 하기 위함임
    let begin: number;

    // -1은 첫페이지가 1이나 11 등과 같을때 1~10, 11~20으로 지정하기 위함임
    let end: number ;


    if( this.pageCount===0 ){
      begin=0;
      end=this.numOfPage-2;
    }else{
      begin=this.pageCount*this.numOfPage-1;
      end = (this.pageCount*this.numOfPage)+this.numOfPage-2;
    }
    // console.log('begin=', begin, 'end=', end);

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
   *  member_count ( 멤버수 )/ is_private ( 공개/비공개 )
   * @param promiseItems
   * @private
   */
  private getDataByMemberRange( promiseItems: any[] ){
    // console.log('third');
    //Promise.all 의 타입버전
    getAllPromise( promiseItems ).then( ( data: any )=>{
      // console.log(data.length);
      //member_count ( 멤버수 )/ is_private ( 공개/비공개 )
      const member=data.map( (item: any ) => {
        return {
          member_count:item.classinfo.member_count,
          is_private:item.classinfo.is_private,
          image_url:item.classinfo.image_url,
          g_name: item.classinfo.g_name,
          me: item.classinfo.me
        };
      });
      this.moreInfos = [...this.moreInfos, ...member];
    }).catch((error)=>{
      console.log('class more info error', error );
    });
  }



  private updateBookmark( payload: {classId: number,  memberId: number, nickname: string, bookmarkValue: number } ): void {
    MyClassService.setClassBookmark(
      payload.classId,
      payload.memberId, {
        nickname: payload.nickname,
        is_bookmarked: payload.bookmarkValue
      }).then((data: ClassEachInfo) => {
      // console.log(data);
       /*
       * {
          "is_bookmarked": true,
          "nickname": "홍길동",
          "message": "성공 - 수정 완료."
        }
       * */

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
  /**
   * 클래스 홈 ( 디테일 페이지 ) 보기
   * @param id - store 에 저장된 class id
   * @private
   */
  private gotoClassListDetailView( id: string | number ): void{
       this.MYCLASS_HOME(id).then((data)=>{
         this.$router.push({path: `${CLASS_BASE_URL}/${id}`})
           .then(( )=>{
             // console.log(this.classID, ':: 해당 클래스 홈 이동');
             // console.log('MYCLASS_HOME 호출후 this.classID = ', this.classID, localStorage.getItem('classId'), this.classIdModel );
           });
       });
  }



}
