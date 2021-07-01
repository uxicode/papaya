import {Vue, Component, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IClassInfo} from '@/views/model/my-class.model';
import {Utils} from '@/utils/utils';
import {ICreatePost, ILinkModel, IVoteModel} from '@/views/model/post.model';
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
import WithRender from './AddNotifyPopup.html';

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
    AlarmPreview
  }
})
export default class AddNotifyPopup extends Vue{

  @Prop(Boolean)
  private isOpen!: boolean;

  @MyClass.Getter
  private classID!: string | number;

  @MyClass.Getter
  private myClassHomeModel!: IClassInfo;

  @Post.Action
  private ADD_POST_ACTION!: (payload: { classId: number; formData: FormData })=>Promise<any>;

  @Post.Action
  private GET_RESERVED_LIST_ACTION!: (classId: number) => Promise<any>;


  private isOpenAddVotePopup: boolean=false;
  private isOpenAddLinkPopup: boolean=false;
  private isOpenAddReservation: boolean=false;

  private alarmData: { alarmAt: string }={
    alarmAt: ''
  };
  private voteData: IVoteModel | null = {
    vote: {
      parent_id: -1,
      type: 0,
      title: '',
      multi_choice: 0,
      anonymous_mode: 0,
      open_progress_level: 0,
      open_result_level: 0,
      finishAt: '',
    },
    vote_choice_list: []
  };
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

  private getProfileImg(imgUrl: string | null | undefined ): string{
    return ImageSettingService.getProfileImg( imgUrl );
  }

  private popupChange( value: boolean ) {
    this.$emit('change', value);
    this.allClear();
  }

  /**
   * 일정 등록시 타이틀 부분
   * @param val
   * @private
   */
  private addPostTitleChange(val: string) {
    this.postData.title=val;
    // console.log(this.scheduleData.title);
  }

  /**
   *  새일정 등록 > textarea 에 글 입력시
   * @param value
   * @private
   */
  private postDetailAreaInputHandler(value: any) {
    this.postData.text=value;
    const scheduleDetailAreaTxt=this.$refs.scheduleDetailAreaTxt as HTMLInputElement;
    scheduleDetailAreaTxt.style.height = String( Utils.autoResizeTextArea(this.postData.text) + 'px');
  }



  /**
   * 이미지등록 아이콘 클릭시 > input type=file 에 클릭 이벤트 발생시킴.
   * @private
   */
  private addImgFileInputFocus() {
    this.inputEventBind('#imgFileInput');
  }

  private addFilesInputFocus(){
    this.inputEventBind('#attachFileInput');
  }

  /**
   * //input click event 발생시키기.
   * @param targetSelector
   * @private
   */
  private inputEventBind( targetSelector: string ) {
    //파일 input 에 클릭 이벤트 붙이기~
    const imgFileInput = document.querySelector(targetSelector) as HTMLInputElement;
    //input click event 발생시키기.
    imgFileInput.dispatchEvent(Utils.createMouseEvent('click'));
  }

  //start : 이미지 preview  및 이미지 등록 ================================================
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
    this.imgFileService.remove(idx);
  }
  /**
   * 추가된 이미지 파일 모두 지우기
   * @private
   */
  private onRemoveAllPreview(): void {
    this.imgFileService.removeAll();
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

    const validLinkItems: Array<{ index: number, url: string }> = [];
    this.linkData.link_item_list.forEach( (item: { index: number, url: string } )=>{
      //유효하지 않은 url 찾기
      // console.log(item.url !== '', Utils.getIsValidLink(item.url) );
      if( item.url!=='' && Utils.getIsValidLink(item.url)  ){
        validLinkItems.push(item);
      }
    });
    return validLinkItems.length > 0;
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
    this.ADD_POST_ACTION({classId: Number(this.classID), formData: this.formData})
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
        this.allClear();
        this.$emit('submit', false); //post 등록 팝업 닫기 알림~
    });
  }

  //start : vote 이벤트 핸들러 ================================================
  private addVotePopupOpen() {
    this.isOpenAddVotePopup=true;
    console.log(this.isOpenAddVotePopup);
  }
  private onVotePopupClose(value: boolean ) {
    this.isOpenAddVotePopup=value;
    this.voteDataClear();
  }
  private onAddVote( voteData: IVoteModel) {
    this.voteData = voteData;
    this.isOpenAddVotePopup=false;
    // console.log(voteData);
  }
  private voteDataClear() {
    this.voteData={
      vote: {
        parent_id: -1,
        type: 0,
        title: '',
        multi_choice: 0,
        anonymous_mode: 0,
        open_progress_level: 0,
        open_result_level: 0,
        finishAt: '',
      },
      vote_choice_list: []
    };
  }
  private onModifyVote() {
    this.isOpenAddVotePopup=true;
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
}
