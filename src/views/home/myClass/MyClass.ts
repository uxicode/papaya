import {Vue, Component, Prop} from 'vue-property-decorator';
import ClassService from '@/api/service/MyClassService';
import {IClassInfo, IMyClassList} from '@/views/model/my-class.model';
// @ts-ignore
import WithRender from './MyClass.html';

@WithRender
@Component
export default class MyClass extends Vue {
    private myClass: IClassInfo[] = [
        {
            classThumb: require(''),
            className: '',
            classOwner: '',
            createdYear: 2019,
            classType: '',
            memberNum: 2122,
            isUpdated: true,
            updatedDiffTime: '',
            isBookmarked: 1,
        },
        {
            classThumb: require('@/assets/images/bg-icon.png'),
            className: '꿈꾸는 5학년 1반',
            classOwner: '파파야초등학교',
            createdYear: 2019,
            classType: '비공개클래스',
            memberNum: 2122,
            isUpdated: true,
            updatedDiffTime: '40분 전 업데이트',
            isBookmarked: 0,
        },
        {
            classThumb: require('@/assets/images/bg-icon.png'),
            className: '꿈꾸는 5학년 1반',
            classOwner: '파파야초등학교',
            createdYear: 2019,
            classType: '비공개클래스',
            memberNum: 2122,
            isUpdated: true,
            updatedDiffTime: '2시간 전 업데이트',
            isBookmarked: 1,
        },
        {
            classThumb: require('@/assets/images/bg-icon.png'),
            className: '꿈꾸는 5학년 1반',
            classOwner: '파파야초등학교',
            createdYear: 2019,
            classType: '비공개클래스',
            memberNum: 2122,
            isUpdated: true,
            updatedDiffTime: '2019.12.11 업데이트',
            isBookmarked: 0,
        },
        {
            classThumb: require('@/assets/images/bg-icon.png'),
            className: '꿈꾸는 5학년 1반',
            classOwner: '파파야초등학교',
            createdYear: 2019,
            classType: '비공개클래스',
            memberNum: 2122,
            isUpdated: false,
            updatedDiffTime: '1주일간 업데이트 없음',
            isBookmarked: 1,
        },
    ];

    private classItems: IMyClassList[] = [];

    public created() {
        this.getMyClass();
    }

    /**
     * 하트 버튼 토글
     *
     * @public
     */
    public bookmarkToggle(item: any): void {
        item.isBookmarked = item.isBookmarked === 0 ? 1 : 0;
    }

    /**
     * 내 클래스 정보 가져오기
     * @public
     */
    public getMyClass(): any {
        const myClassList = ClassService.getAllMyClass();

        // axios.all 로 처리해도 됨.
        Promise.all( [myClassList] )
            .then( (data: IMyClassList[] ) => {
                this.classItems = data;
            })
            .then(() => {
                //Promise.all 로 처리하면 리턴값이 배열. 즉 별도 매칭이 필요.
                this.classItems.map( ( item: any, idx: number ) => {
                    this.myClass[idx].className=item.myclass_list[idx].name;
                });
            });
    }
}
