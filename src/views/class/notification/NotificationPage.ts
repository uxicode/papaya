import {Component, Vue} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IAttachFileModel, IPostInLinkModel, IPostModel} from '@/views/model/post.model';
import Modal from '@/components/modal/modal.vue';
import AddNotifyPopup from '@/views/class/notification/AddNotifyPopup';
import {PostService} from '@/api/service/PostService';
import {CommentService} from '@/api/service/CommentService';
import {getAllPromise} from '@/types/types';
import NotificationListView from '@/views/class/notification/NotificationListView';
import NotifyDetailPopup from '@/views/class/notification/NotifyDetailPopup';
import WithRender from './NotificationPage.html';

const MyClass = namespace('MyClass');
const Post = namespace('Post');

@WithRender
@Component({
  components:{
    Modal,
    AddNotifyPopup,
    NotificationListView,
  }
})
export default class NotificationPage extends Vue {

  @MyClass.Getter
  private classID!: string | number;

  @Post.Getter
  private postListItems!: IPostModel[] & IPostInLinkModel[];

  @Post.Getter
  private reservedItems!: IPostModel[] & IPostInLinkModel[];

  @Post.Getter
  private reservedTotalItem!: number;

  @Post.Action
  private GET_POST_LIST_ACTION!: (  payload: { classId: number, paging: {page_no: number, count: number } }) => Promise<IPostModel[] & IPostInLinkModel[]>;

  @Post.Action
  private GET_RESERVED_LIST_ACTION!: (classId: number) => Promise<any>;

  @Post.Action
  private DELETE_POST_ACTION!: (payload: { classId: string | number, postId: number })=>Promise<any>;


  // private postListItems: IPostModel[] & IPostInLinkModel[]= [];
  // private reservedItems: any[] = [];
  private reservedTotal: number=0;
  private isAddPopupOpen: boolean=false;
  private commentsTotalItems: any[] = [];

  private isPageLoaded: boolean=false;

  //datepicker
  private startDatePickerModel: string= new Date().toISOString().substr(0, 10);
  private startDateMenu: boolean=false;
  private isReservedChk: boolean=false;



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
    this.getList().then(
      ()=>{
        this.isPageLoaded=true;
      }
    );
  }

  private async getList() {
    //알림 가져오기
    await this.GET_POST_LIST_ACTION({classId: Number( this.classID ), paging:{page_no:1, count:100} });

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
