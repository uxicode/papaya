import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IClassInfo} from '@/views/model/my-class.model';
import {IScheduleOwner, IScheduleTotal, ITimeModel} from '@/views/model/schedule.model';
import {CalendarEvent, CalendarEventParsed} from 'vuetify';
import { RRule } from 'rrule';
import ImageSettingService from '@/views/service/profileImg/ImageSettingService';
import Modal from '@/components/modal/modal.vue';
import TxtField from '@/components/form/txtField.vue';
import Btn from '@/components/button/Btn.vue';
import ImagePreview from '@/components/preview/imagePreview.vue';
import FilePreview from '@/components/preview/filePreview.vue';
import AddSchedule from '@/views/class/schedule/AddSchedule';
import ScheduleDetailPopup from '@/views/class/schedule/ScheduleDetailPopup';
import ConfirmPopup from '@/components/modal/confirmPopup.vue';
import NoticePopup from '@/components/modal/noticePopup.vue';
import UserService from '@/api/service/UserService';
import {IUserMe} from '@/api/model/user.model';
import WithRender from './ScheduleView.html';


const Auth = namespace('Auth');
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
        ScheduleDetailPopup,
        ConfirmPopup,
        NoticePopup
    }
})
export default class ScheduleView extends Vue{

    @Auth.Action
    private USER_ME_ACTION!: ()=>Promise<IUserMe>;

    @Schedule.Mutation
    private SET_SCHEDULE_DETAIL!: ( data: IScheduleTotal )=> void;

    @Schedule.Action
    private GET_SCHEDULE_DETAIL_ACTION!: (payload: { classId: number, scheduleId: number })=>Promise<any>;

    @Schedule.Action
    private GET_SCHEDULE_ACTION!: ( payload: { classId: number,  paging: {page_no: number, count: number } }) => Promise<any>;

    @Schedule.Action
    private GET_SCHEDULE_COMMENTS_ACTION!: ( scheduleId: number ) => Promise<any>;

    @MyClass.Getter
    private classID!: string | number;

    @MyClass.Getter
    private myClassHomeModel!: IClassInfo;

    /* 댓글 관련 */
    @Schedule.Getter
    private scheduleListItems!: IScheduleTotal[];

    @Schedule.Getter
    private schEditId!: number;

    @Auth.Getter
    private userInfo!: IUserMe;
    // private formData!: FormData;
    private isOpenAddSch: boolean=false;
    private isOpenDetailSch: boolean= false;
    // private isTimeSelect: boolean=false;

    //초기 캘린더를 월간으로 표시
    private type: string= 'month';
    // v-calendar 의 :weekday-format="getDay" 와 연동시킴.
    private daysOfWeek: string[] = ['월', '화', '수', '목', '금', '토', '일'];
    /*
   //상단 head 테이블의 월/화/수/목/금/토/일 배치 하는 예시
   private weekdays: Array<{text: string, value: number[] }>=[
        { text: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
        { text: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
        { text: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
        { text: 'Mon, Wed, Fri', value: [1, 3, 5] },
    ];*/
    private weekdays: number[] = [1, 2, 3, 4, 5, 6, 0];

    // private selectedEvent ={};
    // private selectedElement: HTMLElement | null=null;
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
    private scheduleColor: Array<{id: number, color: string, title: string}>=[
        {id:0, color: '#8d2600', title: '석류'},
        {id:1, color: '#f9862a', title: '파파야'},
        {id:2, color: '#f5b300', title: '귤'},
        {id:3, color: '#ffd100', title: '바나나'},
        {id:4, color: '#d8d029', title: '아보카도'},
        {id:5, color: '#adc500', title: '라임'},
    ];
    private selectedColor: {id: number, color: string, title: string} = {id:-1, color:'', title:''};
    private loopRangeCount: number | string=10;
    private noticeTitle: string = '';
    private confirmTitle: string = '';
    private noticeDesc: string = '';
    private confirmDesc: string = '';
    private isConfirmPopupOpen: boolean=false;
    private isNoticePopupOpen: boolean=false;
    /*private scheduleData: {
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
    };*/
    get updateNoticeTitle(): string{
        return this.noticeTitle;
    }
    get updateNoticeDesc(): string{
        return this.noticeDesc;
    }
    get updateConfirmTitle(): string{
        return this.confirmTitle;
    }
    get updateConfirmDesc(): string{
        return this.confirmDesc;
    }

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

    public beforeRouteLeave(to: any, from: any, next: any) {
        console.log('beforeRouteUpdate=', to, from, next);
    }

    public async created(){
        //새로고침시에 sidemenu 메뉴 활성화 동기화 시킴.
        if (this.$route.query.sideNum && this.$route.query.sideNum !== '') {
            this.$emit('sideNum', Number(this.$route.query.sideNum));
        }
        // console.log(new Date().toISOString());
        await this.getScheduleList()
          .then(()=>{
              console.log('캘린더 로드 완료.');
          });

        const rule = new RRule({
            freq: RRule.WEEKLY,  //매주 반복  //RRule.DAILY - 매일 반복  //RRule.MONTHLY - 매월 //RRule.YEARLY - 매년
            dtstart: new Date( Date.UTC(2021, 3, 30, 4, 28, 0)),
            count: 30,
            interval: 1
        });
        // console.log(rule.all());
    }

    public mounted() {

        setTimeout(() => {
            //스케줄 데이터 모델이 전부 안착되면 ---> v-canlendar 가 요구하는 속성값( 이벤트 )이 들어 있는 배열 을 지정해주어야 한다.
            this.scheduleListsModel.forEach((item, idx )=>{
                // console.log(idx);
                //캘린더 날짜이벤트가 배열에 지정되면 캘린더에 랜더링 시킨다.
                //데이터모델 갱신이 아닌 아래 배열( this.events ) 의 갱신이 이루어져야 캘린더의 화면을 갱신시킬 수 있다.
                this.addScheduleEvent(idx);
            });

            //시작일과 종료일이 변경되었는지 확인합니다. 변경된 경우 변경 이벤트를 업데이트하고 내 보냅니다.
            this.calendarInstance.checkChange();
        }, 1000);

    }

    /**
     * 초기에 캘린더 이벤트 등 데이터 받아오기.
     * @private
     */
    private async getScheduleList(){
        // console.log(this.classID === Number( this.$route.params.classId ) );
        await this.GET_SCHEDULE_ACTION( { classId: Number(this.classID), paging:{page_no:1, count: 100} })
          .then((data)=>{
              //이미 배열에 데이터가 들어가 있다면 비우고 재설정.
              if (this.events && this.events.length > 0) {
                  this.events = [];
              }
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
            console.log('캘린더 id=', id);
            // const findIdx = this.scheduleListsModel.findIndex((item) => item.id === id);
            setTimeout(() => {
                this.selectedOpen = true;

                this.isOpenDetailSch=true;

                const header=document.querySelector('header') as HTMLElement;
                header.classList.add('none-index');

                //SET_SCHEDULE_DETAIL
                // this.SET_SCHEDULE_DETAIL( this.scheduleListsModel[findIdx] );
                this.GET_SCHEDULE_DETAIL_ACTION( {classId: Number(this.classID), scheduleId: id })
                  .then( (data)=>{
                      console.log('캘린더 상세보기');
                  });

                this.GET_SCHEDULE_COMMENTS_ACTION(id)
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

    /**
     * 캘린더 이벤트 생성.
     * @param time
     * @private
     */
    private updateRange( time: { start: any, end: any } ) {
        //이미 배열에 데이터가 들어가 있다면 비우고 재설정.
        if (this.events && this.events.length > 0) {
            this.events = [];
        }
        this.scheduleListsModel.forEach((item, idx )=>{
            console.log(idx);
            this.addScheduleEvent(idx);
        });

    }

    /**
     * 일정 추가 팝업이 닫힌 후 호출되는 이벤트 핸들러
     * @param val
     * @private
     */
    private onAddScheduleClose( val: boolean ) {
        this.isOpenAddSch=val;
        if (!this.isOpenAddSch) {
            //상단 gnb depth 가 높기에 일정 생성 팝업이 나올때 gnb depth 를 낮춤~
            const header=document.querySelector('header') as HTMLElement;
            header.classList.remove('none-index');
            // console.log(this.scheduleListsModel.length, this.events.length);
            this.addScheduleEvent(this.scheduleListsModel.length-1 );
        }
    }

    /**
     * schedule 추가 event( vuetify calendar 인스턴스 이벤트에 대입됨 )
     * @param idx
     * @private
     */
    private addScheduleEvent( idx: number ) {
        // console.log(this.scheduleListsModel[idx]);
        // console.log(this.scheduleListsModel.length, this.events.length);
        const { startAt, endAt, title, text, owner, count, id }=this.scheduleListsModel[idx];
        const scheduleColorVal=this.getOwnerScheduleColor(owner);
        this.events.push({
            name: title,
            details: text,
            color: this.scheduleColor[ scheduleColorVal? scheduleColorVal : 0 ].color,
            start: new Date(startAt).getTime(),
            end: new Date( endAt ).getTime(),
            repeat: count,
            timed: true,
            id, // schedule_id (parent_id)
        });
    }

    /**
     * 스케쥴의 소유자인지 체크 후에송 user schedule_color 변경
     * @param owner
     * @private
     */
    private getOwnerScheduleColor( owner: IScheduleOwner ): number {
        return  this.getIsOwner(owner.user_id)? this.userInfo.schedule_color : owner.schedule_color;
    }

    /**
     * 캘린더의 소유자인지 체크
     * @param userId
     * @private
     */
    private getIsOwner( userId: number  ): boolean {
        return (this.userInfo.id === userId);
    }
    private onChangeColor( item: {id: number, color: string, title: string}) {
        this.isConfirmPopupOpen=true;
        this.confirmTitle = '일정 색상 변경';
        this.confirmDesc = `선택하신 ${item.title} 컬러로 변경하시겠습니다까?`;
        this.selectedColor=item;
    }
    private onConfirmClose( result: boolean) {
        this.isConfirmPopupOpen=false;
        if (result) {
            this.changeScheduleColor( this.selectedColor )
              .then(( msg: string | undefined )=>{
                  console.log('컬러 변경=', msg );
                  this.isNoticePopupOpen=true;
                  this.confirmTitle ='';
                  this.confirmDesc ='';
                  this.noticeTitle = '일정 색상 변경 완료';
                  this.noticeDesc = '선택하신 색상으로 변경 되었습니다.';
              });
        }
    }
    private onNoticePopupClose( value: boolean ) {
        this.isNoticePopupOpen=value;
        if (!value) {
            this.noticeTitle = '';
            this.noticeDesc = '';
        }
    }
    private async changeScheduleColor( item: {id: number, color: string, title: string} ) {
        if( this.userInfo ){
            console.log('this.userInfo=', this.userInfo);
            const {user_id}=this.userInfo;
            try {

                //user info 수정
                await UserService.setUserInfo(user_id, {schedule_color: item.id})
                  .then((data)=>{
                      console.log('컬러 변경=', data);
                  });
                //userMe 데이터 갱신 시킴.
                await this.USER_ME_ACTION()
                  .then((data)=>{
                      this.updateOwnerScheduleColor();
                  });
                return Promise.resolve('success');
            } catch (error){
                return Promise.reject(error);
            }
        }
    }
    /**
     * 캘린더에 지정된 컬러를 재지정해서 엘리먼트 컬러값을 변경( re-render )한다.
     * @private
     */
    private updateOwnerScheduleColor() {
        this.events.forEach( ( item, idx)=>{
            const { owner }=this.scheduleListsModel[idx];
            const scheduleColorVal=this.getOwnerScheduleColor(owner);
            const color=this.scheduleColor[ scheduleColorVal? scheduleColorVal : 0 ].color;
            this.events.splice( idx, 1, {...item, color});
        });
    }
    private addScheduleClose( value: boolean ) {
        this.isOpenAddSch=false;
    }
    private updatePopup(isOpen: boolean) {
        this.isOpenAddSch=isOpen;
    }
    private addScheduleOpen(): void{
        const header=document.querySelector('header') as HTMLElement;
        header.classList.add('none-index');
        this.updatePopup(true);
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

    private onEditSchedule() {
        if (this.schEditId !== -1) {
            console.log(this.schEditId);
            const findIdx = this.scheduleListsModel.findIndex((item) => item.id === this.schEditId);
            const { startAt, endAt, title, text, owner, count, id }=this.scheduleListsModel[findIdx];
            const scheduleColorVal=this.getOwnerScheduleColor(owner);

            this.events.splice( findIdx, 1, {
                name: title,
                details: text,
                color: this.scheduleColor[ scheduleColorVal? scheduleColorVal : 0 ].color,
                start: new Date(startAt),
                end: new Date( endAt ),
                repeat: count,
                timed:true,
                id, // schedule_id (parent_id)
            });
        }
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
    //상단 월 달력 header 에 custom 요일 표시
    private getDay( d: any ){
        const dayIdx=( d.weekday - 1<0)? this.daysOfWeek.length-1 : d.weekday - 1;
        return this.daysOfWeek[dayIdx];
    }
    private getEventColor(event: CalendarEvent) {
        return event.color;
    }
    private extendBottom(event: any ) {
        // console.log('extendBottom=', event );
        this.createEvent = event;
        this.createStart = event.start;
        this.extendOriginal = event.end;
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

