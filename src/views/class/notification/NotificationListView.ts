import {Component, Vue, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import Modal from '@/components/modal/modal.vue';
import AddNotifyPopup from '@/views/class/notification/AddNotifyPopup';
import {IAttachFileModel, IPostInLinkModel, IPostModel} from '@/views/model/post.model';
import {PostService} from '@/api/service/PostService';
import ListInImgPreview from '@/components/preview/ListInImgPreview.vue';
import ListInFilePreview from '@/components/preview/ListInFilePreview.vue';
import ListInVotePreview from '@/components/preview/ListInVotePreview.vue';
import ListInLinkPreview from '@/components/preview/ListInLinkPreview.vue';
import NotifyDetailPopup from '@/views/class/notification/NotifyDetailPopup';
import EditNotificationPopup from '@/views/class/notification/EditNotificationPopup';
import WithRender from './NotificationListView.html';

const MyClass = namespace('MyClass');
const Post = namespace('Post');

@WithRender
@Component({
  components:{
    Modal,
    AddNotifyPopup,
    ListInImgPreview,
    ListInFilePreview,
    ListInVotePreview,
    ListInLinkPreview,
    NotifyDetailPopup,
    EditNotificationPopup,
  }
})
export default class NotificationListView extends Vue {
  @Prop(Array)
  private readonly postListItems!: IPostModel[] & IPostInLinkModel[];

  @Prop(Array)
  private readonly commentsTotalItems!: any[];

  @MyClass.Getter
  private classID!: string | number;


  @Post.Action
  private DELETE_POST_ACTION!: (payload: { classId: string | number, postId: number })=>Promise<any>;

  @Post.Action
  private POST_TYPE_CHANGE_ACTION!: (payload: { classId: string | number, postId: number })=>Promise<any>;

  @Post.Action
  private GET_POST_DETAIL_ACTION!: ( payload: { classId: number, postId: number }) =>Promise<any>;

  @Post.Action
  private GET_COMMENTS_ACTION!: ( postId: number)=>Promise<any>;

  private isDetailPopupOpen: boolean=false;
  private isEditPopupOpen: boolean=false;
  // private isLoading: boolean=false;
  private detailPostId: number=-1; // 동적으로 변경 안되는 상태


  get detailPostIdModel() {
    return this.detailPostId;
  }

  public getVoteListLen( item: any ) {
    return ( item )? ( (item.vote_choices)? item.vote_choices.length: -1) : -1;
  }

  private isOwner( ownerId: number, userId: number): boolean {
    return (ownerId === userId);
  }


  /**
   * 북마크 toggle 이벤트 핸들러
   * @param idx
   * @private
   */
  private onKeepPostClick(idx: number ) {
    const findIdx=this.postListItems.findIndex((ele) => ele.id === idx);
    // console.log( findIdx );
    const targetPost=this.postListItems[findIdx];
    let { isBookmark } = targetPost;
    const { user_keep_class_posts } = targetPost;

    if( isBookmark ){
      if( user_keep_class_posts!==undefined && Array.isArray(user_keep_class_posts) && user_keep_class_posts.length>0){
        PostService.deleteKeepPost( user_keep_class_posts[0].id)
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

  /**
   * 덧글 총개수
   * @param idx
   * @private
   */
  private getCommentTotal(idx: number) {
    if (this.commentsTotalItems === undefined) { return 0; }
    // console.log(this.commentsTotalItems);
    const findItem=this.commentsTotalItems.find((ele) => ele.id === idx);
    return (findItem)? findItem.total : 0;
  }

  /**
   * 알림 상세 화면 띄우기
   * @param id
   * @private
   */
  private async onDetailPostOpen(id: number) {
    // this.$emit('click:detailPost', id);
    this.detailPostId = id; // update postId
    await this.GET_POST_DETAIL_ACTION({classId: Number(this.classID), postId: this.detailPostId});
    await this.GET_COMMENTS_ACTION(this.detailPostId)
      .then((data)=>{
        this.isDetailPopupOpen=true;
      });
  }

  /**
   * 알림 삭제
   * @param postIdx
   * @private
   */
  private onDeleteByPostId(postIdx: number) {
    this.DELETE_POST_ACTION( {classId:Number(this.classID), postId:postIdx})
      .then((data)=>{
        console.log(data);
        alert('요청하신 알림을 삭제 하였습니다.');
      });
  }

  /**
   * 알림 타입 변경 - 일반 or 공지
   * @param postIdx
   * @private
   */
  private onPostTypeChange( postIdx: number) {
    this.POST_TYPE_CHANGE_ACTION({classId: this.classID, postId: postIdx})
      .then((data)=>{
        console.log(data);
        const type=( data.type===0 )? '일반' : '공지';
        alert(`${type} 게시물로 변경 되었습니다.`);
      });
  }

  private onDetailPostPopupStatus(value: boolean) {
    this.isDetailPopupOpen=value;
  }


  /**
   * 알림글 수정
   * @param id
   * @private
   */
  private async onEditPost(id: number) {
    this.detailPostId = id; // update postId
    await this.GET_POST_DETAIL_ACTION({classId: Number(this.classID), postId: this.detailPostId})
      .then((data)=>{
        this.isEditPopupOpen=true;
      });
    /*await this.GET_COMMENTS_ACTION(this.detailPostId)
      .then((data)=>{

      });*/
  }

  private onEditClose(  value: boolean ){
    this.isEditPopupOpen=value;
  }


}
