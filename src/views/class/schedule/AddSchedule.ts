import {Component, Mixins, Prop} from 'vue-property-decorator';
import UtilsMixins from '@/mixin/UtilsMixins';
import {ImageFileService} from '@/views/service/preview/ImageFileService';
import {AttachFileService} from '@/views/service/preview/AttachFileService';
import ImageSettingService from '@/views/service/profileImg/ImageSettingService';
import TxtField from '@/components/form/txtField.vue';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import FilePreview from '@/components/preview/filePreview.vue';
import ImagePreview from '@/components/preview/imagePreview.vue';
import WithRender from './AddSchedule.html';
import {ITimeModel} from '@/views/model/schedule.model';
import {Utils} from '@/utils/utils';
import {IClassInfo} from '@/views/model/my-class.model';
import {namespace} from 'vuex-class';


const MyClass = namespace('MyClass');

@WithRender
@Component({
  components:{
    Modal,
    TxtField,
    Btn,
    FilePreview,
    ImagePreview
  }
})
export default class AddSchedule extends Mixins(UtilsMixins) {

  @Prop(Boolean)
  private isOpen!: boolean;

  @MyClass.Getter
  private classID!: string | number;

  @MyClass.Getter
  private myClassHomeModel!: IClassInfo;

  private scheduleData: {
    repeat_type: number,
    repeat_count: number,
    fullday: string | boolean,
    title: string,
    body: string,
    startAt: Date,  //2019-11-15 10:00:00
    endAt: Date;
  } = {
    repeat_type: 0,
    repeat_count: 0,
    fullday: '',
    title: '',
    body: '',
    startAt:new Date(),  //2019-11-15 10:00:00
    endAt: new Date()
  };

  private startDatePickerModel: string= new Date().toISOString().substr(0, 10);
  private startTimeSelectModel: ITimeModel={ apm:'오전', hour:'12', minute: '30'};
  private startDateMenu: boolean= false; // 캘린 셀렉트 열고 닫게 하는 toggle 변수
  private startTimeMenu: boolean=false;  // 시간 셀렉트 열고 닫게 하는 toggle 변수

  private endDatePickerModel: string= new Date().toISOString().substr(0, 10);
  private endTimeSelectModel: ITimeModel={ apm:'오전', hour:'12', minute: '30'};
  private endDateMenu: boolean=false;  // 캘린더 셀렉트 열고 닫게 하는 toggle 변수
  private endTimeMenu: boolean=false;  // 시간 셀렉트 열고 닫게 하는 toggle 변수

  private loopRangeModel: string = '반복없음';
  private loopRangeItems: string[] = ['반복없음', '매일', '매주', '매월', '매년'];
  private loopRangeCheck: boolean=false;
  private loopRangeCount: number | string=10;

  private formData: FormData=new FormData();
  private imgFileService: ImageFileService=new ImageFileService();
  private attachFileService: AttachFileService=new AttachFileService();

  get imgFileURLItemsModel(): string[] {
    return this.imgFileService.getItems();
  }
  get attachFileItemsModel(): any[] {
    return this.attachFileService.getItems();
  }


  get currentLoopRangeItems(): string[]{
    return this.loopRangeItems;
  }

  get currentStartTimeModel(): string{
    return `${this.startTimeSelectModel.apm} ${this.startTimeSelectModel.hour}시 ${this.startTimeSelectModel.minute} 분`;
  }

  get currentEndTimeModel(): string{
    return `${this.endTimeSelectModel.apm} ${this.endTimeSelectModel.hour}시 ${this.endTimeSelectModel.minute} 분`;
  }


  private addStartApmSchedule( val: string ) {
    // console.log(val, this.currentStartTimeModel );
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

  private loopRangeCountClickHandler( value: string ){
    this.loopRangeCount=value;
    // console.log(this.loopRangeCount);
  }
  /**
   * 일정 등록시 타이틀 부분
   * @param val
   * @private
   */
  private addScheduleTitleChange(val: string) {
    this.scheduleData.title=val;
    // console.log(this.scheduleData.title);
  }

  private popupChange( value: boolean ) {
    this.loopRangeCheck = false;

    //첨부 파일들 초기화
    // this.removeAllPreview();
    // this.removeAllAttachFile();
    this.$emit('change', value);
  }


  /**
   * 일정 등록시  하루종일 표시 유무 - true/false 로 등록하기에 전송시 0/1 로 변환해서 전송필요.
   * @param val
   * @private
   */
  private fulldayCheckChange(val: boolean | string) {
    this.scheduleData.fullday=!!val;
  }

  /**
   * 시작일시 - datepicker 일자 선택시
   * @private
   */
  private startDatePickerChange( ) {
    this.startDateMenu = false;
    // console.log(this.startDatePickerModel);
  }


  /**
   *  새일정 등록 > textarea 에 글 입력시
   * @param value
   * @private
   */
  private scheduleDetailAreaInputHandler(value: any) {
    this.scheduleData.body=value;
    const scheduleDetailAreaTxt=this.$refs.scheduleDetailAreaTxt as HTMLTextAreaElement;
    /* scheduleDetailAreaTxt.style.height = String( Utils.autoResizeTextArea(this.scheduleData.body) + 'px');*/

    this.txtAreaEleH( scheduleDetailAreaTxt, this.scheduleData.body );
  }


  /**
   * 새일정> 등록 버튼 클릭시 팝업 닫기 및 데이터 전송 (
   * @private
   */
  private submitAddSchedule(): void{
    //시나리오 --> 등록 버튼 클릭 > 이미지 추가한 배열값 formdata에 입력 > 전송 >전송 성공후> filesAllClear 호출 > 팝업 닫기
    //이미지 파일 저장.
    this.imgFileService.save( this.formData );

    //파일 저장.
    this.attachFileService.save( this.formData );



    //formdata 에 데이터를 적용하려면 문자열 타입 직렬화 해야 한다.
    // const temp = JSON.stringify( mergeData );
    // this.formData.append('data', temp );

    //전송이 완료 되었다는 전제하에 아래 구문 수행
    setTimeout(() => {
      // this.imgFilesAllClear();

      this.allClear();
      this.popupChange(false);
    }, 500);

  }


  private allClear() {
    // 등록이 완료되고 나면 해당 저장했던 데이터를 초기화 시켜 두고 해당 팝업의  toggle 변수값을 false 를 전달해 팝업을 닫게 한다.
    this.imgFilesAllClear(); //이미지 데이터 비우기
    this.attachFilesAllClear();//파일 데이터 비우기
  }

}
