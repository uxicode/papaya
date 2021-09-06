import {Vue, Component} from 'vue-property-decorator';
import EventBus from '@/store/EventBus';
import MyProfileMain from '@/views/mypage/myProfile/myProfileMain/MyProfileMain';
import ModifyMobile from '@/views/mypage/myProfile/modifyMobile/ModifyMobile';
import ModifyPassword from '@/views/mypage/myProfile/modifyPw/ModifyPassword';
import WithRender from './MyProfile.html';

@WithRender
@Component({
    components:{
        MyProfileMain,
        ModifyMobile,
        ModifyPassword,
    },
})
export default class MyProfile extends Vue {
    private currentPage: string = '';

    public created() {
        EventBus.$on('updateTitle', (pageKey: string) => {
            console.log(pageKey);
            this.currentPage = pageKey;
        });
    }

    private currentTitle(): string {
        let result;
        switch (this.currentPage) {
            case 'modifyMobile':
                result = 'MY프로필 > 모바일 번호 변경';
                break;
            case 'modifyPw':
                result = 'MY프로필 > 비밀번호 재설정';
                break;
            default:
                result = 'MY프로필';
                break;
        }
        return result;
    }
}