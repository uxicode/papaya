import {Vue, Component} from 'vue-property-decorator';
import WithRender from './classEducation.4.5.5.html';
import Modal from '@/components/modal/modal.vue';
import sideMenu from '@/components/sideMenu/sideMenu.vue';


@WithRender
@Component({
    components:{
        Modal,
        sideMenu,
    }
})
export default class ClassEducation extends Vue{
    private isMoreMenu: boolean = false;
    private eduDetail: boolean = false;

    private postMoreMenuItems: string[]=[
        '일정 수정',
        '일정 보관',
        '일정 삭제'
    ];

    private moreMenuToggle(): void {
        this.isMoreMenu = !this.isMoreMenu;
    };





}
