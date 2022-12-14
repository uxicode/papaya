import {Component, Mixins, Prop, Vue} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import Modal from '@/components/modal/modal.vue';
import AddNotifyPopup from '@/views/class/notification/AddNotifyPopup';
import {IPostInLinkModel, IPostModel} from '@/views/model/post.model';
import {PostService} from '@/api/service/PostService';
import ListInImgPreview from '@/components/preview/ListInImgPreview.vue';
import ListInFilePreview from '@/components/preview/ListInFilePreview.vue';
import ListInVotePreview from '@/components/preview/ListInVotePreview.vue';
import ListInLinkPreview from '@/components/preview/ListInLinkPreview.vue';
import NotifyDetailPopup from '@/views/class/notification/NotifyDetailPopup';
import EditNotificationPopup from '@/views/class/notification/EditNotificationPopup';
import NoticePopup from '@/components/modal/noticePopup.vue';

import MyClassService from '@/api/service/MyClassService';
import {IUserMe} from '@/api/model/user.model';
import UtilsMixins from '@/mixin/UtilsMixins';
import WithRender from './NotificationListView.html';
import {Utils} from '@/utils/utils';

const Auth = namespace('Auth');
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
    NoticePopup,
  }
})
export default class NotificationListView extends Mixins(UtilsMixins) {
/*
  @Prop(Array)
  private readonly postListItems!: IPostModel[];
*/

  @Prop(Array)
  private readonly commentsTotalItems!: any[];


  @Post.Action
  private DELETE_POST_ACTION!: (payload: { classId: string | number, postId: number })=>Promise<any>;

  @Post.Action
  private POST_TYPE_CHANGE_ACTION!: (payload: { classId: string | number, postId: number })=>Promise<any>;

  @Post.Action
  private GET_POST_DETAIL_ACTION!: ( payload: { classId: number, postId: number }) =>Promise<any>;

  @Post.Action
  private GET_POST_COMMENTS_ACTION!: ( postId: number)=>Promise<any>;

  @MyClass.Getter
  private classID!: string | number;

  @Auth.Getter
  private userInfo!: IUserMe | null;

  @Post.Getter
  private postListItems!: IPostModel[];

  private isDetailPopupOpen: boolean=false;
  private isEditPopupOpen: boolean=false;
  // private isLoading: boolean=false;
  private detailPostId: number=-1; // 동적으로 변경 안되는 상태

  private isNoticePopupOpen: boolean=false;
  private currentUserAuth: number=-1;

  get detailPostIdModel() {
    return this.detailPostId;
  }



  public created() {
    //currentUserAuth

    MyClassService.getMyInfoInThisClass(Number(this.classID))
      .then((data) => {
        const {user_id} = (data.result);
        this.currentUserAuth = user_id;
        return Promise.resolve( user_id );
      }).catch((error) => {
      return Promise.reject( false );
    });
  }



  public getVoteListLen( item: any ) {
    return ( item )? ( (item.vote_choices)? item.vote_choices.length: -1) : -1;
  }


  public getNickName(owner: { nickname: string } | null): string {
    return (owner) ? owner.nickname : '비공개';
  }

  private isOwner( item: IPostModel ): boolean {
    const {owner, user_id}=item;
    if (owner) {
      return ( owner.user_id === user_id );
    }else{
      return false;
    }
  }


  /**
   * 게시글 글쓴이와 현재 로그인 유저와 권한이 같은지 체크
   * @param ownerId
   * @private
   */
  private getIsMember( ownerId: number ): boolean {
    return ownerId === this.currentUserAuth;
  }

  /**
   * 게시글 글쓴이와 현재 로그인 유저와 권한이 같은지 체크
   * @param owner
   * @private
   */
  private isEditAuth( owner: { user_id: number } | null ): boolean{
    return ( !Utils.isEmpty(owner) && owner!==null )? this.getIsMember( owner.user_id ) : false;
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
    await this.GET_POST_COMMENTS_ACTION(this.detailPostId)
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
    console.log(id);
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
