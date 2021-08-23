import {Component, Mixins, Vue} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {getAllPromise} from '@/types/types';
import { IPostInLinkModel, IPostModel} from '@/views/model/post.model';
import {CommentService} from '@/api/service/CommentService';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import ScrollObserver from '@/components/scrollObserver/ScrollObserver.vue';
import AddNotifyPopup from '@/views/class/notification/AddNotifyPopup';
import NotificationListView from '@/views/class/notification/NotificationListView';
import WithRender from './NotificationPage.html';
import PagingMixins from '@/mixin/PagingMixins';
import {SET_POST_IN_BOOKMARK} from '@/store/mutation-class-types';

const MyClass = namespace('MyClass');
const Post = namespace('Post');

@WithRender
@Component({
  components:{
    Modal,
    AddNotifyPopup,
    NotificationListView,
    Btn,
    ScrollObserver
  }
})
export default class NotificationPage extends Mixins(PagingMixins) {


  @Post.Action
  private GET_POST_LIST_ACTION!: (  payload: { classId: number, paging: {page_no: number, count: number } }) => Promise<IPostModel[]>;

  @Post.Action
  private GET_RESERVED_LIST_ACTION!: (classId: number) => Promise<any>;

  @Post.Action
  private DELETE_POST_ACTION!: (payload: { classId: string | number, postId: number })=>Promise<any>;

  @Post.Mutation
  private SET_POST_IN_BOOKMARK!: (  items: IPostModel[] )=>void;

  @MyClass.Getter
  private classID!: string | number;

  @Post.Getter
  private postListItems!: IPostModel[];

  @Post.Getter
  private reservedItems!: IPostModel[];

  @Post.Getter
  private reservedTotalItem!: number;

  @Post.Getter
  private postTotal!: number;


  // private postListItems: IPostModel[]= [];
  // private reservedItems: any[] = [];
  private reservedTotal: number=0;
  private isAddPopupOpen: boolean=false;
  private commentsTotalItems: any[] = [];

  private isPageLoaded: boolean=false;

  //datepicker
  private startDatePickerModel: string= new Date().toISOString().substr(0, 10);
  private startDateMenu: boolean=false;
  private isReservedChk: boolean=false;
  private isLoader: boolean=false;

  private currentPageCount: number=1;
  private numOfPage: number=10;
  private lastPageCount: number=-1;


  get loaderModel() {
    return this.isLoader;
  }


  get reservedChk(): boolean {
    return this.isReservedChk;
  }

  get postListItemsModel() {
    return this.postListItems;
  }

  get commentsTotalItemsModel() {
    return this.commentsTotalItems;
  }

  public created() {
    console.log( this.$route.query.sideNum );
    if (this.$route.query.sideNum && this.$route.query.sideNum !== '') {
      this.$emit('sideNum', Number(this.$route.query.sideNum));
    }
    this.getList().then(
      (data)=>{
        this.isPageLoaded=true;
        const {lastPage}=this.updatePaging(this.postTotal, this.numOfPage);
        this.lastPageCount=lastPage;
        console.log('this.lastPageCount=', this.lastPageCount);
      }
    );
  }

  private async getList() {
    //알림 가져오기
    await this.GET_POST_LIST_ACTION({
      classId: Number(this.classID),
      paging: {page_no: this.currentPageCount, count: this.numOfPage}
    });

    //예약된 알림 가져오기.
    await this.GET_RESERVED_LIST_ACTION(Number(this.classID));

    //댓글 총 개수 가져옴
    await getAllPromise( this.getAllCommentsPromiseResult())
      .then((data) => {
        // console.log(data);
        const comments=data.map(( item)=>{
          return {
            id: item.post_id,
            total : item.total
          };
        });
        this.commentsTotalItems = [...comments];
      });
  }

  private scrollObserver( value: boolean ) {
    this.isLoader=value;

    console.log('scrollObserver 실행 ');
    //여기에 리스트 업데이트
    this.updateContents()
      .then(()=>{
      this.isLoader=false;
    });
  }

  private async updateContents() {
    if (this.lastPageCount > this.currentPageCount) {
      ++this.currentPageCount;
      this.getList()
        .then(() => {
          this.isPageLoaded = true;
        });
    }else{
      this.currentPageCount=this.lastPageCount;
    }
    console.log(this.lastPageCount, this.currentPageCount);
  }

  private updatePaging( totalNum: number, numOfPage: number ) {
    //총 페이지 카운트
    const total=this.getTotalPageCount({total: totalNum, numOfPage});
    //페이지 카운트 구하기
    const pageItems = this.getPageNum({ totalPageCount: total, pageSize: total, curPageNum: 1});
    //마지막 페이지 카운트
    const lastPage = pageItems[pageItems.length - 1];
    return {
      total,
      lastPage
    };
  }

  private isOwner( ownerId: number, userId: number): boolean {
    return (ownerId === userId);
  }
  /**
   * 댓글 총 개수 api 배열에 담아 두기.
   * @private
   */
  private getAllCommentsPromiseResult() {
    // const commentTotalItems: Array<{ total: any; postId: number, id: number; }> = [];
    const totalPromise: Array<Promise<any>> = [];
    this.postListItems.forEach((item: IPostModel) => {
      totalPromise.push( CommentService.getCommentsByPostId(item.id) );
    });
    return totalPromise;
  }

  /**
   * datepicker 닫기 참조
   * @private
   */
  private startDatePickerChange( ) {
    this.startDateMenu = false;
    // console.log(this.startDatePickerModel);
  }

  private onAddPostPopupStatus(value: boolean) {
    this.isAddPopupOpen=value;
  }

  private onAddPost(value: boolean) {
    this.isAddPopupOpen=value;
  }

  private onAddPostPopupOpen() {
    this.isAddPopupOpen=true;
  }

  private onReservedMenuDownUp() {
    this.isReservedChk=!this.isReservedChk;
  }

  /**
   * 예약 알림 제거
   * @param postIdx
   * @private
   */
  private async onDeleteReservedByPostId(postIdx: number) {
    await this.DELETE_POST_ACTION( {classId: this.classID, postId: postIdx})
      .then((data)=>{
        alert('예약된 알림이 제거 되었습니다.');
      });
    await this.GET_RESERVED_LIST_ACTION(Number(this.classID));
  }

  private onDetailPostOpen(id: number) {
    console.log('클릭');
  }


}
