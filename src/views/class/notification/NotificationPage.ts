import {Component, Mixins, Vue} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {getAllPromise} from '@/types/types';
import {IPostModel} from '@/views/model/post.model';
import {CommentService} from '@/api/service/CommentService';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import ScrollObserver from '@/components/scrollObserver/ScrollObserver.vue';
import AddNotifyPopup from '@/views/class/notification/AddNotifyPopup';
import NotificationListView from '@/views/class/notification/NotificationListView';
import EditNotificationPopup from '@/views/class/notification/EditNotificationPopup';
import NoticePopup from '@/components/modal/noticePopup.vue';
import PagingMixins from '@/mixin/PagingMixins';
import {Utils} from '@/utils/utils';
import {RESET_POST_LIST} from '@/store/mutation-class-types';
import WithRender from './NotificationPage.html';

const MyClass = namespace('MyClass');
const Post = namespace('Post');

@WithRender
@Component({
  components:{
    Modal,
    AddNotifyPopup,
    NotificationListView,
    EditNotificationPopup,
    NoticePopup,
    Btn,
    ScrollObserver
  }
})
export default class NotificationPage extends Mixins(PagingMixins) {


  @Post.Action
  private GET_POST_LIST_ACTION!: (  payload: { classId: number, paging: {page_no: number, count: number } }) => Promise<IPostModel[]>;

  @Post.Action
  private GET_POST_DETAIL_ACTION!: ( payload: { classId: number, postId: number }) =>Promise<any>;

  @Post.Action
  private GET_RESERVED_LIST_ACTION!: (classId: number) => Promise<any>;

  @Post.Action
  private DELETE_POST_ACTION!: (payload: { classId: string | number, postId: number })=>Promise<any>;

  @Post.Mutation
  private RESET_POST_LIST!: () =>void;

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


  private isAddPopupOpen: boolean=false;
  private isPageLoaded: boolean=false;
  private startDateMenu: boolean=false;
  private isReservedChk: boolean=false;
  private isLoader: boolean=false;
  private isEditPopupOpen: boolean=false;
  private isNoticePopupOpen: boolean=false;

  // private reservedItems: any[] = [];
  private reservedTotal: number=0;
  // private postListItems: IPostModel[]= [];
  private currentPageCount: number=1;

  private numOfPage: number=10;
  private lastPageCount: number=-1;
  private editType: string='post';
  private eventDates: any[] = [];
  private commentsTotalItems: any[] = [];

  //datepicker
  private startDatePickerModel: string= new Date().toISOString().substr(0, 10);

  get editTypeModel() {
    return this.editType;
  }

  set editTypeModel(value: string) {
    this.editType=value;
  }

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

  get currentDate() {
    return Utils.getCustomFormatDate(new Date(), '-');
  }

  public created() {
    // console.log( this.$route.query.sideNum );
    if (this.$route.query.sideNum && this.$route.query.sideNum !== '') {
      this.$emit('sideNum', Number(this.$route.query.sideNum));
    }

    this.getList()
      .then((data)=>{
        this.isPageLoaded=true;
        const {lastPage}=this.updatePaging(this.postTotal, this.numOfPage);
        this.lastPageCount=lastPage;

        //datepicker ?????? ????????? ??????
        const eventDates = this.postListItems.map((item) => {
          return Utils.getTodayParseFormat( new Date( item.createdAt ) );
        });
        this.eventDates= Utils.getDuplicateArrayCheck( eventDates );

      });
  }

  public isOwner( item: any ): boolean {
    if (item.owner) {
      const {owner, user_id, user_member_id}=item;
      console.log( item );
      return (owner.user_id === user_id );
    }else{
      return false;
    }
  }

  /**
   * ??? ?????? ??????(??? ???????????? ??????)?????? ????????? ????????????. ??????????????? ?????? ????????? ?????? ???????????? ????????? ????????? ??????.
   * ????????? ???????????? ??????????????? reactive subscription ??? ??????????????? ?????? ??????.
   */
  public beforeDestroy() {
    //store ??? ???????????? ????????? ?????????????????? ?????? ?????? ????????? ????????? ?????? ?????? ??????.
    //????????? ?????? ??????????????? ????????? ????????? ???????????? ????????????.
    this.RESET_POST_LIST();
  }




  private async getList() {
    //?????? ????????????
    await this.GET_POST_LIST_ACTION({
      classId: Number(this.classID),
      paging: {page_no: this.currentPageCount, count: this.numOfPage}
    });

    //????????? ?????? ????????????.
    await this.GET_RESERVED_LIST_ACTION(Number(this.classID));

    //?????? ??? ?????? ?????????
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

    // console.log('scrollObserver ?????? ');
    //????????? ????????? ????????????
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
          //datepicker ?????? ????????? ??????
          const eventDates = this.postListItems.map((item) => {
            return Utils.getTodayParseFormat( new Date( item.createdAt ) );
          });
          this.eventDates= Utils.getDuplicateArrayCheck( eventDates );
          console.log(this.eventDates);
        });
    }else{
      this.currentPageCount=this.lastPageCount;
    }
    // console.log(this.lastPageCount, this.currentPageCount);
  }

  private updatePaging( totalNum: number, numOfPage: number ) {
    //??? ????????? ?????????
    const total=this.getTotalPageCount({total: totalNum, numOfPage});
    //????????? ????????? ?????????
    const pageItems = this.getPageNum({ totalPageCount: total, pageSize: total, curPageNum: 1});
    //????????? ????????? ?????????
    const lastPage = pageItems[pageItems.length - 1];
    return {
      total,
      lastPage
    };
  }

/*  private isOwner( ownerId: number, userId: number): boolean {
    return (ownerId === userId);
  }*/
  /**
   * ?????? ??? ?????? api ????????? ?????? ??????.
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
   * datepicker ?????? ??????
   * @private
   */
  private startDatePickerChange( ) {
    this.startDateMenu = false;
    // console.log(this.startDatePickerModel);
  }

  private pickerEvents(date: any ) {
    //????????? date ??????????????? ?????? ?????? ?????? ????????? ??????????????? ?????? ???????????? ?????? for ?????? ?????? ????????? ???????????? ??????.
    const [, month, day] = date.split('-');

    const matchDate=this.eventDates.map((item)=>{
      const [, cMonth, cDay]=item.result.split('-');
      let result=null;
      //????????? ?????????
      if (Number(month) === Number(cMonth) && [Number(cDay)].includes( parseInt(day, 10) )) {
        result=(item.count > 1)? ['red', '#00f'] : true;
      }else{
        result=false;
      }
      return result;
    }).filter((item)=>item!==false );


    if (matchDate[0]) {
      console.log(matchDate[0]);
      return matchDate[0];
    }

    return false;
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
   * ?????? ?????? ??????
   * @param postIdx
   * @private
   */
  private async onDeleteReservedByPostId(postIdx: number) {
    await this.DELETE_POST_ACTION( {classId: this.classID, postId: postIdx})
      .then((data)=>{
        alert('????????? ????????? ?????? ???????????????.');
      });
    await this.GET_RESERVED_LIST_ACTION(Number(this.classID));
  }

  private onEditReservedOpen(id: number) {
     this.GET_POST_DETAIL_ACTION({classId: Number(this.classID), postId: id })
       .then( (data)=>{
         this.isEditPopupOpen=true;
       });
  }

  private onEditClose(  value: boolean ){
    this.isEditPopupOpen=value;
  }


}
