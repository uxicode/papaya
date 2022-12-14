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
import {ScheduleService} from '@/api/service/ScheduleService';
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

  private contentsBodyH: number=500;


  get scheduleDetailModel(): IScheduleTotal{
    return this.scheduleDetailItem;
  }


  get contentH(): number {
    //????????? ????????? ?????? ???????????? ????????? ????????? ??????.
    if (this.isOpen) {
      setTimeout(() => {
        const contentEle=( this.$refs.infoBox as HTMLElement );
        this.contentsBodyH = (contentEle.clientHeight) ? (Number( contentEle.clientHeight )>600)? Number( contentEle.clientHeight ) : this.contentsBodyH : this.contentsBodyH;
      }, 500 );
    }
    return this.contentsBodyH;
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
   * ????????? ???????????? ?????? ????????? ????????? ????????? ????????? ??????
   * @param ownerId
   * @private
   */
  private getIsMember( ownerId: number ): boolean {
    // console.log( this.currentUserAuth, ownerId );
    return ownerId === this.currentUserAuth;
  }

  /**
   * ????????? ???????????? ?????? ????????? ????????? ????????? ????????? ??????
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
   * ?????? ??????> ???????????? > ?????? ??????
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
    this.contentsBodyH=500;
  }

  private onKeepSchedule() {
    ScheduleService.getKeepSchedule()
      .then((data)=>{
        //????????? ????????? ?????? ??????
        const keepData: IKeepSchedule[]=data.keep_classschedule_list;
        const matchKeepData=keepData.filter( (item: IKeepSchedule)=>item.schedule_id === this.scheduleDetailItem.id );

        if (matchKeepData.length > 0) {
          alert('?????? ????????? ???????????????.');
        }else{
          this.SET_KEEP_SCHEDULE_ACTION( {classId: Number(this.classID), scheduleId: this.scheduleDetailItem.id})
            .then( (readData)=>{
              alert('????????? ?????? ???????????????.\n ????????? ????????? MY?????????>??????????????? ?????? ?????? ??? ????????????.');
            } );
        }
      });
  }



}
