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
    private myPageList: any = [
        {
            title: 'myProfile',
            isActive: false,
        },
        {
            title: 'bookmark',
            isActive: false
        },
    ];

    public created() {
        this.myPageList[0].isActive = true;
    }

    private gotoMyProfile(): void {
        this.$router.push('/myProfile')
            .then(() => {
                console.log('MY프로필로 이동');
                this.$emit('updatePage', '');
                this.myPageList[1].isActive = false;
                this.myPageList[0].isActive = true;
            });
    }

    private gotoBookmark(): void {
        this.$router.push('/bookmark')
            .then(() => {
                console.log('보관함으로 이동');
                this.myPageList[0].isActive = false;
                this.myPageList[1].isActive = true;
            });
    }
}