import {Vue, Component, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import TxtField from '@/components/form/txtField.vue';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import {
    IClassInfo,
    IMakeEducation,
} from '@/views/model/my-class.model';
import {ITimeModel} from '@/views/model/schedule.model';
import {Utils} from '@/utils/utils';
import {ImageFileServiceHelper} from '@/views/service/preview/ImageFileService';
import {AttachFileService} from '@/views/service/preview/AttachFileService';
import ListInImgPreview from '@/components/preview/ListInImgPreview.vue';
import ListInFilePreview from '@/components/preview/ListInFilePreview.vue';
import FilePreview from '@/components/preview/filePreview.vue';
import ImagePreview from '@/components/preview/imagePreview.vue';
import WithRender from './AddCoursePopup.html';

const MyClass = namespace('MyClass');

@WithRender
@Component({
    components:{
        TxtField,
        Modal,
        Btn,
        ImagePreview,
        FilePreview,
        ListInImgPreview,
        ListInFilePreview,
    }
})

// 상속, 오버라이딩, 타입스크립트 / 객체지향
export default class AddCoursePopup extends Vue {

    @Prop(Boolean)
    private isOpen!: boolean;

    @Prop(Object)
    private makeCurriculumData!: IMakeEducation;

    @Prop(Number)
    private courseIdx!: number;

    @Prop(FormData)
    private formData!: FormData;

    @Prop(Object)
    private imgFileService!: ImageFileServiceHelper;

    @Prop(Object)
    private attachFileService!: AttachFileService;

    @MyClass.Getter
    private classID!: number;

    @MyClass.Getter
    private myClassHomeModel!: IClassInfo;

    private dateMenu: boolean=false;
    private startTimeMenu: boolean=false;
    private endTimeMenu: boolean=false;
    private datePickerModel: string= new Date().toISOString().substr(0, 10);
    private startTimeSelectModel: ITimeModel={ apm:'오전', hour:'12', minute: '30'};
    private endTimeSelectModel: ITimeModel={ apm:'오전', hour:'12', minute: '30'};
    private referTimeItems={
        apm: ['오전', '오후'],
        hour: [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        minute: [ '5', '10','15', '20','25', '30','35', '40', '45', '50', '55', '00']
    };

    get imgFileURLItemsModel(): string[] {
        return this.imgFileService.getItems();
    }

    get attachFileItemsModel(): any[] {
        return this.attachFileService.getItems();
    }

    get currentStartTimeModel(): string{
        return `${this.startTimeSelectModel.apm} ${this.startTimeSelectModel.hour}시 ${this.startTimeSelectModel.minute} 분`;
    }

    get currentEndTimeModel(): string{
        return `${this.endTimeSelectModel.apm} ${this.endTimeSelectModel.hour}시 ${this.endTimeSelectModel.minute} 분`;
    }

    private addStartApmSchedule( val: string ) {
        console.log(val, this.currentStartTimeModel );
    }

    private addEndApmSchedule( val: string ) {
        console.log(val, this.currentEndTimeModel );
    }

    private datePickerChange( ) {
        this.dateMenu = false;
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
        // this.formData.delete('files');
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
        // this.formData.delete('files');
    }
    //end : 파일 첨부 미리보기 및 파일 업로드 ================================================

    /**
     * 새일정> 등록 버튼 클릭시 팝업 닫기 및 데이터 전송 (
     * @private
     */
    private onAddCourseSubmit(idx: number): void{
        const startHour = (this.startTimeSelectModel.apm === '오후') ? Number(this.startTimeSelectModel.hour) + 12 : Number(this.startTimeSelectModel.hour);
        const startMinute= Number( this.startTimeSelectModel.minute );
        const endHour = (this.endTimeSelectModel.apm === '오후') ? Number(this.endTimeSelectModel.hour) + 12 : Number(this.endTimeSelectModel.hour);
        const endMinute= Number( this.endTimeSelectModel.minute );

        this.makeCurriculumData.course_list[idx].startTime = `${startHour}:${startMinute}`;
        this.makeCurriculumData.course_list[idx].endTime = `${endHour}:${endMinute}`;

        this.imgFileService.save( this.formData );
        this.attachFileService.save( this.formData );

        console.log(this.imgFileService);

        this.popupChange( false );
    }

    private popupChange( value: boolean ) {
        this.$emit('close', value);
    }

}


