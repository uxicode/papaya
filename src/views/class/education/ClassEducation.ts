import {Vue, Component} from 'vue-property-decorator';
import WithRender from './ClassEducation.html';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import SideMenu from '@/components/sideMenu/sideMenu.vue';


@WithRender
@Component({
    components:{
        Modal,
        Btn,
        SideMenu
    }
})
export default class ClassEducation extends Vue {
    private activeNum: number = 4;

    /* Modal 오픈 상태값 */
    private isCreateClass: boolean = false;
    private isClassCurr: boolean = false;
    private isClassCurrDetail: boolean = false;

}