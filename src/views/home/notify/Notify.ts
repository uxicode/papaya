import {Vue, Component, Prop} from 'vue-property-decorator';
import {INotifyList, INotifyFeedList, IFeedList} from '@/views/model/my-class.model';
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
            feedType: 'img',
            // imgList: [require('@/assets/images/pic.png'),
            //           require('@/assets/images/pic2.png'),
            //           require('@/assets/images/pic3.png')],
            feedViewer: 124,
            comment: 12,
        },
        {
            feedTit: '수학 2단원 관련 공지사항',
            classThumb: require('@/assets/images/pic5.png'),
            className: '1학년 3반 수학',
            writer: '박수한선생님',
            updatedDiffTime: '5분 전',
            feedType: '',
            feedViewer: 124,
            comment: 12,
        },
        {
            feedTit: '6학년 2학기 수학 II 3단원',
            classThumb: require('@/assets/images/pic5.png'),
            className: '1학년 3반 수학',
            writer: '박수한선생님',
            updatedDiffTime: '5분 전',
            feedType: 'file',
            feedViewer: 1121,
            comment: 12,
        },
        {
            feedTit: '미술박물관 관람일 투표 부탁드립니다.',
            classThumb: require('@/assets/images/pic5.png'),
            className: '미술아동반',
            writer: '김에린선생님',
            updatedDiffTime: '5분 전',
            feedType: 'vote',
            feedViewer: 1121,
            comment: 12,
        },
        {
            feedTit: '제3회 초등학교 미술대회 안내사항',
            classThumb: require('@/assets/images/pic5.png'),
            className: '꿈꾸는 5학년 1반',
            writer: '김미영선생님',
            updatedDiffTime: '5분 전',
            feedType: 'link',
            feedViewer: 1121,
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