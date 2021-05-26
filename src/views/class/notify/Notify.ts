import {Component, Vue} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IAttachFileModel, IPostModel} from '@/views/model/post.model';
import Modal from '@/components/modal/modal.vue';
import NotifyDetailPopup from '@/views/class/notify/NotifyDetailPopup';
import AddNotifyPopup from '@/views/class/notify/AddNotifyPopup';
import WithRender from './Notify.html';
import {PostService} from '@/api/service/PostService';
import {getAllPromise} from '@/views/model/types';

const MyClass = namespace('MyClass');

@WithRender
@Component({
  components:{
    Modal,
    NotifyDetailPopup,
    AddNotifyPopup
  }
})
export default class Notify extends Vue {

  @MyClass.Getter
  private classID!: string | number;

  private postListItems: IPostModel[] = [];
  private reservedItems: any[] = [];
  private reservedTotal: number=0;
  private isDetailPopupOpen: boolean=false;
  private isAddPopupOpen: boolean=false;
  private commentsTotalItems: any[] = [];

  private isPageLoaded: boolean=false;

  //datepicker
  private startDatePickerModel: string= new Date().toISOString().substr(0, 10);
  private startDateMenu: boolean=false;

  get postListItemsModel() {
    return this.postListItems;
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
    await PostService.getAllPostsByClassId(this.classID, {page_no: 1, count: 100})
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

  private isOwner( ownerId: number, userId: number): boolean {
    return (ownerId === userId);
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

  private onDetailPostPopupOpen(postId: number) {
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

}
