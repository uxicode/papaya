import {Vue, Component} from 'vue-property-decorator';
import WithRender from './EnrollOpenClass.html';
import Modal from '@/components/modal/modal.vue';
import SideMenu from '@/components/sideMenu/sideMenu.vue';
import Btn from '@/components/button/Btn.vue';

@WithRender
@Component({
    components:{
        SideMenu,
        Modal,
        Btn
    }
})
export default class EnrollOpenClass extends Vue {

}