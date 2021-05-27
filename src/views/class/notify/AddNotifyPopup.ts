import {Vue, Component, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IClassInfo} from '@/views/model/my-class.model';
import {Utils} from '@/utils/utils';
import {ICreatePost, ILinkModel, IVoteModel} from '@/views/model/post.model';
import {PostService} from '@/api/service/PostService';
import AddVotePopup from '@/views/class/notify/AddVotePopup';
import AddLinkPopup from '@/views/class/notify/AddLinkPopup';
import {ImageFileService} from '@/views/service/preview/ImageFileService';
import {AttachFileService} from '@/views/service/preview/AttachFileService';
import ImageSettingService from '@/views/service/profileImg/ImageSettingService';
import TxtField from '@/components/form/txtField.vue';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';
import FilePreview from '@/components/preview/filePreview.vue';
import ImagePreview from '@/components/preview/imagePreview.vue';
import LinkPreview from '@/components/preview/linkPreview.vue';
import WithRender from './AddNotifyPopup.html';

const MyClass = namespace('MyClass');

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
    LinkPreview
  }
})
export default class AddNotifyPopup extends Vue{

  @Prop(Boolean)
  private isOpen!: boolean;

  @MyClass.Getter
  private classID!: string | number;

  @MyClass.Getter
  private myClassHomeModel!: IClassInfo;

  private isOpenAddVotePopup: boolean=false;
  private isOpenAddLinkPopup: boolean=false;
  private imageLoadedCount: number=0;
  private alarmAt: Date=new Date();
  private voteData!: IVoteModel;

  private postData: ICreatePost = { title: '', text: ''};

  // private imgFileURLItems: string[] = [];
  // private imgFileDatas: any[] = [];
  // private attachFileItems: any[] = [];
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
    return this.imgFileService.getImgURLItems();
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

  get linkTitle(): string{
    return this.linkData.link.title;
  }


  private getProfileImg(imgUrl: string | null | undefined ): string{
    return ImageSettingService.getProfileImg( imgUrl );
  }

  private popupChange( value: boolean ) {
    this.$emit('change', value);
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
  private removeImgPreviewItems(idx: number): void{
    this.imgFileService.remove(idx);
  }
  /**
   * 추가된 이미지 파일 모두 지우기
   * @private
   */
  private removeAllPreview(): void {
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
    //시나리오 --> 등록 버튼 클릭 > 이미지 추가한 배열값 formdata에 입력 > 전송 >전송 성공후> filesAllClear 호출 > 팝업 닫기

    // this.setImageFormData();
    this.imgFileService.save( this.formData );
    // this.setAttachFileFormData();
    this.attachFileService.save(this.formData);
    this.setPostDataToFormData();
  }



  private onAddPostSubmit() {
    this.submitAddPost();
  }

  private setPostDataToFormData() {
    if( !this.isSubmitValidate ){return;}


    const temp = JSON.stringify( {...this.postData } );
    this.formData.append('data', temp );
    console.log(this.voteData, temp);


    PostService.setAddPost(this.classID, this.formData )
      .then((data)=>{
        console.log(data.post.id);
        this.$emit('submit', false);


        if (this.voteData) {
          let { parent_id } = this.voteData;
          parent_id=data.post.id;
          PostService.setAddVote(this.classID, {...this.voteData, parent_id})
            .then(( voteData: any)=>{
              console.log(voteData);
            });
        }

        this.imgFilesAllClear();
        this.attachFilesAllClear();
        this.postData={ title: '', text: ''};
      });
  }


  private addVote() {
    this.isOpenAddVotePopup=true;
    console.log(this.isOpenAddVotePopup);
  }


  private onAddVoteClose( value: boolean ) {
    this.isOpenAddVotePopup=value;
  }

  private onAddVote( voteData: IVoteModel) {
    this.voteData = voteData;
    this.isOpenAddVotePopup=false;
    console.log(voteData);
  }

  private addLink() {
    this.isOpenAddLinkPopup=true;
  }

  private modifyLink() {
    this.isOpenAddLinkPopup=true;
  }

  private removeLinkItem(idx: number) {
    this.linkData.link_item_list.splice(idx, 1);
  }

  private onAddLinkClose( value: boolean ) {
    this.isOpenAddLinkPopup=value;
  }

  private onAddLink(linkData: ILinkModel) {
    this.isOpenAddLinkPopup=false;
    this.linkData = linkData;
  }




}
