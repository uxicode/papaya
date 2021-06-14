import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import TxtField from '@/components/form/txtField.vue';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import {
    IClassInfo,
    IMakeEducation,
    IEducationList,
    ICurriculumList,
    IModifyCurriculum,
} from '@/views/model/my-class.model';
import {IAttachFileModel} from '@/views/model/post.model';
import {Utils} from '@/utils/utils';
import MyClassService from '@/api/service/MyClassService';
import ListInImgPreview from '@/components/preview/ListInImgPreview.vue';
import ListInFilePreview from '@/components/preview/ListInFilePreview.vue';
import ImagePreview from '@/components/preview/imagePreview.vue';
import FilePreview from '@/components/preview/filePreview.vue';
import ImageSettingService from '@/views/service/profileImg/ImageSettingService';
import WithRender from './ModifyCoursePopup.html';

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
    }
})
export default class ModifyCoursePopup extends Vue {

    @MyClass.Getter
    private classID!: number;

    @MyClass.Getter
    private myClassHomeModel!: IClassInfo;

    /* Modal 오픈 상태값 */
    private isAddCurriculum: boolean = false;
    private isClassCurr: boolean = false;
    private isDetailCurriculum: boolean = false;
    private isClassCurrDetail: boolean = false;
    private isCreateError: boolean = false;
    private isModifyClass: boolean = false;
    private isModifyClassCourse: boolean = false;

    private detailCurriculumId: number=-1; // 동적으로 변경 안되는 상태

    private countCourseNumber: number = 0;

    private cardId: number = 0;
    private courseId: number = 0;


    private EduSettingsItems: string[] = ['교육과정 수정', '교육과정 삭제'];
    private EduSettingsModel: string = '교육과정 수정';

    private CourseSettingsItems: string[] = ['수업 내용 수정', '수업 삭제'];
    private CourseSettingsModel: string = '수업 내용 수정';

    private startDateItem: string = '';
    private startTimeItem: string = '';
    private endTimeItem: string = '';

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

    /**
     * 클래스 교육과정 메인리스트
     */

        //datepicker
    private startDatePickerModel: string= new Date().toISOString().substr(0, 10);
    private startTimeSelectModel: ITimeModel={ apm:'오전', hour:'12', minute: '30'};
    private startDateMenu: boolean= false; // 캘린 셀렉트 열고 닫게 하는 toggle 변수
    private startTimeMenu: boolean=false;  // 시간 셀렉트 열고 닫게 하는 toggle 변수

    private endTimeSelectModel: ITimeModel={ apm:'오전', hour:'12', minute: '30'};
    private endTimeMenu: boolean=false;  // 시간 셀렉트 열고 닫게 하는 toggle 변수


    private makeCurriculumItems: IMakeEducation={
        title: '',
        goal: '',
        course_list: [
            {
                index: 0,
                id: 0,
                startDay: '',
                startTime: '',
                endTime: '',
                title: '',
                contents: ''
            }
        ]
    };


    // private testCourse: Array<Pick<IMakeEducation, 'course_list'>> = [];

    private allEduList: IEducationList[]= [];

    private curriculumDetailData: ICurriculumList={
        curriculum: {
            startAt: '2019-11-17 10:00:00',
            endAt: '2019-11-17 10:00:00',
            expiredAt: '2019-11-17 10:00:00',
            createdAt: '2019-11-17 10:00:00',
            updatedAt: '2019-11-17 10:00:00',
            id: 0,
            class_id: 0,
            board_id: 0,
            post_type: 0,
            type: 0,
            user_id: 0,
            user_member_id: 0,
            title: '',
            text: '',
            count: 0,
            param1: 0,
            deletedYN: false,
            owner: {
                nickname: '',
                level: 0,
            },
            course_list: [
                {
                    startDay: '2019-11-17',
                    createdAt: '2019-11-17',
                    updatedAt: '2019-11-17',
                    id: 0,
                    curriculum_id: 0,
                    class_id: 0,
                    index: 0,
                    title: '',
                    contents: '',
                    startTime: '2019-11-17',
                    endTime: '2019-11-17',
                    deletedYN: false,
                    attachment: [],
                },
            ],
        }
    };

    private curriculumDetailDataNum: number = 10;
    private eduItems: Array< {title: string }>=[];
    // private settingItems: Array<{ vo: string[], sItem: string }> = [];

    private modifyClassItems: IModifyCurriculum={
        title: '',
        goal: '',
        course_list: [
            {
                id: 0,
                index: 0,
                title: '',
                startDay: '',
                startTime: '',
                endTime: '',
                contents: '',
            }
        ]
    };

    public created(){
        // this.settingItems=this.mItemByMakeEduList();
        this.getEduList();
    }

    get isSubmitValidate(): boolean{
        return (this.makeCurriculumItems.title !== '' && this.makeCurriculumItems.goal !== '');
    }

    private getProfileImg(imgUrl: string | null | undefined ): string{
        return ImageSettingService.getProfileImg( imgUrl );
    }

    get currentSettingItems(): string[]{
        return this.EduSettingsItems;
    }

    get currentCourseSettingItems(): string[]{
        return this.CourseSettingsItems;
    }


    get currentStartTimeModel(): string{
        return `${this.startTimeSelectModel.apm} ${this.startTimeSelectModel.hour}시 ${this.startTimeSelectModel.minute}분`;
    }

    get selectStartTimeModel(): string{
        const time = Number(this.startTimeSelectModel.hour)+12;
        if( this.startTimeSelectModel.apm === '오후' ){
            return `${time}:${this.startTimeSelectModel.minute}:00`;
        }else {
            return `${this.startTimeSelectModel.hour}:${this.startTimeSelectModel.minute}:00`;
        }
    }

    get currentEndTimeModel(): string{
        return `${this.endTimeSelectModel.apm} ${this.endTimeSelectModel.hour}시 ${this.endTimeSelectModel.minute}분`;
    }

    get selectEndTimeModel(): string{
        const time = Number(this.endTimeSelectModel.hour)+12;
        if( this.endTimeSelectModel.apm === '오후' ){
            return `${time}:${this.endTimeSelectModel.minute}:00`;
        }else {
            return `${this.endTimeSelectModel.hour}:${this.endTimeSelectModel.minute}:00`;
        }
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

    private setCourseList( num: number ): void{
        if( this.curriculumDetailDataNum >= 0 ){
            this.curriculumDetailDataNum=num;
            this.eduItems.length=num;

            if( this.curriculumDetailDataNum > 50){
                this.isCreateError = true;

                num = 50;
                this.curriculumDetailDataNum=50;
                this.eduItems.length=50;
            }
        }

        this.makeCurriculumItems.course_list = [];

        for (let i = 0; i < num; i++) {
            this.makeCurriculumItems.course_list.push({
                index: i,
                id: i,
                title: '',
                startDay: '',
                startTime: '',
                endTime: '',
                contents: ''
            });
        }
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

        const temp = JSON.stringify( {...this.makeCurriculumItems} );
        this.formData.append('data', temp );

        MyClassService.setEducationList( this.classID, this.formData )
            .then((data)=>{
                console.log( '교육과정 생성 성공', data );
                this.$emit('submit', false);
                this.imgFilesAllClear();
                this.attachFilesAllClear();
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

    private imgFilesAllClear() {
        this.imgFileURLItems = [];
        this.imgFileDatas=[];
        this.makeCurriculumItems={
            title: '',
            goal: '',
            course_list: [
                {
                    index: 0,
                    id: 0,
                    startDay: '',
                    startTime: '',
                    endTime: '',
                    title: '',
                    contents: ''
                }
            ]
        };
        this.formData.delete('files');
        this.imageLoadedCount=0;
    }

    /**
     * 시작일시 - datepicker 일자 선택시
     * @private
     */
    private startDatePickerChange() {
        this.startDateMenu = false;
        this.startDateItem = this.startDatePickerModel;
        // this.makeCourseItems.startDay = this.startDateItem;
    }

    private startTimeChange() {
        this.startTimeItem = this.selectStartTimeModel;
        // this.makeCourseItems.startTime = this.startTimeItem;

    }

    private endTimeChange() {
        this.endTimeItem = this.selectEndTimeModel;
        // this.makeCourseItems.endTime = this.endTimeItem;
    }

    private makeCourseSubmit(courseIdx: number): void{
        this.isClassCurr = false;

        this.getCourseItemStartTime(courseIdx);
        this.getCourseItemEndTime(courseIdx);

        this.setImageFormData();
        this.setAttachFileFormData();
        this.removeAllPreview();
        this.removeAllAttachFile();
    }

    /**
     * 클래스 교육과정 삭제
     */
    private deleteCurriculum( curriculumID: number ): void{
        MyClassService.deleteEducationList ( this.classID, curriculumID )
            .then(() => {
                console.log('교육과정 삭제 성공');
                alert('선택하신 교육과정이 삭제 되었습니다.');
            });
    }


    /**
     * 클래스 교육과정 전체 조회
     */
    get allEducationList(): IEducationList[] {
        return this.allEduList;
    }

    private getEduList(): void {
        MyClassService.getEducationList(this.classID)
            .then((data) => {
                this.allEduList = data;
                // console.log(this.allEduList);
            });
    }

    /**
     * 클래스 교육과정 정보 조회
     */
    get curriculumList(): ICurriculumList{
        return this.curriculumDetailData;
    }

    private getEducurriculumDetailData(cardId: number): void {
        MyClassService.getEduCurList(this.classID, cardId)
            .then((data) => {
                console.log(cardId);
                console.log('getEducurriculumDetailData 함수 데이터', data);
                this.curriculumDetailData = data;
            });
    }

    /**
     * 클래스 교육과정 수정
     */

    private getModifyEduCurList(cardId: number): void {
        MyClassService.getEduCurList(this.classID, cardId)
            .then((data) => {
                this.curriculumDetailData = data;
                this.modifyClassItems.course_list = this.curriculumList.curriculum.course_list;
                this.modifyClassItems.title = this.curriculumList.curriculum.title;
                this.modifyClassItems.goal = this.curriculumList.curriculum.text;
            });
    }

    private modifyCurriculumChangeTitle(value: string){
        this.$emit('input', value );
        this.modifyClassItems.title = value;
    }

    private modifyChangeText(value: string){
        this.$emit('textarea', value);
        this.modifyClassItems.goal = value;
    }

    private modifyCourseChangeTitle(value: string, num: number){
        this.$emit('input', value );
    }

    private modifyCourseChangeText(value: string, num: number){
        this.$emit('textarea', value );
    }

    private modifyCourseChangeStartTime(courseIdx: number) {
        this.getModifyCourseStartTime(courseIdx);
        console.log(this.modifyClassItems);
    }

    private modifyCourseConfirm(courseIdx: number): void{
        this.isModifyClassCourse = false;

        this.setImageFormData();
        this.setAttachFileFormData();
        this.removeAllPreview();
        this.removeAllAttachFile();
    }

    private modifyConfirm(cardId: number){
        this.formData = new FormData();

        const temp = JSON.stringify( {...this.modifyClassItems} );
        this.formData.append('data', temp );

        MyClassService.setClassModify(this.classID, cardId, this.formData)
            .then((data)=>{
                console.log(cardId);
                console.log('교육과정 수정 성공', data);
                this.imgFilesAllClear();
                this.attachFilesAllClear();
            });
    }


    private cardClickHandler( idx: number ) {
        this.isDetailCurriculum = true;
        this.cardId=idx;

        this.$nextTick(()=>{
            this.getEducurriculumDetailData(this.cardId);
        });
    }

    private curriculumClickHandler( idx: number ) {
        this.isClassCurr = true;
        this.countCourseNumber = idx;
    }

    private curriculumDetailClickHandler( idx: number ) {
        this.isClassCurrDetail = true;
        this.countCourseNum(idx);
    }

    private addCurriculumHandler(idx: number) {
        this.isAddCurriculum= true;
        this.setCourseList(10);
    }

    private modifyCurriculumHandler(curriculumIdx: number) {
        this.isModifyClass = true;
        this.cardId = curriculumIdx;

        this.$nextTick(()=>{
            this.getModifyEduCurList(this.cardId);
        });
    }

    private modifyCourseHandler(courseIdx: number, idx: number) {
        this.isModifyClassCourse = true;
        this.courseId = courseIdx;
        this.countCourseNumber = idx;

        this.modifyCourseDataItems = this.modifyDataItemsModel.course_list[idx];
        console.log(this.modifyCourseDataItems.attachment);
    }



    private getCurrItemTitleById( title: string): string {
        return (title)? title : '';
    }

    private getCurrCourseItemTitleById( title: string ): string {
        return (title)? title: '';
    }

    private getCourseItemStartTime(idx: number): string{
        return (this.makeCurriculumItems.course_list)? this.makeCurriculumItems.course_list[idx].startTime=this.selectStartTimeModel : '' ;
    }

    private getCourseItemEndTime(idx: number): string{
        return (this.makeCurriculumItems.course_list)? this.makeCurriculumItems.course_list[idx].endTime=this.selectEndTimeModel : '' ;
    }

    private getModifyCourseStartTime(idx: number): any{
        return (this.modifyClassItems.course_list)? this.modifyClassItems.course_list[idx].startTime = this.selectStartTimeModel : '';
    }

    private getModifyCourseEndTime(idx: number): any{
        return (this.modifyClassItems.course_list)? this.modifyClassItems.course_list[idx].endTime = this.selectEndTimeModel : '';
    }

}






