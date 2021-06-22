import {Vue, Component, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IClassInfo} from '@/views/model/my-class.model';
import {IAttachFileModel, IPostInLinkModel, IPostModel} from '@/views/model/post.model';
import {ICommentModel, IReplyModel} from '@/views/model/comment.model';
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

    /**
     * 댓글 등록
     * @private
     */
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

    /**
     * 대댓글 입력란 toggle
     * @param idx
     * @private
     */
    private replyInputToggle(idx: number) {
        this.reply = '';
        const replyInput = document.querySelectorAll('.comment-btm.reply');
        replyInput.forEach((item, index) =>
            (idx!==index) ? item.classList.add('hide') : item.classList.toggle('hide'));
    }

    /**
     * 대댓글 등록
     * @param id
     * @private
     */
    private async addReply(id: number) {
        if (this.reply !== '') {
            await this.ADD_REPLY_ACTION({
                comment_id: id,
                member_id: (this.myClassHomeModel.me?.id) ? (this.myClassHomeModel.me?.id) : 0,
                comment: this.reply
            });
            await this.GET_COMMENTS_ACTION(this.postDetailModel.id)
                .then(() => {
                    this.reply = '';
                });
        }
    }

    /**
     * 댓글 수정 input
     * @param data
     * @param idx
     * @private
     */
    private openCommentModify(data: ICommentModel, idx: number): void {
        if (data.owner.id === this.myClassHomeModel.me?.id) {
            const commentTxt = document.querySelectorAll('.main-comment .comment-txt');
            const modifyComment = document.querySelectorAll('.main-comment .modify-comment');
            commentTxt.forEach((item, index) =>
                (idx===index) ? item.classList.toggle('hide') : item.classList.remove('hide'));
            modifyComment.forEach((item, index) =>
                (idx===index) ? item.classList.toggle('active') : item.classList.remove('active'));
            this.tempComment = data.comment;
            // @ts-ignore
            modifyComment[idx].firstChild.focus();
        } else {
            alert('본인이 쓴 댓글만 수정 가능합니다.');
        }
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
        await CommentService.setCommentModify(id,{comment: newComment});
        await this.GET_COMMENTS_ACTION(this.postDetailModel.id)
            .then(() => this.closeCommentModify());
    }

    /**
     * 댓글 삭제
     * @private
     * @param data
     */
    private async deleteComment(data: ICommentModel) {
        if (data.owner.id === this.myClassHomeModel.me?.id) {
            await CommentService.deleteComment(data.id);
            await this.GET_COMMENTS_ACTION(this.postDetailModel.id)
                .then(() => this.closeCommentModify());
        } else {
            alert('본인이 쓴 댓글만 삭제 가능합니다');
        }
    }

    /**
     * 대댓글 수정 input
     * @param reply
     * @param idx
     * @private
     */
    private openReplyModify(data: IReplyModel, jdx: number): void {
        if (data.owner.id === this.myClassHomeModel.me?.id) {
            const replyTxt = document.querySelectorAll('.reply .comment-txt');
            const modifyReply = document.querySelectorAll('.reply .modify-reply');
            replyTxt.forEach((item, index) =>
                (jdx===index) ? item.classList.toggle('hide') : item.classList.remove('hide'));
            modifyReply.forEach((item, index) =>
                (jdx===index) ? item.classList.toggle('active') : item.classList.remove('active'));
            this.tempReply = data.comment;
            // @ts-ignore
            modifyReply[jdx].firstChild.focus();
        } else {
            alert('본인이 쓴 대댓글만 수정 가능합니다.');
        }
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
        await this.GET_COMMENTS_ACTION(this.postDetailModel.id)
            .then(() => this.closeReplyModify());
    }

    /**
     * 대댓글 삭제
     * @private
     * @param data
     */
    private async deleteReply(data: IReplyModel) {
        if (data.owner.id === this.myClassHomeModel.me?.id) {
            await CommentService.deleteReply(data.id)
                .then((result) => {
                    console.log(result);
                });
            await this.GET_COMMENTS_ACTION(this.postDetailModel.id);
            this.closeReplyModify();
        } else {
            alert('본인이 쓴 대댓글만 삭제 가능합니다');
        }
    }

}
