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
import WithRender from './NotifyDetailPopup.html';
import { PostService } from '@/api/service/PostService';

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
    private detailPostId: number=-1; // 동적으로 변경 안되는 상태

    get postDetailModel(): IPostModel{
        return this.postDetailItem;
    }

    public onChangeVoteCheck(value: string | number | boolean, checked: boolean) {
        // console.log(value, checked, this.detailPostId);
        const {vote, user_member_id, id}=this.postDetailItem;

        const fetchVoteSelect=(checked)? PostService.setUserVoteSelect : PostService.setUserVoteCancel;
        fetchVoteSelect(vote.id, user_member_id, {vote_choice_ids:[ Number(value) ]})
          .then(( data: any )=>{
              this.GET_POST_DETAIL_ACTION({classId: Number(this.classID), postId: id })
                .then(( postData: IPostModel )=>{
                    // this.isEditPopupOpen=true;
                    console.log(postData.vote);
                });
          })
          .catch((error: any)=>{
              console.log('투표 데이터가 반영되지 않았습니다.');
          });

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

}
