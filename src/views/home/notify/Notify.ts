import {Vue, Component, Prop} from 'vue-property-decorator';
import WithRender from './Notify.html';

interface INotifyList {
    classThumb: () => void;
    className: string;
}

interface INotifyFeedList extends INotifyList {
    feedTit: string;
    writer: string;
    updatedDiffTime: string;
}

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
    /**
     * 화살표 버튼 클릭시 약관 내용 토글
     * @public
     */
    public accordionToggle(): void {
        this.isActive = !this.isActive;
    }
}