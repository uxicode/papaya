import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IClassInfo} from '@/views/model/my-class.model';
import WithRender from './ClassWithdrawComplete.html';

const MyClass = namespace('MyClass');

@WithRender
@Component
export default class ClassWithdrawComplete extends Vue {
    @MyClass.Getter
    private myClassHomeModel!: IClassInfo;

    private goHome(): void {
        this.$router.push('../')
            .then();
    }
}