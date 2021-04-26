import {Vue, Component } from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IClassInfo} from '@/views/model/my-class.model';
import {IScheduleTotal, ITimeModel } from '@/views/model/schedule.model';
import {CalendarEvent, CalendarEventParsed} from 'vuetify';
import MyClassService from '@/api/service/MyClassService';
import ImageSettingService from '@/views/service/profileImg/ImageSettingService';
import {Utils} from '@/utils/utils';
import Modal from '@/components/modal/modal.vue';
import TxtField from '@/components/form/txtField.vue';
import Btn from '@/components/button/Btn.vue';
import WithRender from './ScheduleView.html';
import { RRule, RRuleSet, rrulestr } from 'rrule';

const MyClass = namespace('MyClass');


@WithRender
@Component({
    components:{
        Modal,
        TxtField,
        Btn
    }
})
export default class ScheduleView extends Vue{

    @MyClass.Getter
    private classID!: string | number;


    @MyClass.Getter
    private myClassHomeModel!: IClassInfo;


    private isPopup: boolean=false;
    private isTimeSelect: boolean=false;

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
    private startTimeSelectModel: ITimeModel={ apm:'오전', hour:'12', minute: '30'};
    private startDateMenu: boolean= false; // 캘린 셀렉트 열고 닫게 하는 toggle 변수
    private startTimeMenu: boolean=false;  // 시간 셀렉트 열고 닫게 하는 toggle 변수

    private endDatePickerModel: string= new Date().toISOString().substr(0, 10);
    private endTimeSelectModel: ITimeModel={ apm:'오전', hour:'12', minute: '30'};

    private endTimeMenu: boolean=false;  // 시간 셀렉트 열고 닫게 하는 toggle 변수

    private loopRangeModel: string = '반복없음';
    private loopRangeItems: string[] = ['반복없음', '매일', '매주', '매월', '매년'];
    private loopRangeCheck: boolean=false;
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




    get currentLoopRangeItems(): string[]{
        return this.loopRangeItems;
    }
    get currentStartTimeModel(): string{
        return `${this.startTimeSelectModel.apm} ${this.startTimeSelectModel.hour}시 ${this.startTimeSelectModel.minute} 분`;
    }
    get currentEndTimeModel(): string{
        return `${this.endTimeSelectModel.apm} ${this.endTimeSelectModel.hour}시 ${this.endTimeSelectModel.minute} 분`;
    }

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

    private get calendarInstance(): Vue & {
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

    public  mounted() {
        //시작일과 종료일이 변경되었는지 확인합니다. 변경된 경우 변경 이벤트를 업데이트하고 내 보냅니다.
         this.calendarInstance.checkChange();
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
        await MyClassService.getAllScheduleByClassId( this.classID )
          .then((data)=>{
              console.log( 'getAllScheduleByClassId=', data.class_schedule_list );
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

        console.log(data);
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
            setTimeout(() => this.selectedOpen = true, 10);
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
        this.isPopup=isOpen;
    }

    private closePopup(): void{
        this.isPopup=false;
    }

    private addScheduleOpen(): void{
        this.updatePopup(true);
    }

    private getProfileImg(imgUrl: string | null | undefined ): string{
        return ImageSettingService.getProfileImg( imgUrl );
    }

    /**
     * 일정 등록시 타이틀 부분
     * @param val
     * @private
     */
    private addScheduleTitleChange(val: string) {
        this.scheduleData.title=val;
        console.log(this.scheduleData.title);
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
        console.log(this.startDatePickerModel);
    }

    private addStartApmSchedule( val: string ) {
        console.log(val, this.currentStartTimeModel );
    }

    private startTimeChange(){
        console.log(this.currentStartTimeModel);
    }

    /**
     * drag 시작
     * @param dragObj
     * @private
     */
    private startDrag( dragObj: { event: any, timed: any }) {
        console.log(dragObj.event, dragObj.timed);

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
        console.log('extendBottom=', event );
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

    private onAddSchedulePopupCloseHandler(): void{
        this.isPopup=false;
        this.loopRangeCheck = false;
    }

    private scheduleDetailAreaInputHandler(value: any) {
        console.log(value);
        this.scheduleData.body=value;
    }

    private scheduleDetailAreaFocusHandler(value: any) {
        this.isFocusContentsArea=false;

        this.$nextTick(()=>{
            const scheduleDetailAreaTxt=this.$refs.scheduleDetailAreaTxt as HTMLElement;
            scheduleDetailAreaTxt.focus();
        });

    }

    private scheduleDetailAreaBlurHandler(value: any) {
        this.isFocusContentsArea=true;
    }

    //파일 다운로드 설정.
    //var filenamesHeader= res.headers['content-disposition'];
    //var filename=filenamesHeader.substr( filenamesHeader.indexOf('="')+1 );
    //res.data, 'application/zip', `${filename.replace(/[\"]/g, '' ) }`
    //res.data, res.headers['content-type'], selectedFile.originalname
    private fileDown( data: any, downType: string, fileName: string ){
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

    private addFileInputFocus() {
        const event = new MouseEvent('click', {
            view: window,
            bubbles: false,
            cancelable: false
        });
        const imgFileInput =this.$refs.imgFileInput as HTMLInputElement;
        imgFileInput.dispatchEvent(event);
        // console.log('클릭', imgFileInput);
    }

    private addFileToImage(files: any ) {
        // const multipleContainer = document.querySelector("#multipleImgs")
        const contentsPreview= document.querySelector('#contentsPreview') as HTMLElement;
        const fileArr = Array.from(files);
        console.log(fileArr);
        fileArr.forEach( (file: any, index: number) => {
            // const reader = new FileReader();
            const $imgDiv = document.createElement('div');
            const $img = document.createElement('img');
            $img.classList.add('img-responsive');
            $imgDiv.classList.add('float-lt');
            $imgDiv.classList.add('wd-half');
            $imgDiv.appendChild($img);
            $img.src=URL.createObjectURL(file);
            contentsPreview.appendChild($imgDiv);
            contentsPreview.classList.add('clearfix');
        });



        // 인풋 태그에 파일들이 있는 경우
        /* if(input.files) {
             // 이미지 파일 검사 (생략)
             console.log(input.files)
             // 유사배열을 배열로 변환 (forEach문으로 처리하기 위해)
             const fileArr = Array.from(input.files)
             const $colDiv1 = document.createElement("div")
             const $colDiv2 = document.createElement("div")
             $colDiv1.classList.add("column")
             $colDiv2.classList.add("column")
             fileArr.forEach((file, index) => {
                 const reader = new FileReader()
                 const $imgDiv = document.createElement("div")
                 const $img = document.createElement("img")
                 $img.classList.add("image")
                 const $label = document.createElement("label")
                 $label.classList.add("image-label")
                 $label.textContent = file.name
                 $imgDiv.appendChild($img)
                 $imgDiv.appendChild($label)
                 reader.onload = e => {
                     $img.src = e.target.result

                     $imgDiv.style.width = ($img.naturalWidth) * 0.2 + "px"
                     $imgDiv.style.height = ($img.naturalHeight) * 0.2 + "px"
                 }

                 console.log(file.name)
                 if(index % 2 == 0) {
                     $colDiv1.appendChild($imgDiv)
                 } else {
                     $colDiv2.appendChild($imgDiv)
                 }
                 reader.readAsDataURL(file)
             })
             multipleContainer.appendChild($colDiv1)
         }*/
    }
}
