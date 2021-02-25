import {Vue, Component, Prop} from 'vue-property-decorator';
import {INotifyList} from '@/views/home/model/my-class.model';
import WithRender from './Schedule.html';

@WithRender
@Component
export default class Schedule extends Vue {
    private notifyList: INotifyList[] = [
        {
            classThumb: require('@/assets/images/bg-icon.png'),
            className: '1학년 3반 수학',
        },
        {
            classThumb: require('@/assets/images/pic5.png'),
            className: '특목 고등학교 입시 미술반',
        },
        {
            classThumb: require('@/assets/images/bg-icon.png'),
            className: '미술 아동반',
        },
        {
            classThumb: require('@/assets/images/pic5.png'),
            className: '6학년 3반 독서부',
        },
    ];
}