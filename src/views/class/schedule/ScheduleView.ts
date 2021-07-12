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
import ScheduleDetailPopup from '@/views/class/schedule/ScheduleDetailPopup';
import WithRender from './ScheduleView.html';
import {SET_SCHEDULE_DETAIL} from '@/store/mutation-class-types';

const MyClass = namespace('MyClass');
const Schedule = namespace('Schedule');


@WithRender
@Component({
    components:{
        Modal,
        TxtField,
        Btn,
        ImagePreview,
        FilePreview,
        AddSchedule,
        ScheduleDetailPopup
    }
})
export default class ScheduleView extends Vue{



    @Schedule.Mutation
    private SET_SCHEDULE_DETAIL!: ( data: IScheduleTotal )=> void;

    @Schedule.Action
    private GET_SCHEDULE_ACTION!: (payload: { classId: number,  paging: {page_no: number, count: number } }) => Promise<any>;

    @Schedule.Action
    private GET_COMMENTS_ACTION!: (scheduleId: number) => Promise<any>;

    @MyClass.Getter
    private classID!: string | number;

    @MyClass.Getter
    private myClassHomeModel!: IClassInfo;

    /* 댓글 관련 */
    @Schedule.Getter
    private scheduleListItems!: IScheduleTotal[];



    private imgFileURLItems: string[] = [];
    private imgFileDatas: any[] = [];

    private attachFileItems: any[] = [];
    private formData!: FormData;
    private imageLoadedCount: number=0;
    private isOpenAddSch: boolean=false;
    private isOpenDetailSch: boolean= false;
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

    private calendarModel: string=new Date().toISOString().substr(0, 10); ///// '2020-3-01';
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
        return this.scheduleListItems;
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
        if (this.$route.query.sideNum && this.$route.query.sideNum !== '') {
            this.$emit('sideNum', Number(this.$route.query.sideNum));
        }
        // console.log(new Date().toISOString());
        await this.getScheduleList()
          .then(()=>{
              console.log('캘린더 로드 완료.');
          });
        // await this.calendarInstance.prev();
        // await this.calendarInstance.next();

        const rule = new RRule({
            freq: RRule.WEEKLY,  //매주 반복  //RRule.DAILY - 매일 반복  //RRule.MONTHLY - 매월 //RRule.YEARLY - 매년
            dtstart: new Date(Date.UTC(2021, 3, 30, 4, 28, 0)),
            count: 30,
            interval: 1
        });
        // console.log(rule.all());
    }

    public mounted() {
        //시작일과 종료일이 변경되었는지 확인합니다. 변경된 경우 변경 이벤트를 업데이트하고 내 보냅니다.
        setTimeout(() => {
            this.scheduleListsModel.forEach((item, idx )=>{
                console.log(idx);
                this.addScheduleEvent(idx);
            });

            this.calendarInstance.checkChange();
        }, 1000);

    }

    private async getScheduleList(){
        // console.log(this.classID === Number( this.$route.params.classId ) );
        await this.GET_SCHEDULE_ACTION( { classId: Number(this.classID), paging:{page_no:1, count: 100} })
          .then((data)=>{
              console.log( 'getAllScheduleByClassId=', data );
          });

    }


    //상세내역 팝업
    private scheduleDetailViewEvent(eventObj: { nativeEvent: MouseEvent, event: CalendarEvent} ) {
        // console.log( eventObj.event );
        const open = () => {
            // this.selectedEvent = eventObj.event;
            // this.selectedElement = eventObj.nativeEvent.target as HTMLElement;

            const {id}=eventObj.event;
            const findIdx = this.scheduleListsModel.findIndex((item) => item.id === id);
            setTimeout(() => {
                this.selectedOpen = true;

                this.isOpenDetailSch=true;

                const header=document.querySelector('header') as HTMLElement;
                header.classList.add('none-index');

                //SET_SCHEDULE_DETAIL
                this.SET_SCHEDULE_DETAIL( this.scheduleListsModel[findIdx] );

                this.GET_COMMENTS_ACTION(id)
                  .then(() => {
                      // console.log(this.selectedEvent);
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

        /*this.$nextTick(() => {
            const eventItems = [];

            // const days = (max - min) / 86400000;
            const eventCount = this.scheduleListsModel.length;///this.rnd(days, days + 20);

            const startTimes = [];
            const endTimes = [];

            this.scheduleListsModel.forEach((item, idx )=>{
                // console.log(idx);
                this.addScheduleEvent(idx);
            });
            /!*for (let i: number = 0; i < eventCount; i++) {
                // startTimes.push(new Date(startAt).getTime());
                // endTimes.push(new Date(endAt).getTime());
                this.addScheduleEvent(i);
            }*!/

            /!*
             const min = startTimes.reduce( (prv, cur) => {
                 return (prv > cur) ? cur : prv;
             });
             const max = endTimes.reduce( (prv, cur) => {
                 return (prv > cur) ? prv : cur;
             });

             const startDateItems = Utils.getTodayFullValue(new Date(min));
             const endDateItems = Utils.getTodayFullValue(new Date(max));

             this.startDate=Utils.getDateDashFormat( startDateItems[0], startDateItems[1], startDateItems[2] );
             this.endDate=Utils.getDateDashFormat( endDateItems[0], endDateItems[1], endDateItems[2] );*!/
            // this.events = eventItems;
        });*/

        this.scheduleListsModel.forEach((item, idx )=>{
            console.log(idx);
            this.addScheduleEvent(idx);
        });

    }

    private onAddScheduleClose( val: boolean ) {
        this.isOpenAddSch=val;
        if (!this.isOpenAddSch) {
            const header=document.querySelector('header') as HTMLElement;
            header.classList.remove('none-index');

            console.log(this.scheduleListsModel.length, this.events.length);

            this.addScheduleEvent(this.scheduleListsModel.length-1 );
        }
    }

    private addScheduleEvent( idx: number ) {
        // console.log(this.scheduleListsModel[idx]);
        // console.log(this.scheduleListsModel.length, this.events.length);
        const { startAt, endAt, title, text, owner, count, id }=this.scheduleListsModel[idx];
        this.events.push({
            name: title,
            details: text,
            color: this.colors[ owner.schedule_color ],
            start: new Date(startAt),
            end: new Date( endAt ),
            repeat: count,
            timed:true,
            id, // schedule_id (parent_id)
        });
    }

    private onDeleteCheck( scheduleId: number) {
        const findIdx=this.events.findIndex((item)=> item.id === scheduleId );
        this.deleteScheduleEvent(findIdx);
    }

    private deleteScheduleEvent(idx: number) {
        this.events.splice(idx, 1);
    }

    private onDetailScheduleClose(val: boolean) {
        this.isOpenDetailSch=val;
        const header=document.querySelector('header') as HTMLElement;
        header.classList.remove('none-index');
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

    private updatePopup(isOpen: boolean) {
        this.isOpenAddSch=isOpen;
    }

    private addScheduleOpen(): void{
        const header=document.querySelector('header') as HTMLElement;
        header.classList.add('none-index');
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



}

