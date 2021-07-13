import {Component, Mixins, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import UtilsMixins from '@/mixin/UtilsMixins';
import {ICommentModel, IReplyModel} from '@/views/model/comment.model';
import {IClassInfo} from '@/views/model/my-class.model';
import {IScheduleTotal} from '@/views/model/schedule.model';
import {Utils} from '@/utils/utils';
import TxtField from '@/components/form/txtField.vue';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import ListInImgPreview from '@/components/preview/ListInImgPreview.vue';
import ListInFilePreview from '@/components/preview/ListInFilePreview.vue';
import PhotoViewer from '@/components/photoViewer/photoViewer.vue';
import ConfirmPopup from '@/components/modal/confirmPopup.vue';
import NoticePopup from '@/components/modal/noticePopup.vue';
import MyClassService from '@/api/service/MyClassService';
import WithRender from './ScheduleDetailPopup.html';

const MyClass = namespace('MyClass');
const Schedule = namespace('Schedule');

@WithRender
@Component({
  components: {
    Modal,
    TxtField,
    Btn,
    ListInImgPreview,
    ListInFilePreview,
    PhotoViewer,
    ConfirmPopup,
    NoticePopup
  }
})
export default class ScheduleDetailPopup extends Mixins(UtilsMixins) {

  @Prop(Boolean)
  private isOpen!: boolean;


  @Schedule.Action
  private GET_COMMENTS_ACTION!: (scheduleId: number) => Promise<any>;

  @Schedule.Action
  private ADD_COMMENT_ACTION!: (payload: {parent_id: number, parent_type: number, member_id: number, comment: string}) => Promise<any>;

  @Schedule.Action
  private ADD_REPLY_ACTION!: (payload: {comment_id: number, member_id: number, comment: string}) => Promise<any>;

  @Schedule.Action
  private DELETE_SCHEDULE_ACTION!: (payload: { classId: string | number, scheduleId: number })=> Promise<any>;


  @MyClass.Getter
  private classID!: string | number;

  @MyClass.Getter
  private myClassHomeModel!: IClassInfo;

  @Schedule.Getter
  private scheduleDetailItem!: IScheduleTotal;

  @Schedule.Getter
  private commentItems!: ICommentModel[];

  @Schedule.Getter
  private replyItems!: IReplyModel[];


  private comment: string = '';
  private reply: string = '';

  private currentUserAuth: number=-1;
  private isPhotoViewer: boolean = false;
  private isConfirmPopupOpen: boolean=false;
  private isNoticePopupOpen: boolean=false;
  private deleteId: number=-1;

  get scheduleDetailModel(): IScheduleTotal{
    return this.scheduleDetailItem;
  }

  get commentItemsModel() {
    return this.commentItems;
  }

  get replyItemsModel() {
    return this.replyItems;
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

  public getFullDay(date: Date | string): string{
    return Utils.getFullDay( new Date( date )  );
  }

  /**
   * 게시글 글쓴이와 현재 로그인 유저와 권한이 같은지 체크
   * @param ownerId
   * @private
   */
  private getIsMember( ownerId: number ): boolean {
    console.log( this.currentUserAuth, ownerId );
    return ownerId === this.currentUserAuth;
  }

  /**
   * 게시글 글쓴이와 현재 로그인 유저와 권한이 같은지 체크
   * @param ownerId
   * @private
   */
  private isEditAuth( ownerId: number ) {
    return this.getIsMember(ownerId);
  }

  private onDeleteByScheduleId( scheduleId: number) {
    this.isConfirmPopupOpen=true;
    this.deleteId=scheduleId;
  }

  private onDeleteConfirm( result: boolean ) {
    this.isConfirmPopupOpen=false;

    if (result) {
      this.DELETE_SCHEDULE_ACTION( {classId:Number(this.classID), scheduleId: this.deleteId })
        .then((data)=>{
          console.log(data);
          this.isNoticePopupOpen=true;
          // this.isConfirmPopupOpen=false;
          this.$emit('delete', this.deleteId);

          this.popupChange(false);

          setTimeout(() => {
            this.deleteId = -1;
          }, 100);
        });
    }
  }

  private onDeleteNoticePopupClose( value: boolean ) {
    this.isNoticePopupOpen=value;
  }

  private popupChange( value: boolean ) {
    this.$emit('change', value);
  }

  private updatedDiffDate( dateValue: Date ): string{
    return Utils.updatedDiffDate(dateValue);
  }

  private openPhotoViewer(): void {
    const {attachment} = this.scheduleDetailModel;
    if (this.imgPreviewInit(attachment).length > 3) {
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
    const {id}=this.scheduleDetailModel;
    if (this.comment !== '') {
      await this.ADD_COMMENT_ACTION({
        // @ts-ignore
        parent_id: id,
        parent_type: 1,
        member_id: (this.myClassHomeModel.me?.id) ? (this.myClassHomeModel.me?.id) : 0,
        comment: this.comment
      }).then(() => {
        console.log(`member_id: ${this.myClassHomeModel.me?.id} 댓글 추가 완료`);
      });
      // @ts-ignore
      await this.GET_COMMENTS_ACTION(id)
        .then(() => {
          console.log('댓글 갱신');
        });
      this.comment = '';
    }
  }

  private replyInputToggle(idx: number) {
    this.reply = '';
    const replyInput = document.querySelectorAll('.comment-btm.reply');
    replyInput.forEach((item, index) =>
      (idx!==index) ? item.classList.add('hide') : item.classList.toggle('hide'));
  }

  /**
   * 대댓글 등록
   * @param commentId
   * @private
   */
  private async addReply( commentId: number) {
    const {id}=this.scheduleDetailModel;
    if (this.reply !== '') {
      await this.ADD_REPLY_ACTION({
        comment_id: commentId,
        member_id: (this.myClassHomeModel.me?.id) ? (this.myClassHomeModel.me?.id) : 0,
        comment: this.reply
      }).then(() => {
        console.log(`member_id: ${this.myClassHomeModel.me?.id} 대댓글 ${id} 추가 완료`);
      });
      // @ts-ignore
      await this.GET_COMMENTS_ACTION( id )
        .then(() => {
          console.log('댓글 갱신');
        });
    }
    this.reply = '';
  }




}
