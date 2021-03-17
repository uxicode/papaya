import {Vue, Component, Prop} from 'vue-property-decorator';
import MyProfile from '@/views/mypage/myProfile/MyProfile';
import Bookmark from '@/views/mypage/bookmark/Bookmark';
import WithRender from './MyPage.html';

@WithRender
@Component({
    components:{
        MyProfile,
        Bookmark,
    },
})

export default class MyPage extends Vue {
    private isActive: boolean = false;

    private gotoMyProfile(): void{
        this.$router.push('/myProfile');
        this.$emit('updatePage', '');
    }

    private gotoBookmark(): void{
        this.$router.push('/bookmark');
    }
}