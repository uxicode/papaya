import {Vue, Component, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IClassInfo} from '@/views/model/my-class.model';
import {IAttachFileModel, IPostInLinkModel, IPostModel} from '@/views/model/post.model';
import {ICommentModel} from '@/views/model/comment.model';
import {Utils} from '@/utils/utils';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';
import ListInImgPreview from '@/components/preview/ListInImgPreview.vue';
import ListInFilePreview from '@/components/preview/ListInFilePreview.vue';
import ListInLinkPreview from '@/components/preview/ListInLinkPreview.vue';
import PhotoViewer from '@/views/class/notification/PhotoViewer';
import DetailInVotePreview from '@/components/preview/DetailInVotePreview.vue';
import {CommentService} from '@/api/service/CommentService';
import WithRender from './NotifyDetailPopup.html';

const MyClass = namespace('MyClass');
const Post = namespace('Post');

@WithRender
@Component({
    components:{
        Btn,
        Modal,
        ListInImgPreview,
        ListInFilePreview,
        ListInLinkPreview,
        PhotoViewer,
        DetailInVotePreview,
    }
})
export default class NotifyDetailPopup extends Vue {

    @Prop(Boolean)
    private isOpen!: boolean;


    @Post.Getter
    private postDetailItem!: IPostModel & IPostInLinkModel;

    @Post.Getter
    private commentItems!: ICommentModel[];

    @Post.Getter
    private replyItems!: any[];

    @Post.Action
    private ADD_COMMENT_ACTION!: (payload: {parent_id: number, parent_type: number, member_id: number, comment: string}) => Promise<any>;

    @Post.Action
    private ADD_REPLY_ACTION!: (payload: {comment_id: number, member_id: number, comment: string}) => Promise<any>;

    @Post.Action
    private GET_COMMENTS_ACTION!: (postId: number) => Promise<any>;

    @MyClass.Getter
    private classID!: string | number;

    @MyClass.Getter
    private myClassHomeModel!: IClassInfo;

    private isPhotoViewer: boolean = false;

    private comment: string = '';
    private reply: string = '';
    private tempComment: string = '';
    private tempReply: string = '';

    get commentItemsModel() {
        return this.commentItems;
    }

    get replyItemsModel() {
        return this.replyItems;
    }

    get postDetailModel():  IPostModel & IPostInLinkModel{
        return this.postDetailItem;
    }

    private updatedDiffDate( dateValue: Date ): string{
        return Utils.updatedDiffDate(dateValue);
    }

    private popupChange( value: boolean ) {
        this.$emit('change', value);
    }

    private getImgFileDataSort(fileData: IAttachFileModel[] ) {
        return fileData.filter((item: IAttachFileModel) => item.contentType === 'image/png' || item.contentType === 'image/jpg' || item.contentType === 'image/jpeg' || item.contentType === 'image/gif');
    }

    private openPhotoViewer(): void {
        const attachment = this.postDetailModel.attachment;
        if (this.getImgFileDataSort(attachment).length > 3) {
            this.isPhotoViewer = true;
        }
    }

    private onPhotoViewerStatus(value: boolean) {
        this.isPhotoViewer = value;
    }

    private async addComment() {
        if (this.comment !== '') {
            await this.ADD_COMMENT_ACTION({
                parent_id: this.postDetailModel.id,
                parent_type: 0,
                member_id: (this.myClassHomeModel.me?.id) ? (this.myClassHomeModel.me?.id) : 0,
                comment: this.comment})
                .then(() => {
                    console.log(`member_id: ${this.myClassHomeModel.me?.id} 댓글 추가 완료`);
                });
            await this.GET_COMMENTS_ACTION(this.postDetailModel.id)
                .then(() => {
                    // console.log('댓글 갱신');
                    this.comment = '';
                });

        }
    }

    private replyInputToggle(idx: number) {
        this.reply = '';
        const replyInput = document.querySelectorAll('.comment-btm.reply');
        replyInput.forEach((item, index) =>
            (idx!==index) ? item.classList.add('hide') : item.classList.toggle('hide'));
    }

    private async addReply(id: number) {
        if (this.reply !== '') {
            await this.ADD_REPLY_ACTION({
                comment_id: id,
                member_id: (this.myClassHomeModel.me?.id) ? (this.myClassHomeModel.me?.id) : 0,
                comment: this.reply
            });
            await this.GET_COMMENTS_ACTION(this.postDetailModel.id)
                .then(() => {
                    // console.log('댓글 갱신');
                    this.reply = '';
                });
        }
        // this.reply = '';
    }

    /**
     * 댓글 수정 input
     * @param comment
     * @param idx
     * @private
     */
    private openCommentModify(comment: string, idx: number): void {
        const commentTxt = document.querySelectorAll('.main-comment .comment-txt');
        const modifyComment = document.querySelectorAll('.main-comment .modify-comment');
        commentTxt.forEach((item, index) =>
            (idx===index) ? item.classList.toggle('hide') : item.classList.remove('hide'));
        modifyComment.forEach((item, index) =>
            (idx===index) ? item.classList.toggle('active') : item.classList.remove('active'));
        this.tempComment = comment;
        // @ts-ignore
        modifyComment[idx].firstChild.focus();
    }

    /**
     * 등록 버튼 클릭 시 댓글 수정 입력란 숨김
     * @private
     */
    private closeCommentModify(): void {
        const commentTxt = document.querySelectorAll('.main-comment .comment-txt');
        const modifyComment = document.querySelectorAll('.main-comment .modify-comment');
        commentTxt.forEach((item) => item.classList.remove('hide'));
        modifyComment.forEach((item) => item.classList.remove('active'));
    }

    /**
     * 수정한 댓글 제출
     * @param id
     * @param newComment
     * @private
     */
    private async submitCommentModify(id: number, newComment: string) {
        await CommentService.setCommentModify(id,{comment: newComment})
            .then((data) => {
                console.log(data);
                // const findIdx = this.commentItemsModel.findIndex((item) => item.id === id);
                // this.commentItemsModel.splice(findIdx, 1, data.comment);
            });
        await this.GET_COMMENTS_ACTION(this.postDetailModel.id);
        this.closeCommentModify();
    }

    /**
     * 댓글 삭제
     * @param id
     * @private
     */
    private async deleteComment(id: number) {
        await CommentService.deleteComment(id)
            .then((data) => {
                console.log(data);
                // const findIdx = this.commentItemsModel.findIndex((item) => item.id === id);
                // this.commentItemsModel.splice(findIdx, 1);
            });
        await this.GET_COMMENTS_ACTION(this.postDetailModel.id);
        this.closeCommentModify();
    }

    /**
     * 대댓글 수정 input
     * @param reply
     * @param idx
     * @private
     */
    private openReplyModify(reply: string, jdx: number): void {
        const replyTxt = document.querySelectorAll('.reply .comment-txt');
        const modifyReply = document.querySelectorAll('.reply .modify-reply');
        replyTxt.forEach((item, index) =>
            (jdx===index) ? item.classList.toggle('hide') : item.classList.remove('hide'));
        modifyReply.forEach((item, index) =>
            (jdx===index) ? item.classList.toggle('active') : item.classList.remove('active'));
        this.tempReply = reply;
        // @ts-ignore
        modifyReply[jdx].firstChild.focus();
    }

    /**
     * 등록 버튼 클릭 시 대댓글 수정 입력란 숨김
     * @private
     */
    private closeReplyModify(): void {
        const replyTxt = document.querySelectorAll('.reply .comment-txt');
        const modifyReply = document.querySelectorAll('.reply .modify-reply');
        replyTxt.forEach((item) => item.classList.remove('hide'));
        modifyReply.forEach((item) => item.classList.remove('active'));
    }


    /**
     * 대댓글 수정 제출
     * @param id
     * @param newReply
     * @private
     */
    private async submitReplyModify(id: number, newReply: string) {
        await CommentService.setReply(id, {comment: newReply})
            .then((data) => {
                console.log(data);
            });
        await this.GET_COMMENTS_ACTION(this.postDetailModel.id);
        this.closeReplyModify();
    }

    /**
     * 대댓글 삭제
     * @param id
     * @private
     */
    private async deleteReply(id: number) {
        await CommentService.deleteReply(id)
            .then((data) => {
                console.log(data);
            });
        await this.GET_COMMENTS_ACTION(this.postDetailModel.id);
        this.closeReplyModify();
    }

}
