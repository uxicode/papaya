import {Component, Vue} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import SideMenu from '@/components/sideMenu/sideMenu.vue';
import TxtField from '@/components/form/txtField.vue';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import WithRender from './CurriculumPage.html';

const MyClass = namespace('MyClass');

@WithRender
@Component({
    components:{
        SideMenu,
        TxtField,
        Modal,
        Btn
    }
})
export default class CurriculumPage extends Vue {
    @MyClass.Getter
    private classID!: string | number;

    private activeMenuNum: number=4;

    get activeMenuNumModel(): number {
        return this.activeMenuNum;
    }

    private created(){
        //화면 새로고침시에
        if (performance.navigation.type === 1) {
            this.activeMenuNum=4;

            console.log(this.activeMenuNum);
        }
    }

    private update(idx: number): void{
        this.activeMenuNum=idx;
        // console.log(this.activeMenuNum);
    }

}
