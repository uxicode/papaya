import MyProfileMain from '@/views/mypage/myProfile/myProfileMain/MyProfileMain';
import ModifyMobile from '@/views/mypage/myProfile/modifyMobile/ModifyMobile';
import ModifyPassword from '@/views/mypage/myProfile/modifyPw/ModifyPassword';
import {Vue, Component, Prop} from 'vue-property-decorator';
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

    public updated() {
        window.onpopstate = () => {
            this.updateTitle(this.currentPage);
        };
    }

    private updateTitle(page: string ) {
        this.currentPage = page;
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