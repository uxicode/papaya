import {Vue, Component} from 'vue-property-decorator';
import {
    VSheet,
    VBtn,
    VBtnToggle,
    VContent,
    VCalendar,
    VCalendarDaily,
    VCalendarMonthly,
    VCalendarWeekly,
    VCalendarCategory
} from 'vuetify/lib';

import WithRender from './ScheduleView.html';

@WithRender
@Component({
    components:{
        VSheet,
        VBtn,
        VBtnToggle,
        VContent,
        VCalendar,
        VCalendarDaily,
        VCalendarMonthly,
        VCalendarWeekly,
        VCalendarCategory
    }
})
export default class ScheduleView extends Vue{
    private type: string= 'month';
    private types: string[] = ['month', 'week', 'day', '4day'];
    private mode: string= 'stack';
    private modes: string[] = ['stack', 'column'];
    private weekday: number[] = [0, 1, 2, 3, 4, 5, 6];
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

    public getEvents( time: {start: any, end: any} ) {
        const events = [];

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

            events.push({
                name: this.names[this.rnd(0, this.names.length - 1)],
                start: first,
                end: second,
                color: this.colors[this.rnd(0, this.colors.length - 1)],
                timed: !allDay,
            });
        }

        this.events = events;
    }
    public getEventColor(event: any) {
        return event.color;
    }
    public rnd(a: any, b: any): number {
        return Math.floor((b - a + 1) * Math.random()) + a;
    }
}
