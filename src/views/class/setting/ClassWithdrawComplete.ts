import {Vue, Component, Prop} from 'vue-property-decorator';
import WithRender from './ClassWithdrawComplete.html';

@WithRender
@Component

export default class ClassWithdrawComplete extends Vue {
    private goHome(): void {
        this.$router.push('./')
            .then();
    }
}