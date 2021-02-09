import {Vue, Component, Prop} from 'vue-property-decorator';
import WithRender from './Verify.html';
import Complete from '@/views/signup/verify/complete/Complete';

@WithRender
@Component({
    components:{
        Complete,
    },
})
export default class Verify extends Vue {

}
