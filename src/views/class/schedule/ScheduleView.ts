import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IClassInfo} from '@/views/model/my-class.model';
import {IScheduleTotal, ITimeModel } from '@/views/model/schedule.model';
import {ICommentModel, IReplyModel} from '@/views/model/comment.model';
import {CalendarEvent, CalendarEventParsed} from 'vuetify';
import {Utils} from '@/utils/utils';
import { RRule } from 'rrule';
import ImageSettingService from '@/views/service/profileImg/ImageSettingService';
import Modal from '@/components/modal/modal.vue';
import TxtField from '@/components/form/txtField.vue';
import Btn from '@/components/button/Btn.vue';
import ImagePreview from '@/components/preview/imagePreview.vue';
import FilePreview from '@/components/preview/filePreview.vue';
import AddSchedule from '@/views/class/schedule/AddSchedule';
import {ScheduleService} from '@/api/service/ScheduleService';
import WithRender from './ScheduleView.html';

const MyClass = namespace('MyClass');
const Post = namespace('Post');
const Schedule = namespace('Schedule');


@WithRender
@Component({
    components:{
        Modal,
        TxtField,
        Btn,
        ImagePreview,
        FilePreview,
        AddSchedule
    }
})
export default class ScheduleView extends Vue{

    @MyClass.Getter
    private classID!: string | number;

    @MyClass.Getter
    private myClassHomeModel!: IClassInfo;

    /* 댓글 관련 */
    @Schedule.Getter
    private scheduleListItems!: IScheduleTotal[];

    @Schedule.Getter
    private scheduleDetailItem!: IScheduleTotal;

    @Schedule.Getter
    private commentItems!: ICommentModel[];

    @Schedule.Getter
    private replyItems!: IReplyModel[];

    @Schedule.Action
    private GET_SCHEDULE_LIST_ACTION!: (payload: { classId: number,  paging: {page_no: number, count: number } }) => Promise<any>;

    @Schedule.Action
    private GET_SCHEDULE_DETAIL_ACTION!: (payload: { classId: number, scheduleId: number }) => Promise<any>;

    @Schedule.Action
    private GET_COMMENTS_ACTION!: (scheduleId: number) => Promise<any>;

    @Schedule.Action
    private ADD_COMMENT_ACTION!: (payload: {parent_id: number, parent_type: number, member_id: number, comment: string}) => Promise<any>;

    @Schedule.Action
    private ADD_REPLY_ACTION!: (payload: {comment_id: number, member_id: number, comment: string}) => Promise<any>;


    private imgFileURLItems: string[] = [];
    private imgFileDatas: any[] = [];

    private attachFileItems: any[] = [];
    private formData!: FormData;
    private imageLoadedCount: number=0;
    private isOpenAddSch: boolean=false;
    // private isTimeSelect: boolean=false;

    private type: string= 'month';
    private daysOfWeek: string[] = ['월', '화', '수', '목', '금', '토', '일'];
    private weekdays: number[] = [1, 2, 3, 4, 5, 6, 0];
/*    private weekdays: Array<{text: string, value: number[] }>=[
        { text: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
        { text: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
        { text: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
        { text: 'Mon, Wed, Fri', value: [1, 3, 5] },
    ];*/

    private selectedEvent ={};
    private selectedElement: HTMLElement | null=null;
    private selectedOpen: boolean= false;

    private typeToLabel = {
        'month': '월간',
        'week': '주간',
        'day': '일간',
        '4day': '4일',
        'custom-daily': '3일',
    };

    private scheduleLists: IScheduleTotal[]=[];
    private calendarModel: string= '2020-3-01';
    private events: any[] = [];
    private dragTime: number | null=null;
    private dragEvent: any | null= null;
    private dragStart: any | null= null;
    private extendOriginal: any | null= null;
    private createStart: number | null=0;
    private createEvent: {
        name: string,
        color: string,
        start: number,
        end: number,
        timed: boolean
    } | null | undefined;

    private startDate: string | number | Date = '';
    private endDate: string | number | Date = '';
    private isFocusContentsArea: boolean=true;


    private colors: string[] = [
        '#FF4D4D',
        '#191955',
        '#57576D',
        '#1CDBC9',
        '#2183DE',
        '#A062CB',
        '#FF90AA',
        '#FF972B',
        '#FFD100',
        '#ADC500',
        '#629F00'
    ];

    //datepicker
    private startDatePickerModel: string= new Date().toISOString().substr(0, 10);
    // private startTimeSelectModel: ITimeModel={ apm:'오전', hour:'12', minute: '30'};
    private startDateMenu: boolean= false; // 캘린 셀렉트 열고 닫게 하는 toggle 변수
    private startTimeMenu: boolean=false;  // 시간 셀렉트 열고 닫게 하는 toggle 변수

    // private endDatePickerModel: string= new Date().toISOString().substr(0, 10);
    // private endTimeSelectModel: ITimeModel={ apm:'오전', hour:'12', minute: '30'};

    // private endDateMenu: boolean=false;  // 캘린더 셀렉트 열고 닫게 하는 toggle 변수
    // private endTimeMenu: boolean=false;  // 시간 셀렉트 열고 닫게 하는 toggle 변수

    // private loopRangeModel: string = '반복없음';
    // private loopRangeItems: string[] = ['반복없음', '매일', '매주', '매월', '매년'];
    // private loopRangeCheck: boolean=false;
    private loopRangeCount: number | string=10;



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

    private comment: string = '';
    private reply: string = '';

    get scheduleDetailModel() {
        return this.scheduleDetailItem;
    }

    get commentItemsModel() {
        return this.commentItems;
    }

    get replyItemsModel() {
        return this.replyItems;
    }

/*    get imgFileURLItemsModel(): string[] {
        return this.imgFileURLItems;
    }*/

    get imgFileDatasModel(): any[] {
        return this.imgFileDatas;
    }

    get attachFileItemsModel(): any[] {
        return this.attachFileItems;
    }

/*    get currentLoopRangeItems(): string[]{
        return this.loopRangeItems;
    }*/
    /*get currentStartTimeModel(): string{
        return `${this.startTimeSelectModel.apm} ${this.startTimeSelectModel.hour}시 ${this.startTimeSelectModel.minute} 분`;
    }
    get currentEndTimeModel(): string{
        return `${this.endTimeSelectModel.apm} ${this.endTimeSelectModel.hour}시 ${this.endTimeSelectModel.minute} 분`;
    }*/

    get scheduleListsModel(): IScheduleTotal[]{
        return this.scheduleLists;
    }
    get startDateModel(): string | Date | number{
        return this.startDate;
    }
    get endDateModel(): string | Date | number{
        return this.endDate;
    }

    get scheduleEvents(): any[] {
        return this.events;
    }


    get calendarInstance(): Vue & {
        prev: () => void,
        next: () => void,
        checkChange: () => void,
        updateTimes: () => void,
        getVisibleEvents: () => CalendarEventParsed[],
        getFormatter: (format: any) => any } {
        return this.$refs.calendar as Vue & {
            prev: () => void,
            next: () => void,
            checkChange: () => void,
            updateTimes: () => void,
            getVisibleEvents: () => CalendarEventParsed[],
            getFormatter: (format: any) => any
        };
    }

    public async created(){
        // console.log(new Date().toISOString());
        await this.getScheduleList();
        await this.calendarInstance.prev();
        await this.calendarInstance.next();

        const rule = new RRule({
            freq: RRule.WEEKLY,  //매주 반복  //RRule.DAILY - 매일 반복  //RRule.MONTHLY - 매월 //RRule.YEARLY - 매년
            dtstart: new Date(Date.UTC(2021, 3, 30, 4, 28, 0)),
            count: 30,
            interval: 1
        });
        // console.log(rule.all());
    }

    public async mounted() {
        //시작일과 종료일이 변경되었는지 확인합니다. 변경된 경우 변경 이벤트를 업데이트하고 내 보냅니다.
        await this.calendarInstance.checkChange();
    }


    private onAddScheduleClose( val: boolean ) {
        this.isOpenAddSch=val;
    }

    /**
     * 일정 생성 데이터 초기화
     * @private
     */
    private resetToAddScheduleData() {
        this.scheduleData = {
            repeat_type: 0,
            repeat_count: 0,
            fullday: '',
            title: '',
            body: '',
            startAt:new Date(),  //2019-11-15 10:00:00
            endAt: new Date()
        };
    }

    private async getScheduleList(): Promise<void>{
        // console.log(this.classID === Number( this.$route.params.classId ) );
        await ScheduleService.getAllScheduleByClassId( this.classID )
          .then((data)=>{
              // console.log( 'getAllScheduleByClassId=', data.class_schedule_list );
              this.scheduleLists=data.class_schedule_list;
          });

    }


    private loopRangeCountClickHandler( value: string ){
        this.loopRangeCount=value;
        // console.log(this.loopRangeCount);
    }

    private setToday() {
        this.calendarModel = '';
    }
    private prev() {
        this.calendarInstance.prev();
    }
    private next() {
        this.calendarInstance.next();
    }
    private viewMoreDay( data: { date: any }) {
        this.calendarModel = data.date;

        // console.log(data);
        // this.type = 'day';
    }

    //상단 월 달력 header 에 custom 요일 표시
    private getDay( d: any ){
        const dayIdx=( d.weekday - 1<0)? this.daysOfWeek.length-1 : d.weekday - 1;
        return this.daysOfWeek[dayIdx];
    }


    private getEventColor(event: CalendarEvent) {
        return event.color;
    }

    private getFullDay(date: Date): string{
        return Utils.getFullDay( date );
    }


    //상세내역 팝업
    private showEvent( eventObj: { nativeEvent: MouseEvent, event: CalendarEvent} ) {
        // console.log( eventObj.event );
        const open = () => {
            this.selectedEvent = eventObj.event;
            this.selectedElement = eventObj.nativeEvent.target as HTMLElement;
            setTimeout(() => {
                this.selectedOpen = true;
                // @ts-ignore
                this.GET_COMMENTS_ACTION(this.selectedEvent.id)
                    .then(() => {
                        console.log(this.selectedEvent);
                    });
            }, 10);
        };

        if (this.selectedOpen) {
            this.selectedOpen = false;
            setTimeout( open, 10);
        } else {
            open();
        }
        eventObj.nativeEvent.stopPropagation();
    }

    private updateRange( time: { start: any, end: any } ) {

        this.$nextTick(() => {
            const eventItems = [];

            // const days = (max - min) / 86400000;
            const eventCount = this.scheduleListsModel.length;///this.rnd(days, days + 20);

            const startTimes = [];
            const endTimes = [];
            for (let i: number = 0; i < eventCount; i++) {

                startTimes.push(new Date(this.scheduleLists[i].startAt).getTime());
                endTimes.push(new Date(this.scheduleLists[i].endAt).getTime());

                eventItems.push({
                    name: this.scheduleLists[i].title,
                    details: this.scheduleLists[i].text,
                    color: this.colors[this.scheduleLists[i].owner.schedule_color],
                    start: new Date( this.scheduleLists[i].startAt),
                    end: new Date( this.scheduleLists[i].endAt ),
                    repeat: this.scheduleLists[i].count,
                    timed:true,
                    id: this.scheduleLists[i].id, // schedule_id (parent_id)
                });
            }

           /*
            const min = startTimes.reduce( (prv, cur) => {
                return (prv > cur) ? cur : prv;
            });
            const max = endTimes.reduce( (prv, cur) => {
                return (prv > cur) ? prv : cur;
            });

            const startDateItems = Utils.getTodayFullValue(new Date(min));
            const endDateItems = Utils.getTodayFullValue(new Date(max));

            this.startDate=Utils.getDateDashFormat( startDateItems[0], startDateItems[1], startDateItems[2] );
            this.endDate=Utils.getDateDashFormat( endDateItems[0], endDateItems[1], endDateItems[2] );*/

            this.events = eventItems;
        });


    }



    private updatePopup(isOpen: boolean) {
        this.isOpenAddSch=isOpen;
    }

    private addScheduleOpen(): void{
        this.updatePopup(true);
    }

    private getProfileImg(imgUrl: string | null | undefined ): string{
        return ImageSettingService.getProfileImg( imgUrl );
    }




 /*   private startTimeChange(){
        console.log(this.currentStartTimeModel);
    }*/

    /**
     * drag 시작
     * @param dragObj
     * @private
     */
    private startDrag( dragObj: { event: any, timed: any }) {
        // console.log(dragObj.event, dragObj.timed);

        /*
        dragObj.event=>
           this.createEvent: {
                name: string,
                color: string,
                start: number,
                end: number,
                timed: boolean
            }*/
        if (dragObj.event && dragObj.timed) {
            this.dragEvent = dragObj.event;
            this.dragTime = null;
            this.extendOriginal = null;
        }
    }

    private startTime(tms: any ) {
        const mouse = this.toTime(tms);

        if (this.dragEvent && this.dragTime === null) {
            const start = this.dragEvent.start;

            this.dragTime = mouse - start;
        } else {
            this.createStart = this.getTimeStamp(mouse);
            this.createEvent = {
                name: `Event #${this.events.length}`,
                color: this.rndElement(this.colors),
                start: this.createStart,
                end: this.createStart,
                timed: true
            };

            this.events.push(this.createEvent);
        }
    }

    private extendBottom(event: any ) {
        // console.log('extendBottom=', event );
        this.createEvent = event;
        this.createStart = event.start;
        this.extendOriginal = event.end;
    }

    private mouseMove( tms: {
        date: Date,
        day: number,
        future: boolean,
        hasDay: boolean,
        hasTime: boolean,
        hour: number,
        minute: number,
        minutesToPixels: ()=>void,
        month: number,
        past: boolean
        present: boolean
        time: string,
        timeDelta: ()=>void,
        timeToY: ()=>void,
        week: [],
        weekday: number,
        year: number } ) {

        const mouse = this.toTime(tms);

        if (this.dragEvent && this.dragTime !== null ) {
            const start = this.dragEvent.start;
            const end = this.dragEvent.end;
            const duration = end - start;
            const newStartTime = mouse - this.dragTime;
            const newStart = this.getTimeStamp(newStartTime);
            const newEnd = newStart + duration;

            this.dragEvent.start = newStart;
            this.dragEvent.end = newEnd;
        } else if (this.createEvent && this.createStart !== null) {
            const mouseRounded = this.getTimeStamp(mouse, false);
            const min = Math.min(mouseRounded, this.createStart);
            const max = Math.max(mouseRounded, this.createStart);

            this.createEvent.start = min;
            this.createEvent.end = max;
        }

        // console.log(mouse);
    }

    private endDrag() {
        this.dragTime = null;
        this.dragEvent = null;
        this.createEvent = null;
        this.createStart = null;
        this.extendOriginal = null;
    }
    //캘린더 영역에서 완전히 벗어날 때
    private cancelDrag() {
        if (this.createEvent) {
            if (this.extendOriginal) {
                this.createEvent.end = this.extendOriginal;
            } else {
                const i = this.events.indexOf(this.createEvent);
                if (i !== -1) {
                    this.events.splice(i, 1);
                }
            }
        }

        this.createEvent = null;
        this.createStart = null;
        this.dragTime = null;
        this.dragEvent = null;

    }
    //time 은 timestamp 수치
    private getTimeStamp( time: number, down: boolean = true): number{
        // console.log( 'time=',typeof time )
        const roundTo = 15; // minutes
        const roundDownTime = roundTo * 60 * 1000;
        return down ? time - time%roundDownTime : time + (roundDownTime - (time % roundDownTime));
    }
    // timestamp 를 반환
    private toTime( tms: {
        date: Date,
        day: number,
        future: boolean,
        hasDay: boolean,
        hasTime: boolean,
        hour: number,
        minute: number,
        minutesToPixels: ()=>void,
        month: number,
        past: boolean
        present: boolean
        time: string,
        timeDelta: ()=>void,
        timeToY: ()=>void,
        week: [],
        weekday: number,
        year: number } ): number{
        // console.log('tms=', typeof tms);
        return new Date(tms.year, tms.month - 1, tms.day, tms.hour, tms.minute).getTime();
    }
    private rndElement(arr: string[]){
        return arr[this.rnd(0, arr.length - 1)];
    }
    private rnd(a: any, b: any): number {
        return Math.floor((b - a + 1) * Math.random()) + a;
    }

    /*private onAddSchedulePopupCloseHandler(): void{
        this.isPopup=false;
        this.loopRangeCheck = false;

        //첨부 파일들 초기화
        this.removeAllPreview();
        this.removeAllAttachFile();
    }*/



    /**
     * 이미지등록 아이콘 클릭시 > input type=file 에 클릭 이벤트 발생시킴.
     * @private
     */
   /* private addImgFileInputFocus() {
        this.inputEventBind('#imgFileInput');
        console.log(this.imgFileURLItemsModel);
    }*/

 /*   private addFilesInputFocus(){
        this.inputEventBind('#attachFileInput');
    }*/

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
     * 이미지 파일이 저장된 배열을 전송할 formdata 에 값 대입.
     * @private
     */
    private setImageFormData() {

        if( !this.imgFileDatas.length ){ return; }

        if (this.formData === undefined) {
            this.formData= new FormData();
        }
        // 아래  'files'  는  전송할 api 에 지정한 이름이기에 맞추어야 한다. 다른 이름으로 되어 있다면 변경해야 함.
        this.appendFormData(this.imgFileDatas, 'files');
        console.log(this.imgFileDatas);
    }

    private setAttachFileFormData() {
        if( !this.attachFileItems.length ){ return; }

        if (this.formData === undefined) {
            this.formData= new FormData();
        }
        // 아래  'files'  는  전송할 api 에 지정한 이름이기에 맞추어야 한다. 다른 이름으로 되어 있다면 변경해야 함.
        this.appendFormData(this.attachFileItems, 'files'  );
    }

    private appendFormData( targetLists: File[], appendName: string | string[] ) {
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
    /*private addFileToImage( files: FileList ){


        //전달되는 파일없을시 여기서 종료.
        if( !files.length ){ return; }

        /!*this.setRevokeObjectURL().then( ()=>{

          });*!/

        this.setImgFilePreviewSave(files);
        //file type input
        const imgFileInput =document.querySelector('#imgFileInput') as HTMLInputElement;
        imgFileInput.value = '';
    }*/

    //모델에 이미지 파일 추가
   /* private async addAttachFileTo( files: FileList ){
        //전달되는 파일없을시 여기서 종료.
        if( !files.length ){ return; }

        this.setAttachFileSave(files);
        //file type input
        const attachFileInput =document.querySelector('#attachFileInput') as HTMLInputElement;
        attachFileInput.value = '';
    }*/

    /**
     * // blob url 폐기시키고 가비지 컬렉터 대상화시킴
     * - 확인하는 방법은 현재 이미지에 적용된 src 주소값을 복사해서 현재 브라우저에 주소를 붙여 실행해 보면 된다. 이미지가 보이면 url 이 폐기되지 않은 것이다.
     * @private
     */
    private removeBlobURL( items: string[] ) {
        items.forEach((item) => URL.revokeObjectURL(item));
    }

    /**
     * 이미지가 로드 되었는지 체크
     * @private
     */
    private setRevokeObjectURL(): Promise<string>{
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this.imageLoadedCount === this.imgFileURLItems.length) {
                    return resolve('loaded');
                } else {
                    return reject('wait');
                }
            }, 500);
        });
    }
    //이미지 로드 완료 카운트
/*    private imageLoadedCheck(): void{
        this.imageLoadedCount++;
        console.log(this.imageLoadedCount);
    }*/





    /**
     * 새일정> 등록 버튼 클릭시 팝업 닫기 및 데이터 전송 (
     * @private
     */
    /*private submitAddSchedule(): void{
        //시나리오 --> 등록 버튼 클릭 > 이미지 추가한 배열값 formdata에 입력 > 전송 >전송 성공후> filesAllClear 호출 > 팝업 닫기
        this.setImageFormData();
        this.setAttachFileFormData();

        //전송이 완료 되었다는 전제하에 아래 구문 수행
        setTimeout(() => {
            this.isPopup=false;
            this.imgFilesAllClear();
        }, 500);

    }*/

    /**
     * 추가된 이미지 파일 제거하기
     * @param idx
     * @private
     */
/*    private removeImgPreviewItems(idx: number): void{
        const blobURLs=this.imgFileURLItems.splice(idx, 1);
        this.removeBlobURL( blobURLs ); // blob url 제거
        this.imgFileDatas.splice(idx, 1);
        //console.log( this.formData.getAll('files')  );
    }*/

    /*private removeAttachFileItem(idx: number): void{
        this.attachFileItems.splice(idx, 1);
        //console.log( this.formData.getAll('files')  );
    }*/


    /**
     * 추가된 이미지 파일 모두 지우기
     * @private
     */
    /*private removeAllPreview(): void {
        this.imgFileURLItems = [];
        this.imgFileDatas=[];
        this.imageLoadedCount=0;
    }*/
  /*  private removeAllAttachFile(): void {
        this.attachFileItems = [];
    }*/

    private imgFilesAllClear() {
        this.imgFileURLItems = [];
        this.imgFileDatas=[];
        this.formData.delete('files');
        this.imageLoadedCount=0;
    }

    private attachFilesAllClear() {
        this.attachFileItems = [];
        this.formData.delete('files');
        // this.imageLoadedCount=0;
    }




    //파일 다운로드 설정.
    //var filenamesHeader= res.headers['content-disposition'];
    //var filename=filenamesHeader.substr( filenamesHeader.indexOf('="')+1 );
    //res.data, 'application/zip', `${filename.replace(/[\"]/g, '' ) }`
    //res.data, res.headers['content-type'], selectedFile.originalname
    private fileDown( data: any, downType: string, fileName: string ): void{
        const blob = new Blob([data], {type: downType});
        const blobURL = window.URL.createObjectURL(blob);

        const dummyLink = document.createElement('a');
        dummyLink.style.display = 'none';
        dummyLink.href = blobURL;
        dummyLink.setAttribute('download', fileName );

        if (typeof dummyLink.download === 'undefined') {
            dummyLink.setAttribute('target', '_blank');
        }

        document.body.appendChild(dummyLink);
        dummyLink.click();
        document.body.removeChild(dummyLink);
        window.URL.revokeObjectURL(blobURL);
    }

    private updatedDiffDate( dateValue: Date ): string{
        return Utils.updatedDiffDate(dateValue);
    }

    /**
     * 댓글 등록
     * @private
     */
    private async addComment() {
        if (this.comment !== '') {
            await this.ADD_COMMENT_ACTION({
                // @ts-ignore
                parent_id: this.selectedEvent.id,
                parent_type: 1,
                member_id: (this.myClassHomeModel.me?.id) ? (this.myClassHomeModel.me?.id) : 0,
                comment: this.comment
            }).then(() => {
                console.log(`member_id: ${this.myClassHomeModel.me?.id} 댓글 추가 완료`);
            });
            // @ts-ignore
            await this.GET_COMMENTS_ACTION(this.selectedEvent.id)
                .then(() => {
                    console.log('댓글 갱신');
                });
            this.comment = '';
        }
    }

    private replyInputToggle(idx: number) {
        this.reply = '';
        const replyInput = document.querySelectorAll('.comment-btm.reply');
        replyInput.forEach((item, index) =>
            (idx!==index) ? item.classList.add('hide') : item.classList.toggle('hide'));
    }

    /**
     * 대댓글 등록
     * @param id
     * @private
     */
    private async addReply(id: number) {
        if (this.reply !== '') {
            await this.ADD_REPLY_ACTION({
                comment_id: id,
                member_id: (this.myClassHomeModel.me?.id) ? (this.myClassHomeModel.me?.id) : 0,
                comment: this.reply
            }).then(() => {
                console.log(`member_id: ${this.myClassHomeModel.me?.id} 대댓글 ${id} 추가 완료`);
            });
            // @ts-ignore
            await this.GET_COMMENTS_ACTION(this.selectedEvent.id)
                .then(() => {
                    console.log('댓글 갱신');
                });
        }
        this.reply = '';
    }

}

