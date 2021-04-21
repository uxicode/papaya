import {Vue, Component } from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import Modal from '@/components/modal/modal.vue';
import TxtField from '@/components/form/txtField.vue';
import Btn from '@/components/button/Btn.vue';
import WithRender from './ScheduleView.html';
import {IClassInfo} from '@/views/model/my-class.model';
import ImageSettingService from '@/views/service/profileImg/ImageSettingService';
import {CalendarEvent} from 'vuetify';


const MyClass = namespace('MyClass');

interface ITimeModel{
    apm: string;
    hour: string;
    minute: string;
}

@WithRender
@Component({
    components:{
        Modal,
        TxtField,
        Btn
    }
})
export default class ScheduleView extends Vue{
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


    private calendarModel: string= '';
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


    private colors: string[] = ['#3F51B5', '#00BCD4', '#673AB7', '#2196F3', '#4CAF50', '#FF9800', '#757575'];
    private names: string[] =  ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'];

    //datepicker
    private startDatePickerModel: string= new Date().toISOString().substr(0, 10);
    private startTimeSelectModel: ITimeModel={ apm:'오전', hour:'12', minute: '30'};
    private startDateMenu: boolean= false; // 캘린 셀렉트 열고 닫게 하는 toggle 변수
    private startTimeMenu: boolean=false;  // 시간 셀렉트 열고 닫게 하는 toggle 변수

    private endDatePickerModel: string= new Date().toISOString().substr(0, 10);
    private endTimeSelectModel: ITimeModel={ apm:'오전', hour:'12', minute: '30'};
    private endDateMenu: boolean= false; // 캘린 셀렉트 열고 닫게 하는 toggle 변수
    private endTimeMenu: boolean=false;  // 시간 셀렉트 열고 닫게 하는 toggle 변수

    private loopRangeModel: string = '반복없음';
    private loopRangeItems: string[] = ['반복없음', '매일', '매주', '매월', '매년'];
    private loopRangeCheck: boolean=false;
    private loopRangeCount: number | string=10;

    @MyClass.Getter
    private myClassHomeModel!: IClassInfo;

    get currentLoopRangeItems(): string[]{
        return this.loopRangeItems;
    }
    get currentStartTimeModel(): string{
        return `${this.startTimeSelectModel.apm} ${this.startTimeSelectModel.hour}시 ${this.startTimeSelectModel.minute} 분`;
    }
    get currentEndTimeModel(): string{
        return `${this.endTimeSelectModel.apm} ${this.endTimeSelectModel.hour}시 ${this.endTimeSelectModel.minute} 분`;
    }


    public created(){
        console.log(new Date().toISOString());
    }

    public mounted() {
        //시작일과 종료일이 변경되었는지 확인합니다. 변경된 경우 변경 이벤트를 업데이트하고 내 보냅니다.
        ( this.$refs.calendar as CalendarEvent).checkChange();
    }

    private loopRangeCountClickHandler( value: string ){
        this.loopRangeCount=value;
        // console.log(this.loopRangeCount);
    }

    private setToday() {
        this.calendarModel = '';
    }
    private prev() {
        ( this.$refs.calendar as CalendarEvent).prev();
    }
    private next() {
        ( this.$refs.calendar as CalendarEvent).next();
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
            this.createStart = this.getTimestamp(mouse);
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
        /*
        tms-
        {
        date: "2021-04-20"
        day: 20
        future: false
        hasDay: true
        hasTime: true
        hour: 0
        minute: 1
        minutesToPixels: ƒ ()
        month: 4
        past: true
        present: false
        time: "00:01"
        timeDelta: ƒ ()
        timeToY: ƒ ()
        week: [{…}]
        weekday: 2
        year: 2021 } */

        const mouse = this.toTime(tms);

        if (this.dragEvent && this.dragTime !== null ) {
            const start = this.dragEvent.start;
            const end = this.dragEvent.end;
            const duration = end - start;
            const newStartTime = mouse - this.dragTime;
            const newStart = this.getTimestamp(newStartTime);
            const newEnd = newStart + duration;

            this.dragEvent.start = newStart;
            this.dragEvent.end = newEnd;
        } else if (this.createEvent && this.createStart !== null) {
            const mouseRounded = this.getTimestamp(mouse, false);
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
    private getTimestamp( time: number, down: boolean = true): number{
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
    private getEventColor(event: CalendarEvent) {
        return event.color;
    }

    //상세내역 팝업
    private showEvent( eventObj: { nativeEvent: MouseEvent, event: CalendarEvent} ) {
        // console.log( eventObj.event );
        if (this.type === 'month') {
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
    }

    private updateRange( time: { start: any, end: any } ) {
        const eventItems = [];

        const min = new Date(`${time.start.date}T00:00:00`).getTime();
        const max = new Date(`${time.end.date}T23:59:59`).getTime();
        const days = (max - min) / 86400000;
        const eventCount = this.rnd(days, days + 20);

        for (let i = 0; i < eventCount; i++) {
            const timed = this.rnd(0, 3) !== 0;
            const firstTimestamp = this.rnd(min, max);
            const secondTimestamp = this.rnd(2, timed ? 8 : 288) * 900000;
            const start = firstTimestamp - (firstTimestamp % 900000);
            const end = start + secondTimestamp;

            eventItems.push({
                name: this.rndElement(this.names),
                color: this.rndElement(this.colors),
                start,
                end,
                timed,
            });
        }

        this.events = eventItems;
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



}
