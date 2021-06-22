import {Vue, Component, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import TxtField from '@/components/form/txtField.vue';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import {
    IClassInfo,
    IMakeEducation,
    ICurriculumList,
    ICurriculumDetailList,
    IModifyCurriculum,
} from '@/views/model/my-class.model';
import {IAttachFileModel} from '@/views/model/post.model';
import {Utils} from '@/utils/utils';
import MyClassService from '@/api/service/MyClassService';
import ListInImgPreview from '@/components/preview/ListInImgPreview.vue';
import ListInFilePreview from '@/components/preview/ListInFilePreview.vue';
import ImagePreview from '@/components/preview/imagePreview.vue';
import FilePreview from '@/components/preview/filePreview.vue';
import ModifyCoursePopup from '@/views/class/curriculum/ModifyCoursePopup';
import ImageSettingService from '@/views/service/profileImg/ImageSettingService';
import WithRender from './ModifyCurriculumPopup.html';

const MyClass = namespace('MyClass');

/*start: 추가 테스트*/
interface ITimeModel{
    apm: string;
    hour: string;
    minute: string;
}
/*end: 추가 테스트*/

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
        ModifyCoursePopup,
    }
})
export default class ModifyCurriculumPopup extends Vue {
    @Prop(Boolean)
    private isOpen!: boolean;

    @Prop(Number)
    private cardId!: number;

    @MyClass.Getter
    private classID!: number;

    @MyClass.Getter
    private myClassHomeModel!: IClassInfo;

    @MyClass.Action
    private GET_CURRICULUM_DETAIL_ACTION!: (payload: { classId: number, curriculumId: number}) => Promise<any>;

    @MyClass.Action
    private GET_COURSE_DETAIL_ACTION!: (payload: { classId: number, curriculumId: number, courseId: number }) => Promise<any>;

    /* Modal 오픈 상태값 */
    private isModifyClassCourse: boolean = false;

    private countCourseNumber: number = 0;
    private courseId: number = 0;

    private EduSettingsItems: string[] = ['교육과정 수정', '교육과정 삭제'];

    private CourseSettingsItems: string[] = ['수업 내용 수정', '수업 삭제'];

    /* 수정할 값 */
    private courseTitle: string = '';
    private courseGoal: string = '';

    private imageLoadedCount: number=0;
    private imgFileURLItems: string[] = [];
    private imgFileDatas: any[] = [];
    private attachFileItems: any[] = [];
    private formData!: FormData;
    private modifyCourseDataItems: any = {};

    get imgFileURLItemsModel(): string[] {
        return this.imgFileURLItems;
    }

    get attachFileItemsModel(): any[] {
        return this.attachFileItems;
    }

    get modifyDataItemsModel(): any {
        return this.modifyClassItems;
    }

    get currentSettingItems(): string[]{
        return this.EduSettingsItems;
    }

    get currentCourseSettingItems(): string[]{
        return this.CourseSettingsItems;
    }


    private curriculumDetailDataNum: number = 10;
    private eduItems: Array< {title: string }>=[];

    private modifyClassItems!: any;

    public updated() {
        console.log('cardId=',this.cardId);
        this.getModifyEduCurList(this.cardId);
    }

    private getProfileImg(imgUrl: string | null | undefined ): string{
        return ImageSettingService.getProfileImg( imgUrl );
    }

    /**
     * 교육과정 리스트
     */

    private isOwner( ownerId: number, userId: number): boolean {
        return (ownerId === userId);
    }

    private getImgFileLen( items: IAttachFileModel[] ): number{
        return (items) ? this.getImgFileDataSort( items ).length : 0;
    }

    private getImgTotalNum(  items: IAttachFileModel[]  ) {
        return (items && this.getImgFileDataSort(items).length <= 3);
    }

    private getImgFileMoreCheck(  items: IAttachFileModel[] ) {
        return (items)? ( this.getImgFileDataSort( items ).length>3 )? `+${this.getImgFileDataSort( items ).length - 3}` : '' : 0;
    }

    private getImgFileDataSort(fileData: IAttachFileModel[] ) {
        return fileData.filter((item: IAttachFileModel) => item.contentType === 'image/png' || item.contentType === 'image/jpg' || item.contentType === 'image/jpeg' || item.contentType === 'image/gif');
    }

    private getFileDataSort(fileData: IAttachFileModel[] ) {
        return fileData.filter( (item: IAttachFileModel) => item.contentType !== 'image/png' && item.contentType !== 'image/jpg' && item.contentType !== 'image/jpeg' && item.contentType !== 'image/gif');
    }


    /**
     * 교육과정 수업 회차 설정
     */
    get courseListNumModel(): Array< {title: string }>{
        this.eduItems.length = 10;
        return this.eduItems;
    }


    private countCourseNum(num: number): void{
        this.countCourseNumber = num;
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

    private modifyImgFileInputFocus() {
        this.inputEventBind('#imgFileInputModify');
    }

    private modifyFilesInputFocus(){
        this.inputEventBind('#attachFileInputModify');
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
     * 교육과정 > 등록 버튼 클릭시 팝업 닫기 및 데이터 전송 (
     * @private
     */
    private submitAddPost(): void{
        //시나리오 --> 등록 버튼 클릭 > 이미지 추가한 배열값 formdata에 입력 > 전송 >전송 성공후> filesAllClear 호출 > 팝업 닫기

        // this.setImageFormData();
        // this.setAttachFileFormData();
    }

    private onAddPostSubmit() {
        this.submitAddPost();
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
        this.formDataAppendToFile(this.imgFileDatas, 'files' );
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
        this.formDataAppendToFile(this.attachFileItems, 'files' );
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
                this.formData.append( appendName[index], item, `${this.countCourseNumber+1}_${index}_${item.name}` );
            }else{
                this.formData.append(appendName, item, `${this.countCourseNumber+1}_${index}_${item.name}` );
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

    //모델에 이미지 파일 추가
    private modifyFileToImage( files: FileList ){

        //전달되는 파일없을시 여기서 종료.
        if( !files.length ){ return; }

        this.setImgFilePreviewSave(files);
        //file type input
        const modifyImgFileInput =document.querySelector('#imgFileInputModify') as HTMLInputElement;
        modifyImgFileInput.value = '';
    }

    //모델에 이미지 파일 추가
    private async modifyAttachFileTo( files: FileList ){
        //전달되는 파일없을시 여기서 종료.
        if( !files.length ){ return; }

        this.setAttachFileSave(files);
        //file type input
        const modifyAttachFileInput =document.querySelector('#attachFileInputModify') as HTMLInputElement;
        modifyAttachFileInput.value = '';
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


    private getModifyEduCurList(cardId: number): void {
        MyClassService.getEduCurList(this.classID, cardId)
            .then((data) => {
                this.modifyClassItems = data.curriculum;
                console.log('selected curriculum data = ', this.modifyClassItems);
            });
    }

    private modifyConfirm(cardId: number){
        this.formData = new FormData();

        const temp = JSON.stringify( {...this.modifyClassItems} );
        this.formData.append('data', temp );

        MyClassService.setCurriculumModify(this.classID, cardId, this.formData)
            .then((data)=>{
                console.log(cardId);
                console.log('교육과정 수정 성공', data);
                this.attachFilesAllClear();
            });
    }

    private modifyCourseHandler(courseIdx: number, idx: number) {
        this.isModifyClassCourse = true;
        this.courseId = courseIdx;
        this.countCourseNumber = idx;

        this.modifyCourseDataItems = this.modifyDataItemsModel.course_list[idx];
        console.log(this.modifyCourseDataItems.attachment);
    }


    /**
     * 코스 수정 팝업 오픈
     * @param id
     * @private
     */
    private async onModifyCurriculumPopupOpen(id: number) {
        this.courseId = id;
        await this.GET_COURSE_DETAIL_ACTION({classId: Number(this.classID), curriculumId: this.cardId, courseId: this.courseId})
            .then((data)=>{
                console.log(data);
                this.isModifyClassCourse=true;
            });
    }

    private onModifyCoursePopupStatus(value: boolean) {
        this.isModifyClassCourse=value;
    }

    private onModifyCourse(value: boolean) {
        this.isModifyClassCourse=value;
    }

    private popupChange( value: boolean ) {
        this.$emit('change', value);
    }

}






