import {Vue, Component, Prop, Mixins} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IClassInfo} from '@/views/model/my-class.model';
import {IAttachFileModel, IPostInLinkModel, IPostModel} from '@/views/model/post.model';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';
import PhotoViewer from '@/components/photoViewer/photoViewer.vue';
import ListInImgPreview from '@/components/preview/ListInImgPreview.vue';
import ListInFilePreview from '@/components/preview/ListInFilePreview.vue';
import ListInLinkPreview from '@/components/preview/ListInLinkPreview.vue';
import DetailInVotePreview from '@/components/preview/DetailInVotePreview.vue';
import CommentArea from '@/components/comment/CommentArea.vue';
import CommentBtm from '@/components/comment/CommentBtm.vue';
import UtilsMixins from '@/mixin/UtilsMixins';
import EditNotificationPopup from '@/views/class/notification/EditNotificationPopup';
import { PostService } from '@/api/service/PostService';
import WithRender from './NotifyDetailPopup.html';

const MyClass = namespace('MyClass');
const Post = namespace('Post');

@WithRender
@Component({
    components:{
        Btn,
        Modal,
        PhotoViewer,
        ListInImgPreview,
        ListInFilePreview,
        ListInLinkPreview,
        DetailInVotePreview,
        CommentArea,
        CommentBtm,
        EditNotificationPopup
    }
})
export default class NotifyDetailPopup extends Mixins(UtilsMixins) {

    @Prop(Boolean)
    private isOpen!: boolean;

    @Post.Action
    private GET_POST_DETAIL_ACTION!: ( payload: { classId: number, postId: number }) =>Promise<any>;

    @Post.Action
    private POST_TYPE_CHANGE_ACTION!: (payload: { classId: string | number, postId: number })=>Promise<any>;

    @Post.Action
    private DELETE_POST_ACTION!: (payload: { classId: string | number, postId: number })=>Promise<any>;

    @Post.Getter
    private postDetailItem!: IPostModel;

    @MyClass.Getter
    private classID!: string | number;

    @MyClass.Getter
    private myClassHomeModel!: IClassInfo;

    private isPhotoViewer: boolean = false;
    private isEditPopupOpen: boolean=false;
    private detailPostId: number=-1; // ???????????? ?????? ????????? ??????
    private voteSelect: string | number | boolean='';

    get postDetailModel(): IPostModel{
        return this.postDetailItem;
    }

    public updated() {
        console.log( 'postDetailItem=', this.postDetailItem );
    }

    public async onChangeVoteCheck(value: string | number | boolean, checked: boolean) {
        // console.log(value, checked, this.detailPostId);
        const {vote, user_member_id, id}=this.postDetailItem;
        const {multi_choice}=this.postDetailModel.vote;

        if (!multi_choice) {
            console.log( '?????? ?????? ', this.voteSelect, value );
            //????????? ?????? ??????. --> ?????? ?????? ???????????? ?????? ????????? ?????? ?????? ????????? ???????????? ?????? ????????? ??????????????? ?????? ????????? ????????? ?????? ????????? ?????? ????????? ????????? ??????
            if( this.voteSelect!=='' && this.voteSelect!==value) {
                //?????? ????????? ????????? ?????? ?????? ?????? ??????.
                await PostService.setUserVoteCancel( vote.id, user_member_id, {vote_choice_ids:[ Number(this.voteSelect) ]})
                  .then((data)=>{
                      this.GET_POST_DETAIL_ACTION({classId: Number(this.classID), postId: id })
                        .then(( postData: IPostModel )=>{
                            // this.isEditPopupOpen=true;
                            console.log(postData.vote);
                        });
                  });
                //?????? ????????? ?????????  ?????? ??????.
                await PostService.setUserVoteSelect( vote.id, user_member_id, {vote_choice_ids:[ Number(value) ]})
                  .then((data)=>{
                      this.GET_POST_DETAIL_ACTION({classId: Number(this.classID), postId: id })
                        .then(( postData: IPostModel )=>{
                            // this.isEditPopupOpen=true;
                            console.log(postData.vote);
                        });
                  });
            }else{
                PostService.setUserVoteSelect( vote.id, user_member_id, {vote_choice_ids:[ Number(value) ]})
                  .then((data)=>{
                      this.GET_POST_DETAIL_ACTION({classId: Number(this.classID), postId: id })
                        .then(( postData: IPostModel )=>{
                            // this.isEditPopupOpen=true;
                            console.log(postData.vote);
                        });
                  });
            }
            this.voteSelect=value;
        }else{
            const fetchCheckTypeVoteSelect=(checked)? PostService.setUserVoteSelect : PostService.setUserVoteCancel;
            fetchCheckTypeVoteSelect(vote.id, user_member_id, {vote_choice_ids:[ Number(value) ]})
              .then(( data: any )=>{
                  this.GET_POST_DETAIL_ACTION({classId: Number(this.classID), postId: id })
                    .then(( postData: IPostModel )=>{
                        // this.isEditPopupOpen=true;
                        console.log(postData.vote);
                    });
              })
              .catch((error: any)=>{
                  console.log('?????? ???????????? ???????????? ???????????????.');
              });
        }
    }

    private popupChange( value: boolean ) {
        this.$emit('change', value);
    }

/*    private getImgFileDataSort(fileData: IAttachFileModel[] ) {
        return fileData.filter((item: IAttachFileModel) => item.contentType === 'image/png' || item.contentType === 'image/jpg' || item.contentType === 'image/jpeg' || item.contentType === 'image/gif');
    }*/

    private openPhotoViewer(): void {
        const attachment = this.postDetailModel.attachment;
        if (this.imgPreviewInit(attachment).length > 3) {
            this.isPhotoViewer = true;
        }
    }

    private onPhotoViewerStatus(value: boolean) {
        this.isPhotoViewer = value;
    }

    private async onEditPost(id: number) {
        this.detailPostId = id; // update postId
        console.log(id);
        await this.GET_POST_DETAIL_ACTION({classId: Number(this.classID), postId: this.detailPostId})
          .then((data)=>{
              this.isEditPopupOpen=true;
          });
    }

    private onEditClose(  value: boolean ){
        this.isEditPopupOpen=value;
    }

    /**
     * ?????? ?????? ?????? - ?????? or ??????
     * @param postIdx
     * @private
     */
    private onPostTypeChange( postIdx: number) {
        this.POST_TYPE_CHANGE_ACTION({classId: this.classID, postId: postIdx})
          .then((data)=>{
              console.log(data);
              const type=( data.type===0 )? '??????' : '??????';
              alert(`${type} ???????????? ?????? ???????????????.`);
          });
    }


    /**
     * ?????? ??????
     * @param postIdx
     * @private
     */
    private onDeleteByPostId(postIdx: number) {
        this.DELETE_POST_ACTION( {classId:Number(this.classID), postId:postIdx})
          .then((data)=>{
              console.log(data);
              alert('???????????? ????????? ?????? ???????????????.');
          });
    }

}
