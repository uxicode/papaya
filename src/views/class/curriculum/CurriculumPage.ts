import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import WithRender from './CurriculumPage.html';


const MyClass = namespace('MyClass');


@WithRender
@Component
export default class CurriculumPage extends Vue {
    @MyClass.Getter
    private classID!: number;
}






