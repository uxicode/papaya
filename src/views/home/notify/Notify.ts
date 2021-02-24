import {Vue, Component, Prop} from 'vue-property-decorator';
import {INotifyList, INotifyFeedList, IFeedList} from '@/views/home/model/my-class.model';
import WithRender from './Notify.html';

@WithRender
@Component
export default class Notify extends Vue {
    private isActive: boolean = false;

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

    private notifyFeedList: INotifyFeedList[] = [
        {
            classThumb: require('@/assets/images/pic5.png'),
            className: '꿈꾸는 5학년 1반',
            feedTit: '파파야초등학교 10월 가을 체험학습',
            writer: '김미영선생님',
            updatedDiffTime: '1분 전',
        },
        {
            classThumb: require('@/assets/images/pic5.png'),
            className: '꿈꾸는 5학년 1반',
            feedTit: '파파야초등학교 10월 가을 체험학습',
            writer: '김미영선생님',
            updatedDiffTime: '1분 전',
        },
    ];

    private feedList: IFeedList[] = [
        {
            feedTit: '파파야초등학교 10월 가을 체험학습',
            classThumb: require('@/assets/images/pic5.png'),
            className: '꿈꾸는 5학년 1반',
            writer: '김미영선생님',
            updatedDiffTime: '1분 전',
            imgList: [require('@/assets/images/pic.png'), require('@/assets/images/pic2.png'), require('@/assets/images/pic3.png')],
            feedViewer: 124,
            comment: 12,
        },
    ];

    /**
     * 화살표 버튼 클릭시 예약 알림 토글
     * @public
     */
    public accordionToggle(): void {
        this.isActive = !this.isActive;
    }
}