import {Component, Vue} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IAttachFileModel, IPostInLinkModel, IPostModel} from '@/views/model/post.model';
import Modal from '@/components/modal/modal.vue';
import AddNotifyPopup from '@/views/class/notification/AddNotifyPopup';
import {PostService} from '@/api/service/PostService';
import {getAllPromise} from '@/views/model/types';
import NotificationListView from '@/views/class/notification/NotificationListView';
import NotifyDetailPopup from '@/views/class/notification/NotifyDetailPopup';
import WithRender from './NotificationPage.html';
import {GET_POST_LIST_ACTION} from '@/store/action-class-types';

const MyClass = namespace('MyClass');
const Post = namespace('Post');

@WithRender
@Component({
  components:{
    Modal,
    AddNotifyPopup,
    NotificationListView,
    NotifyDetailPopup
  }
})
export default class NotificationPage extends Vue {


  @MyClass.Getter
  private classID!: string | number;

  @Post.Getter
  private postListItems!: IPostModel[] & IPostInLinkModel[];

  @Post.Action
  private GET_POST_LIST_ACTION!: (  payload: { classId: number, paging: {page_no: number, count: number } }) => Promise<IPostModel[] & IPostInLinkModel[]>;


  // private postListItems: IPostModel[] & IPostInLinkModel[]= [];
  private reservedItems: any[] = [];
  private reservedTotal: number=0;
  private isAddPopupOpen: boolean=false;
  private commentsTotalItems: any[] = [];

  private isPageLoaded: boolean=false;

  //datepicker
  private startDatePickerModel: string= new Date().toISOString().substr(0, 10);
  private startDateMenu: boolean=false;

  private isDetailPopupOpen: boolean=false;
  private detailPostId: number=997; // 동적으로 변경 안되는 상태

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
    /* await PostService.getAllPostsByClassId(this.classID, {page_no: 1, count: 100})
       .then((data) => {
         // console.log(data);
         this.postListItems = data.post_list;
         console.log('noticeListItems=',this.postListItems);
         this.postListItems.forEach((item, index ) => {
           let {isBookmark}=item;
           if( item.user_keep_class_posts.length > 0){
             isBookmark=!isBookmark;
             this.postListItems.splice(index, 1, {...item, isBookmark} );
           }
         });
       });*/
    await this.GET_POST_LIST_ACTION({classId: Number( this.classID ), paging:{page_no:1, count:100} })
      .then(( data: IPostModel[] & IPostInLinkModel[]) => {
        console.log(data);
      });

    //예약된 알림 가져오기.
    await PostService.getReservedPost( this.classID, {page_no:1, count:100})
      .then((data)=>{
        this.reservedTotal=data.total_count;
        this.reservedItems=data.post_list;
      });

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

  /**
   * 댓글 총 개수 api 배열에 담아 두기.
   * @private
   */
  private getAllCommentsPromiseResult() {
    // const commentTotalItems: Array<{ total: any; postId: number, id: number; }> = [];
    const totalPromise: Array<Promise<any>> = [];
    this.postListItems.forEach((item: IPostModel) => {
      totalPromise.push( PostService.getCommentsByPostId(item.id) );
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

  private onDetailPostPopupOpen(id: number) {
    this.detailPostId = id; // update postId
    this.isDetailPopupOpen=true;
  }

  private onDetailPostPopupStatus(value: boolean) {
    this.isDetailPopupOpen=value;
  }

}
