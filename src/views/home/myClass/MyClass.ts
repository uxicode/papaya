import {Vue, Component, Prop} from 'vue-property-decorator';
// @ts-ignore
import {IUser} from '@/api/model/user.model';
import WithRender from './MyClass.html';

interface IUser {
    fullname: string;
}

interface IClassInfo {
    classThumb: () => void;
    className: string;
    classOwner: string;
    createdYear: number;
    classType: string;
    memberNum: number;
    isUpdated: boolean;
    updatedDiffTime: string;
    isFavorite: boolean;
}

@WithRender
@Component
export default class MyClass extends Vue {
    private userData: IUser = {
        fullname: '배혜진',
    };

    private myClass: IClassInfo[] = [
        {
            classThumb: require('@/assets/images/bg-icon.png'),
            className: '꿈꾸는 5학년 1반',
            classOwner: '파파야초등학교',
            createdYear: 2019,
            classType: '비공개클래스',
            memberNum: 2122,
            isUpdated: true,
            updatedDiffTime: '1분 전 업데이트',
            isFavorite: true,
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
            isFavorite: true,
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
            isFavorite: true,
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
            isFavorite: false,
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
            isFavorite: false,
        },
    ];

    /**
     * 하트 버튼 토글
     * @public
     */
    public heartToggle(item: any): void {
        item.isFavorite = !item.isFavorite;
    }
}
