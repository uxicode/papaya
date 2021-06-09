import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import CurriculumListView from '@/views/class/curriculum/CurriculumListView';
import WithRender from './CurriculumPage.html';

const MyClass = namespace('MyClass');

@WithRender
@Component({
    components:{
        CurriculumListView
    }
})
export default class CurriculumPage extends Vue {
    @MyClass.Getter
    private classID!: number;
}






