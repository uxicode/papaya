import {Vue, Component, Prop} from 'vue-property-decorator';
import {INotifyList} from '@/views/model/my-class.model';
import WithRender from './Schedule.html';

@WithRender
@Component
export default class Schedule extends Vue {
    private notifyList: INotifyList[] = [
        {
            profile_image: require('@/assets/images/bg-icon.png'),
            name: '1학년 3반 수학',
        },
        {
            profile_image: require('@/assets/images/pic5.png'),
            name: '특목 고등학교 입시 미술반',
        },
        {
            profile_image: require('@/assets/images/bg-icon.png'),
            name: '미술 아동반',
        },
        {
            profile_image: require('@/assets/images/pic5.png'),
            name: '6학년 3반 독서부',
        },
    ];
}