import {Vue, Component, Prop} from 'vue-property-decorator';
import MyProfile from '@/views/mypage/myProfile/MyProfile';
import WithRender from './MyPage.html';

@WithRender
@Component({
    components:{
        MyProfile,
    },
})
export default class MyPage extends Vue {

}