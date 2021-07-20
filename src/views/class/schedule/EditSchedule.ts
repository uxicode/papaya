import {Component, Mixins, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import UtilsMixins from '@/mixin/UtilsMixins';
import {IClassInfo} from '@/views/model/my-class.model';
import {IAddSchedule, IScheduleDetail, ITimeModel} from '@/views/model/schedule.model';
import {ImageFileService} from '@/views/service/preview/ImageFileService';
import {AttachFileService} from '@/views/service/preview/AttachFileService';
import TxtField from '@/components/form/txtField.vue';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import FilePreview from '@/components/preview/filePreview.vue';
import ImagePreview from '@/components/preview/imagePreview.vue';
import {Utils} from '@/utils/utils';
import {ScheduleService} from '@/api/service/ScheduleService';
import WithRender from './EditSchedule.html';

const MyClass = namespace('MyClass');
const Schedule = namespace('Schedule');

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
export default class EditSchedule extends Mixins(UtilsMixins) {

  @Prop(Boolean)
  private isOpen!: boolean;

  @Schedule.Action
  private ADD_SCHEDULE_ACTION!: (payload: { classId: number, formData: FormData }) => Promise<any>;

  @Schedule.Action
  private EDIT_SCHEDULE_ACTION!: (payload: { classId: number, scheduleId: number, promise: Array<Promise<any>> })=>Promise<any>;

  @Schedule.Getter
  private scheduleDetailItem!: IScheduleDetail;

  @MyClass.Getter
  private classID!: string | number;

  @MyClass.Getter
  private myClassHomeModel!: IClassInfo;

  private scheduleData: IAddSchedule= {
    repeat_type: 0,
    repeat_count: 0,
    fullday: 0,
    title: '',
    body: '',
    evt_startAt: '',  //2019-11-15 10:00:00
    evt_endAt: '',
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
  //0 - 없음 , 1 - 매일 , 2 - 매주 , 3 - 2주마다 , 4 - 매월 , 5 - 매년
  private loopRangeItems: Array<{id: number, txt: string}>= [
    {id:0, txt:'반복없음'},
    {id:1, txt:'매일'},
    {id:2, txt:'매주'},
    {id:3, txt:'2주마다'},
    {id:4, txt:'매월'},
    {id:5, txt:'매년'}
    ];
  private loopRangeCheck: boolean=false;
  private loopRangeCount: number | string=-1;
  private removeFiles: number[]= [];

  private formData: FormData=new FormData();
  private imgFileService: ImageFileService=new ImageFileService();
  private attachFileService: AttachFileService=new AttachFileService();

  get imgFileURLItemsModel(): string[] {
    return this.imgFileService.getItems();
  }
  get attachFileItemsModel(): any[] {
    return this.attachFileService.getItems();
  }


  get currentLoopRangeItems(): Array<{id: number, txt: string}>{
    return this.loopRangeItems;
  }

  get currentStartTimeModel(): string{
    return `${this.startTimeSelectModel.apm} ${this.startTimeSelectModel.hour}시 ${this.startTimeSelectModel.minute} 분`;
  }

  get currentEndTimeModel(): string{
    return `${this.endTimeSelectModel.apm} ${this.endTimeSelectModel.hour}시 ${this.endTimeSelectModel.minute} 분`;
  }


  /**
   * 클릭한 상세 정보값이 들어오고 난 후에 postData 를 갱신해야 한다.
   */
  get scheduleDetailModel(): IScheduleDetail{
    const { startAt, endAt, id, title, text, count, attachment, param1, type }=this.scheduleDetailItem;
    // this.alarmData = { alarmAt };
    this.scheduleData={
      title,
      body:text,
      repeat_type: type,   //0 - 없음 , 1 - 매일 , 2 - 매주 , 3 - 2주마다 , 4 - 매월 , 5 - 매년
      fullday: param1,
      repeat_count: count,
      evt_endAt: endAt,
      evt_startAt: startAt
    };
    /*this.scheduleData.title=title;
    this.scheduleData.body=text;
    this.scheduleData.repeat_type=type;
    this.scheduleData.fullday=param1;
    this.scheduleData.repeat_count=count;*/

    const findIdx=this.loopRangeItems.findIndex(( item: {id: number, txt: string})=>{
      return item.id===this.scheduleData.repeat_type;
    });
    this.loopRangeModel=this.loopRangeItems[findIdx].txt;
    this.loopRangeCount=count;


    //여기 startAt-->startTimeSelectModel, endAt---> endTimeSelectModel 전환 하는 작업 필요.
    const startFullDate=new Date(startAt);
    this.startDatePickerModel=startFullDate.toISOString().substr(0, 10);
    this.startTimeSelectModel.apm=Utils.getAmPm( startFullDate );
    this.startTimeSelectModel.hour=Utils.getHours(true, startFullDate );
    this.startTimeSelectModel.minute=Utils.getMinutes( startFullDate );

    console.log(startFullDate, this.startTimeSelectModel);


    const endFullDate=new Date(endAt);
    this.endDatePickerModel=endFullDate.toISOString().substr(0, 10);
    this.endTimeSelectModel.apm=Utils.getAmPm( endFullDate );
    this.endTimeSelectModel.hour=Utils.getHours(true, endFullDate );
    this.endTimeSelectModel.minute=Utils.getMinutes( endFullDate );

    // this.scheduleData= { title, text };

    if (attachment.length && attachment.length>0) {
      //이미지 파일이 있을 시 화면에 로드 시켜둠  //imgPreviewInit : mixin 에 정의됨.
      this.imgFileService.setAttachItems( this.imgPreviewInit(attachment) );
      //첨부파일 있을시 화면에 로드 시켜둠 //attachFilePreviewInit : mixin 에 정의됨.
      this.attachFileService.setAttachItems( this.attachFilePreviewInit( attachment) );
    }

    return this.scheduleDetailItem;
  }

  get scheduleDataModel() {
    return this.scheduleData;
  }


  private addStartApmSchedule( val: string ) {
    // console.log(val, this.currentStartTimeModel );
  }


  private getStartAt() {
    const apm = this.startTimeSelectModel.apm;
    const selectHour= Number( this.startTimeSelectModel.hour );
    const hour=( apm === '오후' )? selectHour+12 : selectHour;
    const minute = this.startTimeSelectModel.minute;

    // //2019-11-15 10:00:00
    return `${this.startDatePickerModel} ${hour}:${minute}`;
  }

  private getEndAt() {
    const apm = this.endTimeSelectModel.apm;
    const selectHour= Number( this.endTimeSelectModel.hour );
    const hour=( apm === '오후' )? selectHour+12 : selectHour;
    const minute = this.endTimeSelectModel.minute;

    // //2019-11-15 10:00:00
    return `${this.endDatePickerModel} ${hour}:${minute}`;
  }


  private getDateRangeAt() {
    let {evt_startAt, evt_endAt} = this.scheduleData;
    evt_startAt = this.getStartAt();
    evt_endAt = this.getEndAt();
    this.scheduleData = {...this.scheduleData, evt_startAt, evt_endAt};
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
    //파일 제거를 api 통신 하지 않고 배열에 저장해 둔다. ( 최종 수정 버튼을 누를때 해당 제거에 대한 통신을 한다 )
    const deleteFileId= this.imgFileService.getItemById(idx).file.id;
    if (deleteFileId) {
      this.removeFiles.push(deleteFileId);
    }
    this.imgFileService.remove(idx);
  }
  /**
   * 추가된 이미지 파일 모두 지우기
   * @private
   */
  private onRemoveAllPreview(): void {
    const fileItems=this.imgFileService.getFileItems();
    //파일 제거를 api 통신 하지 않고 배열에 저장해 둔다. ( 최종 수정 버튼을 누를때 해당 제거에 대한 통신을 한다 )
    this.removeToItems(fileItems);
    //
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
    const fileItems=this.attachFileService.getFileItems();
    //파일 제거를 api 통신 하지 않고 배열에 저장해 둔다. ( 최종 수정 버튼을 누를때 해당 제거에 대한 통신을 한다 )
    this.removeToItems(fileItems);
    this.attachFileService.removeAll();
  }
  private removeAttachFileItem(idx: number): void{
    //파일 제거를 api 통신 하지 않고 배열에 저장해 둔다. ( 최종 수정 버튼을 누를때 해당 제거에 대한 통신을 한다 )
    const deleteFileId= this.attachFileService.getItemById(idx).file.id;
    if (deleteFileId) {
      this.removeFiles.push(deleteFileId);
    }
    this.attachFileService.remove(idx);
  }
  private attachFilesAllClear() {
    this.attachFileService.removeAll();
    this.formData.delete('files');
  }
  //end : 파일 첨부 미리보기 및 파일 업로드 ================================================

  private removeToItems( fileItems: any[] ) {
    const ids=fileItems
      .map((item) =>(item.file.fieldname) ? item.file.id : '')
      .filter((item) => item !== '');
    if (ids.length > 0) {
      this.removeFiles = [...this.removeFiles, ...ids];
    }
  }

  private loopRangeCountClickHandler( value: number | string ){
    this.loopRangeCount=Number( value );
    console.log(this.loopRangeCount);
    // let {repeat_count}=this.scheduleData;
    // repeat_count = this.loopRangeCount;
    // console.log(this.loopRangeCount);
    // this.scheduleData = {...this.scheduleData, repeat_count};
    this.scheduleData.repeat_count=this.loopRangeCount;
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

  private popupClose() {
    this.popupChange( false );
    this.allClear();
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
   * 알림 데이터 post 전송
   * @private
   */
  private async onEditSubmitSchedule() {
    // if( !this.isSubmitValidate ){return;}

    //데이터를 전달하기도 전에 this.allClear 하는 문제 해결해야 함.
    await this.editInfos()
      .then(()=>{
        // this.allClear();
        this.popupChange(false);
        console.log('editInfos 함수 수정 완료');
        this.$emit('editComplete');
      });
  }

  /**
   * 새일정> 등록 버튼 클릭시 팝업 닫기 및 데이터 전송 (
   * @private
   */
  private async editInfos(){

    const { id }= this.scheduleDetailItem;
    const editPromiseItems = [];

    if (this.removeFiles.length > 0) {
      //ostService.deletePostFileById(classId, postId, {ids})
      const removeFiles=ScheduleService.deleteScheduleFileById(Number( this.classID ), id, {ids:this.removeFiles});
      editPromiseItems.push(removeFiles);
    }
    //시나리오 --> 등록 버튼 클릭 > 이미지 추가한 배열값 formdata에 입력 > 전송 >전송 성공후> filesAllClear 호출 > 팝업 닫기
    //이미지 파일 저장.
    this.imgFileService.save( this.formData );

    //파일 저장.
    this.attachFileService.save( this.formData );

    //시작/끝 시간
    this.getDateRangeAt();

    //formdata 에 데이터를 적용하려면 문자열 타입 직렬화 해야 한다.
    const temp = JSON.stringify( this.scheduleData );
    this.formData.append('data', temp );

    // console.log(this.scheduleData);

    const allEditInfo=ScheduleService.setScheduleInfoById( Number( this.classID ), id, this.formData );
    editPromiseItems.push( allEditInfo );

    this.EDIT_SCHEDULE_ACTION({ classId: Number(this.classID), scheduleId: id, promise: editPromiseItems })
      .then((data) => {
        this.allClear();
      });

  }

  private formDataPlainClear() {
    this.formData.delete('data');
  }

  private allClear() {
    // 등록이 완료되고 나면 해당 저장했던 데이터를 초기화 시켜 두고 해당 팝업의  toggle 변수값을 false 를 전달해 팝업을 닫게 한다.
    this.imgFilesAllClear(); //이미지 데이터 비우기
    this.attachFilesAllClear();//파일 데이터 비우기
    this.scheduleData={
      repeat_type: 0,
      repeat_count: 0,
      fullday: 0,
      title: '',
      body: '',
      evt_startAt: '',  //2019-11-15 10:00:00
      evt_endAt: '',
    };
    this. formDataPlainClear();
  }

}
