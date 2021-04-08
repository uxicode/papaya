import {Vue, Component, Watch} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import Modal from '@/components/modal/modal.vue';
import WithRender from './ScheduleView.html';
import {IClassInfo} from '@/views/model/my-class.model';
import {Utils} from '@/utils/utils';

const MyClass = namespace('MyClass');

@WithRender
@Component({
    components:{
        Modal
    }
})
export default class ScheduleView extends Vue{
    private isPopup: boolean=false;

    private type: string= 'month';
    private types: string[] = ['month', 'week', 'day', '4day'];
    private mode: string= 'stack';
    private modes: string[] = ['stack', 'column'];
    private weekday: number[] = [1, 2, 3, 4, 5, 6, 0];
    private weekdays: Array<{text: string, value: number[] }>=[
        { text: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
        { text: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
        { text: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
        { text: 'Mon, Wed, Fri', value: [1, 3, 5] },
    ];
    private value: string= '';
    private events: any[] = [];
    private colors: string[] = ['#3F51B5', '#00BCD4', '#673AB7', '#2196F3', '#4CAF50', '#FF9800', '#757575'];
    private names: string[] =  ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'];

    //datepicker
    private datePickerModel: string= new Date().toISOString().substr(0, 10);
    private menu1: boolean= false;

    @MyClass.Getter
    private myClassHomeModel!: IClassInfo;

    public getEvents( time: {start: any, end: any} ) {
        const eventItems= [];

        const min = new Date(`${time.start.date}T00:00:00`);
        const max = new Date(`${time.end.date}T23:59:59`);
        const days = (max.getTime() - min.getTime()) / 86400000;
        const eventCount = this.rnd(days, days + 20);

        for (let i = 0; i < eventCount; i++) {
            const allDay = this.rnd(0, 3) === 0;
            const firstTimestamp = this.rnd(min.getTime(), max.getTime());
            const first = new Date(firstTimestamp - (firstTimestamp % 900000));
            const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000;
            const second = new Date(first.getTime() + secondTimestamp);

            eventItems.push({
                name: this.names[this.rnd(0, this.names.length - 1)],
                start: first,
                end: second,
                color: this.colors[this.rnd(0, this.colors.length - 1)],
                timed: !allDay,
            });
        }

        this.events = eventItems;
    }

    public created(){
        console.log(new Date().toISOString());
    }

    public getDay(date: any){
        const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
        // console.log(date.weekday);
        return daysOfWeek[date.weekday];
    }
    public getEventColor(event: any) {
        return event.color;
    }
    public rnd(a: any, b: any): number {
        return Math.floor((b - a + 1) * Math.random()) + a;
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

    private getProfileImg( imgUrl: string | null | undefined ): string{
        const randomImgItems = [
            'image-a.jpg',
            'image-b.jpg',
            'image-c.jpg',
            'image-d.jpg',
            'image-e.jpg'
        ];
        let img: string= '';
        if( imgUrl === null || imgUrl === undefined){
            img=randomImgItems[ Utils.getRandomNum(0, 5) ];
        }else if( !isNaN( parseInt(imgUrl, 10) ) ){
            img=randomImgItems[ parseInt(imgUrl, 10) ];
        }else{
            img=imgUrl;
        }

        return ( imgUrl !== null && imgUrl !== undefined )? img : require( `@/assets/images/${img}` );
    }



}
