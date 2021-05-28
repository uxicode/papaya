import {Component, Vue, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import Modal from '@/components/modal/modal.vue';
import AddNotifyPopup from '@/views/class/notification/AddNotifyPopup';
import {IAttachFileModel, IPostInLinkModel, IPostModel} from '@/views/model/post.model';
import {PostService} from '@/api/service/PostService';
import NotifyDetailPopup from '@/views/class/notification/NotifyDetailPopup';
import WithRender from './NotificationListView.html';

const MyClass = namespace('MyClass');

@WithRender
@Component({
  components:{
    Modal,
    NotifyDetailPopup,
    AddNotifyPopup
  }
})
export default class NotificationListView extends Vue {
  @Prop(Array)
  private readonly postListItems!: IPostModel[] & IPostInLinkModel[];

  @Prop(Array)
  private readonly commentsTotalItems!: any[];

  @MyClass.Getter
  private classID!: string | number;

  private reservedItems: any[] = [];
  private reservedTotal: number=0;
  private isDetailPopupOpen: boolean=false;
  private detailPostId: number=997; // 동적으로 변경 안되는 상태

  private isAddPopupOpen: boolean=false;

  private isOwner( ownerId: number, userId: number): boolean {
    return (ownerId === userId);
  }

  private onKeepPostClick(idx: number ) {
    const findIdx=this.postListItems.findIndex((ele) => ele.id === idx);
    // console.log( findIdx );
    const targetPost=this.postListItems[findIdx];
    let { isBookmark } = targetPost;
    const { user_keep_class_posts } = targetPost;

    if( isBookmark ){
      if( Array.isArray(user_keep_class_posts) && user_keep_class_posts.length>0){
        PostService.deleteKeepPost(user_keep_class_posts[0].id)
          .then((postData)=>{
            isBookmark=!isBookmark;
            user_keep_class_posts.length=0;
            this.postListItems.splice(findIdx, 1, {...targetPost, isBookmark, user_keep_class_posts} );
          });
      }
    }else{
      //북마크 되어 있는 상태
      PostService.setKeepPost({ class_id:Number( this.classID ), post_id: idx })
        .then((postData: any )=>{
          // console.log(data);
          isBookmark=!isBookmark;
          user_keep_class_posts.push( postData.data );
          this.postListItems.splice(findIdx, 1, {...targetPost, isBookmark, user_keep_class_posts} );
        });
    }
  }


  private getImgFileLen( items: IAttachFileModel[] ): number{
    return (items) ? this.getImgFileDataSort( items ).length : 0;
  }

  private getImgTotalNum(  items: IAttachFileModel[]  ) {
    return (items && this.getImgFileDataSort(items).length <= 3);
  }

  private getImgFileMoreCheck(  items: IAttachFileModel[] ) {
    return (items)? ( this.getImgFileDataSort( items ).length>3 )? `+${this.getImgFileDataSort( items ).length - 3}` : '' : 0;
  }

  private getImgFileDataSort(fileData: IAttachFileModel[] ) {
    return fileData.filter((item: IAttachFileModel) => item.contentType === 'image/png' || item.contentType === 'image/jpg' || item.contentType === 'image/jpeg' || item.contentType === 'image/gif');
  }

  private getFileDataSort(fileData: IAttachFileModel[] ) {
    return fileData.filter( (item: IAttachFileModel) => item.contentType !== 'image/png' && item.contentType !== 'image/jpg' && item.contentType !== 'image/jpeg' && item.contentType !== 'image/gif');
  }

  private isVote(item: Date) {
    if (item === null) {
      return true;
    }
    const finishTime = new Date(item).getTime();
    const currentTime = new Date().getTime();

    return (finishTime > currentTime);
  }

  private getCommentTotal(idx: number) {
    const findItem=this.commentsTotalItems.find((ele) => ele.id === idx);
    return (findItem)? findItem.total : 0;
  }

  /**
   * datepicker 닫기 참조
   * @private
   */
  private startDatePickerChange( ) {
    this.startDateMenu = false;
    // console.log(this.startDatePickerModel);
  }

  private onDetailPostPopupOpen(id: number) {
    this.detailPostId = id; // update postId
    this.isDetailPopupOpen=true;
  }

  private onDetailPostPopupStatus(value: boolean) {
    this.isDetailPopupOpen=value;
  }

  private onAddPostPopupOpen() {
    this.isAddPopupOpen=true;
  }

  private onAddPostPopupStatus(value: boolean) {
    this.isAddPopupOpen=value;
  }

  private onAddPost(value: boolean) {
    this.isAddPopupOpen=value;
  }

}
