import {Vue, Component, Prop} from 'vue-property-decorator';
import {INotifyList, INotifyFeedList, IFeedList} from '@/views/model/my-class.model';
import WithRender from './Notify.html';

@WithRender
@Component
export default class Notify extends Vue {
    private isActive: boolean = false;

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

    private notifyFeedList: INotifyFeedList[] = [
        {
            profile_image: require('@/assets/images/pic5.png'),
            name: '꿈꾸는 5학년 1반',
            feedTit: '파파야초등학교 10월 가을 체험학습',
            writer: '김미영선생님',
            updatedDiffTime: '1분 전',
        },
        {
            profile_image: require('@/assets/images/pic5.png'),
            name: '꿈꾸는 5학년 1반',
            feedTit: '파파야초등학교 10월 가을 체험학습',
            writer: '김미영선생님',
            updatedDiffTime: '1분 전',
        },
    ];

    private feedList: IFeedList[] = [
        {
            feedTit: '파파야초등학교 10월 가을 체험학습',
            profile_image: require('@/assets/images/pic5.png'),
            name: '꿈꾸는 5학년 1반',
            writer: '김미영선생님',
            updatedDiffTime: '1분 전',
            feedText: ['운동회는, 전교생이 청군과 백군으로 나눠 운동장에서 하루 동안 대결을 펼치는 운동회입니다. 달리기를 하면 1등에서 3등까지는 등수 별로 도장을 받았습니다.',
            '손목위에 찍힌 도장을 확인하며, 학용품도 받았죠. 또한, 김밥과 치킨 등 부모님께서 준비한 도시락을 먹는 것도 운동회에 대한 추억입니다. 이번에는 운동회의 역사와 현재의 운동회를 알아보는 시간을 가져보겠습니다.'],
            feedType: 'img',
            // imgList: [require('@/assets/images/pic.png'),
            //           require('@/assets/images/pic2.png'),
            //           require('@/assets/images/pic3.png')],
            feedViewer: 124,
            comment: 12,
        },
        {
            feedTit: '수학 2단원 관련 공지사항',
            profile_image: require('@/assets/images/pic5.png'),
            name: '1학년 3반 수학',
            writer: '박수한선생님',
            updatedDiffTime: '5분 전',
            feedText: ['안녕하세요, 박수한 선생님입니다.',
            '2020년을 맞이하여 1학년 1학기부터 3학년 1학기까지의 문제가 추가되었습니다. 기존에 제공하던 2학년 2학기 문제는 교과 과정이 개편되면서 다시 수정을 해야 할 부분이 있어서 선택하실 수 없으며, 교과문제의 난이도 선택 메뉴를 삭제하였습니다.',
            '감사합니다.'],
            feedType: '',
            feedViewer: 124,
            comment: 12,
        },
        {
            feedTit: '6학년 2학기 수학 II 3단원',
            profile_image: require('@/assets/images/pic5.png'),
            name: '1학년 3반 수학',
            writer: '박수한선생님',
            updatedDiffTime: '5분 전',
            feedText: ['어디로 가야 하는지 지도와 나침반이 있어야 올바른 길로 올바른 속도로 그리고 올바른 방향으로 갈 수 있죠. 공부에 있어서는 목차가 그러한데요. 오늘은 수학 II 목차를 3단원 내용 모두 다 정리해보려고 합니다.',
            '첨부된 파일 확인 부탁드립니다.'],
            feedType: 'file',
            feedViewer: 1121,
            comment: 12,
        },
        {
            feedTit: '미술박물관 관람일 투표 부탁드립니다.',
            profile_image: require('@/assets/images/pic5.png'),
            name: '미술아동반',
            writer: '김에린선생님',
            updatedDiffTime: '5분 전',
            feedText: ['곧 전국의 박물관을 무료로 갈 수 있는 날이어서 가까운 마리에타 다운타운에 있는 역사 박물관엘 갈 예정입니다. 이 건물은 19세기 중반에 목화창고로 지어졌다가 인근 기차역에서 나오는 손님을 상대로 식당으로 개조됐고 윗층은 호텔로도 쓰였습니다.',
            '가능한 날짜에 투표 부탁드립니다.'],
            feedType: 'vote',
            feedViewer: 1121,
            comment: 12,
        },
        {
            feedTit: '제3회 초등학교 미술대회 안내사항',
            profile_image: require('@/assets/images/pic5.png'),
            name: '꿈꾸는 5학년 1반',
            writer: '김미영선생님',
            updatedDiffTime: '5분 전',
            feedText: ['자연사랑 어린이 미술대회는 지난 2016년부터 개최해 온 전통 있는 미술대회 입니다.',
            '아이들에게 환경보호의 중요성을 전달함은 물론 미술교육의 발전에 기여하고자 그동안 금강산 미술 소풍, 학교숲, 중국학생 참가 등 많은 에피소드를 만들며 3년째 진행되어 왔으며 전국에서 매년 3만명 이상의 어린이들이 참가하여 대한민국 대표 어린이 미술대회로 자리매김하였습니다.',
            '자세한 내용은 아래에 링크를 첨부하였으니, 관심 있으신 학부모 및 학생들은 확인… <a href="" class="fd-more">더보기</a>'],
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