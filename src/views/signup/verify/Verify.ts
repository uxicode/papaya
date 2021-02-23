import {Vue, Component, Prop} from 'vue-property-decorator';
import WithRender from './Verify.html';
import VerifyComplete from '@/views/signup/verify/verifyComplete/VerifyComplete';

@WithRender
@Component({
    components:{
        Complete: VerifyComplete,
    },
})
export default class Verify extends Vue {

}
