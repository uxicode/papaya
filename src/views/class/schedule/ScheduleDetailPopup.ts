import {Component, Mixins, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import UtilsMixins from '@/mixin/UtilsMixins';
import {IClassInfo} from '@/views/model/my-class.model';
import {IKeepSchedule, IScheduleDetail, IScheduleTotal} from '@/views/model/schedule.model';
import MyClassService from '@/api/service/MyClassService';
import {Utils} from '@/utils/utils';
import TxtField from '@/components/form/txtField.vue';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import ListInImgPreview from '@/components/preview/ListInImgPreview.vue';
import ListInFilePreview from '@/components/preview/ListInFilePreview.vue';
import PhotoViewer from '@/components/photoViewer/photoViewer.vue';
import ConfirmPopup from '@/components/modal/confirmPopup.vue';
import NoticePopup from '@/components/modal/noticePopup.vue';
import CommentArea from '@/components/comment/CommentArea.vue';
import CommentBtm from '@/components/comment/CommentBtm.vue';
import EditSchedule from '@/views/class/schedule/EditSchedule';
import WithRender from './ScheduleDetailPopup.html';
import {ScheduleService} from '@/api/service/ScheduleService';
import {DELETE_SCHEDULE_ACTION, SET_KEEP_SCHEDULE_ACTION} from '@/store/action-class-types';

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
    NoticePopup,
    CommentArea,
    CommentBtm,
    EditSchedule
  }
})
export default class ScheduleDetailPopup extends Mixins(UtilsMixins) {

  @Prop(Boolean)
  private isOpen!: boolean;


  @Schedule.Action
  private GET_SCHEDULE_COMMENTS_ACTION!: (scheduleId: number) => Promise<any>;

  @Schedule.Action
  private ADD_SCHEDULE_COMMENT_ACTION!: (payload: {parent_id: number, parent_type: number, member_id: number, comment: string}) => Promise<any>;

  @Schedule.Action
  private ADD_SCHEDULE_REPLY_ACTION!: (payload: {comment_id: number, member_id: number, comment: string}) => Promise<any>;

  @Schedule.Action
  private DELETE_SCHEDULE_ACTION!: (payload: { classId: string | number, scheduleId: number } ) => Promise<unknown>;

  @Schedule.Action
  private SET_KEEP_SCHEDULE_ACTION!: ( payload: { classId: number, scheduleId: number} )=> Promise<any>;


  @MyClass.Getter
  private classID!: string | number;

  @MyClass.Getter
  private myClassHomeModel!: IClassInfo;

  @Schedule.Getter
  private scheduleDetailItem!: IScheduleDetail;

  private currentUserAuth: number=-1;
  private isPhotoViewer: boolean = false;
  private isConfirmPopupOpen: boolean=false;
  private isNoticePopupOpen: boolean=false;
  private deleteId: number=-1;
  private isEditPopupOpen: boolean=false;
  private isEditComplete: boolean=false;

  get scheduleDetailModel(): IScheduleTotal{
    return this.scheduleDetailItem;
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

  /**
   * 삭제 팝업> 확인버튼 > 삭제 처리
   * @param result
   * @private
   */
  private onDeleteConfirm( result: boolean ) {
    this.isConfirmPopupOpen=false;

    if (result) {
      this.DELETE_SCHEDULE_ACTION( {classId:Number(this.classID), scheduleId: this.deleteId })
        .then((data)=>{
          // console.log(data);
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


  private openPhotoViewer(): void {
    const {attachment} = this.scheduleDetailModel;
    if (this.imgPreviewInit(attachment).length > 3) {
      this.isPhotoViewer = true;
    }
  }

  private onPhotoViewerStatus(value: boolean) {
    this.isPhotoViewer = value;
  }

  private onEditSchedule() {
    this.isEditPopupOpen=true;
  }

  private onEditClose(value: boolean) {
    this.isEditPopupOpen=false;
  }

  private onEditComplete() {
    this.isEditComplete=true;
  }

  private popupClose() {
    this.popupChange( false );
    if (!this.isEditComplete) {
      this.$emit('editApplyTo');
    }
  }

  private onKeepSchedule() {
    ScheduleService.getKeepSchedule()
      .then((data)=>{
        //보관된 사실이 있는 경우
        const keepData: IKeepSchedule[]=data.keep_classschedule_list;
        const matchKeepData=keepData.filter( (item: IKeepSchedule)=>item.schedule_id === this.scheduleDetailItem.id );

        if (matchKeepData.length > 0) {
          alert('이미 보관된 일정입니다.');
        }else{
          this.SET_KEEP_SCHEDULE_ACTION( {classId: Number(this.classID), scheduleId: this.scheduleDetailItem.id})
            .then( (readData)=>{
              alert('일정이 보관 되었습니다.\n 보관된 일정은 MY프로필>보관함에서 확인 하실 수 있습니다.');
            } );
        }
      });
  }

}
