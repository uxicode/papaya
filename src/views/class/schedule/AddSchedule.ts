import {Component, Mixins, Prop} from 'vue-property-decorator';
import UtilsMixins from '@/mixin/UtilsMixins';
import {ImageFileService} from '@/views/service/preview/ImageFileService';
import {AttachFileService} from '@/views/service/preview/AttachFileService';
import ImageSettingService from '@/views/service/profileImg/ImageSettingService';
import TxtField from '@/components/form/txtField.vue';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
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
    Btn
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

  private onAddSchedulePopupCloseHandler(): void{
    this.isOpen=false;
    this.loopRangeCheck = false;

    //첨부 파일들 초기화
    this.removeAllPreview();
    this.removeAllAttachFile();
  }

  /**
   * 추가된 이미지 파일 모두 지우기
   * @private
   */
  private removeAllPreview(): void {
   /* this.imgFileURLItems = [];
    this.imgFileDatas=[];
    this.imageLoadedCount=0;*/
  }
  private removeAllAttachFile(): void {
    // this.attachFileItems = [];
  }

/*  private getProfileImg(imgUrl: string | null | undefined ): string{
    return ImageSettingService.getProfileImg( imgUrl );
  }*/

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

    this.txtEleH( scheduleDetailAreaTxt, this.scheduleData.body );
  }

  private txtEleH( txtAreaEle: HTMLTextAreaElement, txt: string ) {
    // const scheduleDetailAreaTxt=this.$refs.scheduleDetailAreaTxt as HTMLInputElement;

    let txtAreaSizeTotal=0;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < txt.length; i++) {
      //영문/한글 섞인 문자를 바이트 수 계산
      txtAreaSizeTotal += Utils.getCharByteSize(txt.charAt(i));
    }
    const lineH=20;
    const maxTxtLen=117; //한줄에 최대한 들어갈 수 있는 텍스트의 바이트 수 - 영문/한글 섞인 계산된 바이트 수
    const lineInLen=txtAreaSizeTotal/maxTxtLen; //maxTxtLen , 즉 몇줄까지 입력되었는 지 라인 수 계산
    const numOfLine: number = (txt.match(/\n/g) || []).length; // 엔터키가 몇개 들어 갔는 지 체크
    const resultH=lineH+( lineInLen+numOfLine)*lineH; //1줄 높이( 20px )+( 텍스트 입력 라인 수+엔터키 개수 ) * 1줄 높이( 20px )

    // txtAreaEle.style.height = String( Utils.autoResizeTextArea(txt) + 'px');
    txtAreaEle.style.height = resultH+'px';
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

  //모델에 이미지 파일 추가
  private async addAttachFileTo( files: FileList ){
    //전달되는 파일없을시 여기서 종료.
    if( !files.length ){ return; }

    // this.setAttachFileSave(files);
    //file type input
    const attachFileInput =document.querySelector('#attachFileInput') as HTMLInputElement;
    attachFileInput.value = '';
  }


  /**
   * 새일정> 등록 버튼 클릭시 팝업 닫기 및 데이터 전송 (
   * @private
   */
  private submitAddSchedule(): void{
    //시나리오 --> 등록 버튼 클릭 > 이미지 추가한 배열값 formdata에 입력 > 전송 >전송 성공후> filesAllClear 호출 > 팝업 닫기
    // this.setImageFormData();
    // this.setAttachFileFormData();

    //전송이 완료 되었다는 전제하에 아래 구문 수행
    setTimeout(() => {
      this.isOpen=false;
      // this.imgFilesAllClear();
    }, 500);

  }

}
