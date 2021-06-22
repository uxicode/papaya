import {Component, Mixins, Prop, Vue, Watch} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IClassInfo} from '@/views/model/my-class.model';
import {Utils} from '@/utils/utils';
import {
  IAttachFileModel,
  ICreatePost,
  ILinkModel,
  IPostInLinkModel,
  IPostModel, IReadAbleVote,
  IVoteModel
} from '@/views/model/post.model';
import AddVotePopup from '@/views/class/notification/AddVotePopup';
import AddLinkPopup from '@/views/class/notification/AddLinkPopup';
import AddReservationPopup from '@/views/class/notification/AddReservationPopup';
import {ImageFileService} from '@/views/service/preview/ImageFileService';
import {AttachFileService} from '@/views/service/preview/AttachFileService';
import ImageSettingService from '@/views/service/profileImg/ImageSettingService';
import TxtField from '@/components/form/txtField.vue';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';
import FilePreview from '@/components/preview/filePreview.vue';
import ImagePreview from '@/components/preview/imagePreview.vue';
import LinkPreview from '@/components/preview/linkPreview.vue';
import VotePreview from '@/components/preview/votePreview.vue';
import AlarmPreview from '@/components/preview/alarmPreview.vue';
import EditVotePopup from '@/views/class/notification/EditVotePopup';
import UtilsMixins from '@/mixin/UtilsMixins';
import WithRender from './EditNotificationPopup.html';

const MyClass = namespace('MyClass');
const Post = namespace('Post');

@WithRender
@Component({
  components:{
    TxtField,
    Btn,
    Modal,
    ImagePreview,
    FilePreview,
    AddVotePopup,
    AddLinkPopup,
    AddReservationPopup,
    LinkPreview,
    VotePreview,
    AlarmPreview,
    EditVotePopup
  }
})
export default class EditNotificationPopup extends  Mixins(UtilsMixins){

  @Prop(Boolean)
  private isOpen!: boolean;

  @MyClass.Getter
  private classID!: string | number;

  @MyClass.Getter
  private myClassHomeModel!: IClassInfo;

  @Post.Getter
  private postDetailItem!: IPostModel & IPostInLinkModel;

  @Post.Getter
  private commentItems!: any[];

  @Post.Getter
  private replyItems!: any[];

  @Post.Mutation
  private SET_VOTE!: (data: IReadAbleVote)=> void;

  @Post.Action
  private ADD_POST_ACTION!: (payload: { classId: number; formData: FormData })=>Promise<any>;

  @Post.Action
  private GET_RESERVED_LIST_ACTION!: (classId: number) => Promise<any>;

  @Post.Action
  private DELETE_POST_FILE!: (payload: { classId: number, postId: number, ids: number[] })=>Promise<any>;


  private isOpenEditVotePopup: boolean=false;
  private isOpenAddLinkPopup: boolean=false;
  private isOpenAddReservation: boolean=false;
  private alarmData: { alarmAt: string }={alarmAt: ''};
  private voteData: IVoteModel | null=null;
  private postData: ICreatePost = { title: '', text: ''};
  private linkData: ILinkModel={
    link: {
      title: '',
    },
    link_item_list: []
  };

  private formData: FormData=new FormData();
  private imgFileService: ImageFileService=new ImageFileService();
  private attachFileService: AttachFileService=new AttachFileService();

  get imgFileURLItemsModel(): string[] {
    return this.imgFileService.getItems();
  }

  get attachFileItemsModel(): any[] {
    return this.attachFileService.getItems();
  }

  get isSubmitValidate(): boolean{
    return (this.postData.title !== '' && this.postData.text !== '');
  }

  get linkListItems(): any{
    return this.linkData.link_item_list;
  }

  get voteItemModel() {
    return this.voteData;
  }

  get linkTitle(): string{
    return this.linkData.link.title;
  }

  get commentItemsModel() {
    return this.commentItems;
  }

  get replyItemsModel() {
    return this.replyItems;
  }

  /**
   * 클릭한 상세 정보값이 들어오고 난 후에 postData 를 갱신해야 한다.
   */
  get postDetailModel():  IPostModel & IPostInLinkModel{
    const {title, text, vote, link, attachment }=this.postDetailItem;
    // this.alarmData = { alarmAt };
    this.postData= { title, text };

    if (attachment.length && attachment.length>0) {
      //이미지 파일이 있을 시 화면에 로드 시켜둠  //imgPreviewInit : mixin 에 정의됨.
      this.imgFileService.setAttachItems( this.imgPreviewInit(attachment) );
      //첨부파일 있을시 화면에 로드 시켜둠 //attachFilePreviewInit : mixin 에 정의됨.
      this.attachFileService.setAttachItems( this.attachFilePreviewInit( attachment) );
    }
    //vote 가 존재 할때만
    if ( vote ) {
      this.votePreviewInit(vote);
    }
    //링크가 존재 할 때만
    if( link ){
      this.linkPreviewInit(link);
    }
    return this.postDetailItem;
  }

  get postDataModel() {
    return this.postData;
  }

  public votePreviewInit( vote: any ) {
    const reformat=vote.vote_choices.map( (item: any)=>{
      return { index:item.index, text:item.text};
    });
    const {
      parent_id,
      type,
      title,
      multi_choice,
      anonymous_mode,
      open_progress_level,
      open_result_level,
      finishAt
    } = vote;
    this.voteData = {
      vote: {
        parent_id,
        type,
        title,
        multi_choice,
        anonymous_mode,
        open_progress_level,
        open_result_level,
        finishAt
      },
      vote_choice_list: reformat
    };
  }

  public linkPreviewInit( link: any) {
    const linkUrlItems=link.link_items.map( (item: any)=>{
      return {url: item.url, index: item.index};
    });
    this.linkData={
      link: {
        title: link.title,
      },
      link_item_list: linkUrlItems
    };
  }

  @Watch('isOpen')
  private currentStatus( val: boolean, old: boolean) {
    if (val !== old && val ) {
      this.$nextTick(()=>{
        //상세글 입력 창 크기 데이터 크기 즉 텍스트의 길이에 맞추어 재설정한다.
        const scheduleDetailAreaTxt=this.$refs.scheduleDetailAreaTxt as HTMLTextAreaElement;
        // console.log(scheduleDetailAreaTxt);
        this.txtAreaEleH( scheduleDetailAreaTxt, this.postData.text );
      });
    }
  }

  private popupChange( value: boolean ) {
    this.$emit('change', value);
    this.allClear();
  }


  /**
   *  새일정 등록 > textarea 에 글 입력시
   * @param value
   * @private
   */
  private postDetailAreaInputHandler(value: any) {
    this.postData.text=value;
    const scheduleDetailAreaTxt=this.$refs.scheduleDetailAreaTxt as HTMLTextAreaElement;
    this.txtAreaEleH( scheduleDetailAreaTxt, this.postData.text );
  }

  //start : 이미지 preview  및 이미지 등록 ================================================
  /**
   * 이미지등록 아이콘 클릭시 > input type=file 에 클릭 이벤트 발생시킴.
   * @private
   */
  private addImgFileInputFocus() {
    //input click event 발생시키기 - mixin 으로 이동
    this.inputEventBind('#imgFileInput');
  }
  //모델에 이미지 파일 추가
  private addFileToImage( files: FileList ){
    this.imgFileService.load(files, '#imgFileInput');
  }
  /**
   * 추가된 이미지 미리보기 파일 제거하기
   * @param idx
   * @private
   */
  private onRemoveImgPreviewItems(idx: number): void{
    // const targetImg = this.imgFileService.getItemById(idx);
    const { id }= this.postDetailItem;

    const file=this.imgFileService.getItemById(idx).file;

    if( file.fieldname ){
      this.DELETE_POST_FILE( { classId: Number( this.classID ), postId: id, ids:[file.id]})
        .then( (data)=>{
          this.imgFileService.remove(idx);
        });
    }else{
      this.imgFileService.remove(idx);
    }
  }

  /**
   * 추가된 이미지 파일 모두 지우기
   * @private
   */
  private onRemoveAllPreview(): void {

    const { id }= this.postDetailItem;

    const fileItems=this.imgFileService.getFileItems();

    const ids=fileItems
      .map((item) =>(item.file.fieldname) ? item.file.id : '')
      .filter((item) => item !== '');

    if(ids && ids.length>0){
      this.DELETE_POST_FILE( { classId: Number( this.classID ), postId: id, ids})
        .then( (data)=>{
          this.imgFileService.removeAll();
        });
    }else{
      this.imgFileService.removeAll();
    }
  }
  /**
   * post 등록을 완료후 formdata 및 배열에 지정되어 있던 데이터들 비우기..
   * @private
   */
  private imgFilesAllClear() {
    this.imgFileService.removeAll();
    this.formData.delete('files');
  }
  //end : 이미지 preview  및 이미지 등록 ================================================

  //start : 파일 첨부 미리보기 및 파일 업로드 ================================================
  /**
   * 첨부파일등록 아이콘 클릭시 > input type=file 에 클릭 이벤트 발생시킴.
   * @private
   */
  private addFilesInputFocus(){
    //input click event 발생시키기 - mixin 으로 이동
    this.inputEventBind('#attachFileInput');
  }
  //모델에 이미지 파일 추가
  private addAttachFileTo( files: FileList ){
    this.attachFileService.load(files, '#attachFileInput');
  }
  private removeAllAttachFile(): void {
    this.attachFileService.removeAll();
  }
  private removeAttachFileItem(idx: number): void{
    this.attachFileService.remove(idx);
  }
  private attachFilesAllClear() {
    this.attachFileService.removeAll();
    this.formData.delete('files');
  }
  //end : 파일 첨부 미리보기 및 파일 업로드 ================================================

  /**
   * 새일정> 등록 버튼 클릭시 팝업 닫기 및 데이터 전송 (
   * @private
   */
  private submitAddPost(): void{
    //시나리오 --> 등록 버튼 클릭 > 이미지 추가한 배열값 formdata 에 입력 > 전송 >전송 성공후> filesAllClear 호출 > 팝업 닫기
    //이미지 파일 저장.
    this.imgFileService.save( this.formData );

    //파일 저장.
    this.attachFileService.save( this.formData );

    //알림 데이터 전송 ( 투표 및 링크 데이터 )
    this.setPostDataToFormData();
  }

  private onAddPostSubmit() {
    this.submitAddPost();
  }

  /**
   * 링크 데이터가 유효한지 체크
   * @private
   */
  private getValidLink(): boolean{
    if( this.linkData===null ){ return false;}
    if( !this.linkData.link_item_list.length ){ return false;}

    const invalidLinkItems: Array<{ index: number, url: string }> = [];
    this.linkData.link_item_list.forEach( (item: { index: number, url: string } )=>{
      //유효하지 않은 url 찾기
      if( item.url!=='' && !Utils.getIsValidLink(item.url)  ){
        invalidLinkItems.push(item);
      }
    });
    return invalidLinkItems.length > 0;
  }



  //start : vote 이벤트 핸들러 ================================================
  private editVotePopupOpen() {
    this.isOpenEditVotePopup=true;
    console.log(this.isOpenEditVotePopup);
  }
  private onVotePopupClose(value: boolean ) {
    this.isOpenEditVotePopup=value;
  }
  private onAddVote( voteData: IVoteModel) {
    this.voteData = voteData;
    this.isOpenEditVotePopup=false;
    console.log(voteData);
  }
  private voteDataClear() {
    this.voteData={
      vote:{
        parent_id:0,
        type: 0,
        title: '',
        multi_choice: 0,
        anonymous_mode: 0,
        open_progress_level: 0,
        open_result_level: 0,
        finishAt: '',
      },
      vote_choice_list: [
        {
          text: '',
          index: 1
        }
      ]
    };
  }
  private onModifyVote() {
   // console.log('this.postDetailItem.vote=', this.postDetailItem.vote);
    this.SET_VOTE( this.postDetailItem.vote );
    this.isOpenEditVotePopup=true;
  }
  //end : vote 이벤트 핸들러 ================================================

  //start : link 이벤트 핸들러 ================================================
  private addLinkPopupOpen() {
    this.isOpenAddLinkPopup=true;
  }
  private modifyLink() {
    this.isOpenAddLinkPopup=true;
  }
  private removeLinkItem(idx: number) {
    this.linkData.link_item_list.splice(idx, 1);
  }
  private onLinkPopupClose(value: boolean ) {
    this.isOpenAddLinkPopup=value;
  }
  private onAddLink(linkData: ILinkModel) {
    this.isOpenAddLinkPopup=false;
    this.linkData = linkData;
  }
  //end : link 이벤트 핸들러 ================================================

  //start : 예약 알림 이벤트 핸들러 ================================================
  private addReservationPopupOpen() {
    this.isOpenAddReservation=true;
  }
  private onAddReservation( alarmData: { alarmAt: string } ) {
    this.isOpenAddReservation=false;
    this.alarmData=alarmData;
  }
  private onReservationPopupClose(value: boolean ) {
    this.isOpenAddReservation=value;
  }
  //end : 예약 알림 이벤트 핸들러 ================================================


  //start : 예약 알림 미리보기 ================================================
  private removeAlarmItem() {
    this.alarmData.alarmAt = '';
  }

  private modifyAlarm() {
    this.isOpenAddReservation=true;
  }
  //end : 예약 알림 미리보기 ================================================



  private allClear() {
    // 등록이 완료되고 나면 해당 저장했던 데이터를 초기화 시켜 두고 해당 팝업의  toggle 변수값을 false 를 전달해 팝업을 닫게 한다.
    this.imgFilesAllClear(); //이미지 데이터 비우기
    this.attachFilesAllClear();//파일 데이터 비우기
    this.postData = {title: '', text: ''}; //post 데이터 비우기
    this.voteDataClear(); //투표 데이터 비우기
  }

  /**
   * 알림 데이터 post 전송
   * @private
   */
  private setPostDataToFormData() {
    if( !this.isSubmitValidate ){return;}

    //링크 데이터가 존재 한다면 기존 postData 에 merge 한다.
    const linkMergeData = (this.getValidLink())? {...this.postData, ...this.linkData} : {...this.postData};
    const voteMergeData = (this.voteData!==null)? {...linkMergeData, ...this.voteData} : {...this.postData};
    const mergeData= (this.alarmData.alarmAt!=='')? {...voteMergeData, ...this.alarmData} : voteMergeData;

    //formdata 에 데이터를 적용하려면 문자열 타입 직렬화 해야 한다.
    const temp = JSON.stringify( mergeData );
    this.formData.append('data', temp );



    // voteData 는 알림의 id 값을 알아야 하기에 먼저 알림을 생성/등록>완료 후 해당 알림의 id 을 가져와서 voteData 를 생성한다.
    /* this.ADD_POST_ACTION({classId: Number(this.classID), formData: this.formData})
       .then((data) => {
         if (this.alarmData.alarmAt !== '') {
           //예약된 알림 가져오기.
           this.GET_RESERVED_LIST_ACTION(Number(this.classID))
             .then((alarmData) => {
               console.log(alarmData);
               this.alarmData.alarmAt = '';
             });
         }
         // 등록이 완료되고 나면 해당 저장했던 데이터를 초기화 시켜 두고 해당 팝업의  toggle 변수값을 false 를 전달해 팝업을 닫게 한다.
         this.imgFilesAllClear(); //이미지 데이터 비우기
         this.attachFilesAllClear();//파일 데이터 비우기
         this.postData = {title: '', text: ''}; //post 데이터 비우기
         this.voteDataClear(); //투표 데이터 비우기
         this.$emit('submit', false); //post 등록 팝업 닫기 알림~
       });*/

    this.allClear();
  }
}
