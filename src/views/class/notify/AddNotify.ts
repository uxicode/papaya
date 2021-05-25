import {Vue, Component, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IClassInfo} from '@/views/model/my-class.model';
import {Utils} from '@/utils/utils';
import ImageSettingService from '@/views/service/profileImg/ImageSettingService';
import TxtField from '@/components/form/txtField.vue';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';
import FilePreview from '@/components/preview/filePreview.vue';
import ImagePreview from '@/components/preview/imagePreview.vue';
import WithRender from './AddNotify.html';
import {ICreatePost} from '@/views/model/post.model';
import {PostService} from '@/api/service/PostService';

const MyClass = namespace('MyClass');


@WithRender
@Component({
  components:{
    TxtField,
    Btn,
    Modal,
    ImagePreview,
    FilePreview
  }
})
export default class AddNotify extends Vue{


  @Prop(Boolean)
  private isOpen!: boolean;


  @MyClass.Getter
  private classID!: string | number;

  @MyClass.Getter
  private myClassHomeModel!: IClassInfo;

  private imageLoadedCount: number=0;
  private alarmAt: Date=new Date();
  private vote: {
    type: number,
    title: string,
    multi_choice: number,
    anonymous_mode: number,
    open_progress_level: number,
    open_result_level: number,
    vote_choice_list: Array<{
      text: string,
      index: number
    }>
  } = {
    type: 0,
    title: '',
    multi_choice: 0,
    anonymous_mode: 0,
    open_progress_level: 0,
    open_result_level: 0,
    vote_choice_list: [
      {
        text: '',
        index: 0
      }
    ]
  };

  private postData: ICreatePost = { title: '', text: ''};

  private imgFileURLItems: string[] = [];
  private imgFileDatas: any[] = [];
  private attachFileItems: any[] = [];
  private formData!: FormData;

  get imgFileURLItemsModel(): string[] {
    return this.imgFileURLItems;
  }

  get attachFileItemsModel(): any[] {
    return this.attachFileItems;
  }

  get isSubmitValidate(): boolean{
    return (this.postData.title !== '' && this.postData.text !== '');
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
    const imgFileInput =document.querySelector( targetSelector ) as HTMLInputElement;
    //input click event 발생시키기.
    imgFileInput.dispatchEvent( Utils.createMouseEvent('click') );
  }


  /**
   * 이미지 파일 -> 배열에 지정 / 미리보기 link( blob link) 배열 생성~
   * @param data
   * @private
   */
  private setImgFilePreviewSave(data: FileList ): void {
    // console.log(data);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < data.length; i++) {
      this.imgFileDatas.push(data[i]);
      this.imgFileURLItems.push(URL.createObjectURL(data[i]));
    }
    /*data.forEach( ( item: File ) => {
        // console.log(data,  item, Utils.getFileType(item) );

    }); */
  }

  private setAttachFileSave(data: FileList ): void {
    // console.log(data);
    for (const file of data) {
      // console.log(data,  item, Utils.getFileType(item) );
      this.attachFileItems.push(file);
    }
  }


  /**
   * 새일정> 등록 버튼 클릭시 팝업 닫기 및 데이터 전송 (
   * @private
   */
  private submitAddPost(): void{
    //시나리오 --> 등록 버튼 클릭 > 이미지 추가한 배열값 formdata에 입력 > 전송 >전송 성공후> filesAllClear 호출 > 팝업 닫기

    this.setImageFormData();
    this.setAttachFileFormData();
    this.setPostDataToFormData();
  }

  private onAddPostSubmit() {
    this.submitAddPost();
  }

  private setPostDataToFormData() {
    if( !this.isSubmitValidate ){return;}

    if (Utils.isUndefined(this.formData)) {
      this.formData = new FormData();
    }

    const temp = JSON.stringify( {...this.postData} );
    this.formData.append('data', temp );
    // this.formData.append('data', this.postData );

    PostService.setAddPost(this.classID, this.formData )
      .then((data)=>{
        console.log(data);
        this.$emit('submit', false);

        this.imgFilesAllClear();
      });

  }


  /**
   * 이미지 파일이 저장된 배열을 전송할 formdata 에 값 대입.
   * @private
   */
  private setImageFormData() {

    if( !this.imgFileDatas.length ){ return; }

    if (Utils.isUndefined(this.formData)) {
      this.formData= new FormData();
    }
    // 아래  'files'  는  전송할 api 에 지정한 이름이기에 맞추어야 한다. 다른 이름으로 되어 있다면 변경해야 함.
    this.formDataAppendToFile(this.imgFileDatas, 'files');
  }

  /**
   * 첨부 파일이 저장된 배열을 전송할 formdata 에 값 대입.
   * @private
   */
  private setAttachFileFormData() {
    if( !this.attachFileItems.length ){ return; }

    if (Utils.isUndefined(this.formData)) {
      this.formData= new FormData();
    }
    // 아래  'files'  는  전송할 api 에 지정한 이름이기에 맞추어야 한다. 다른 이름으로 되어 있다면 변경해야 함.
    this.formDataAppendToFile(this.attachFileItems, 'files'  );
  }

  /**
   * formdata 에 append 하여 formdata ( 딕셔너리 목록 ) 추가하기.
   * @param targetLists
   * @param appendName
   * @private
   */
  private formDataAppendToFile( targetLists: File[], appendName: string | string[] ) {
    targetLists.forEach(( item: File, index: number )=>{
      // console.log(item, item.name);
      // 아래  'files'  는  전송할 api 에 지정한 이름이기에 맞추어야 한다. 다른 이름으로 되어 있다면 변경해야 함.
      if( Array.isArray(appendName) ){
        this.formData.append( appendName[index], item, item.name );
      }else{
        this.formData.append(appendName, item, item.name );
      }
    });
  }
  //모델에 이미지 파일 추가
  private addFileToImage( files: FileList ){


    //전달되는 파일없을시 여기서 종료.
    if( !files.length ){ return; }

    this.setImgFilePreviewSave(files);
    //file type input
    const imgFileInput =document.querySelector('#imgFileInput') as HTMLInputElement;
    imgFileInput.value = '';
  }

  //모델에 이미지 파일 추가
  private async addAttachFileTo( files: FileList ){
    //전달되는 파일없을시 여기서 종료.
    if( !files.length ){ return; }

    this.setAttachFileSave(files);
    //file type input
    const attachFileInput =document.querySelector('#attachFileInput') as HTMLInputElement;
    attachFileInput.value = '';
  }

  /**
   * 추가된 이미지 파일 제거하기
   * @param idx
   * @private
   */
  private removeImgPreviewItems(idx: number): void{
    const blobURLs=this.imgFileURLItems.splice(idx, 1);
    this.removeBlobURL( blobURLs ); // blob url 제거
    this.imgFileDatas.splice(idx, 1);
    //console.log( this.formData.getAll('files')  );
  }
  /**
   * // blob url 폐기시키고 가비지 컬렉터 대상화시킴
   * - 확인하는 방법은 현재 이미지에 적용된 src 주소값을 복사해서 현재 브라우저에 주소를 붙여 실행해 보면 된다. 이미지가 보이면 url 이 폐기되지 않은 것이다.
   * @private
   */
  private removeBlobURL( items: string[] ) {
    items.forEach((item) => URL.revokeObjectURL(item));
  }

  /**
   * 추가된 이미지 파일 모두 지우기
   * @private
   */
  private removeAllPreview(): void {
    this.imgFileURLItems = [];
    this.imgFileDatas=[];
    this.imageLoadedCount=0;
  }

  private removeAllAttachFile(): void {
    this.attachFileItems = [];
  }

  private removeAttachFileItem(idx: number): void{
    this.attachFileItems.splice(idx, 1);
    //console.log( this.formData.getAll('files')  );
  }

  //이미지 로드 완료 카운트
  private imageLoadedCheck(): void{
    this.imageLoadedCount++;
    console.log(this.imageLoadedCount);
  }
  private attachFilesAllClear() {
    this.attachFileItems = [];
    this.formData.delete('files');
    // this.imageLoadedCount=0;
  }

  private imgFilesAllClear() {
    this.imgFileURLItems = [];
    this.imgFileDatas=[];
    this.postData={ title: '', text: ''};
    this.formData.delete('files');
    this.imageLoadedCount=0;
  }





}
