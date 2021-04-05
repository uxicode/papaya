import {Vue, Component} from 'vue-property-decorator';
import WithRender from './ClassEducationPage.html';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import sideMenu from '@/components/sideMenu/sideMenu.vue';


@WithRender
@Component({
    components:{
        Modal,
        Btn,
        sideMenu
    }
})
export default class ClassEducation extends Vue{
    /* Modal 오픈 상태값 */
    private isCreateClass: boolean = false;
    private isClassCurr: boolean = false;
}