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
import WithRender from './NotificationListView.html';

const MyClass = namespace('MyClass');

@WithRender
@Component({
  components:{
    Modal,
    AddNotifyPopup,
    ListInImgPreview,
    ListInFilePreview,
    ListInVotePreview,
    ListInLinkPreview
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

  private getCommentTotal(idx: number) {
    const findItem=this.commentsTotalItems.find((ele) => ele.id === idx);
    return (findItem)? findItem.total : 0;
  }

  private onDetailPostOpen(id: number) {
    this.$emit('click:detailPost', id);
  }


 /* private onAddPostPopupOpen() {
    this.isAddPopupOpen=true;
  }

  private onAddPostPopupStatus(value: boolean) {
    this.isAddPopupOpen=value;
  }

  private onAddPost(value: boolean) {
    this.isAddPopupOpen=value;
  }*/

}
