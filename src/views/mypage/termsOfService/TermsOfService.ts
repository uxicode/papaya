import {Vue, Component} from 'vue-property-decorator';
import Btn from '@/components/button/Btn.vue';
import WithRender from './TermsOfService.html';


@WithRender
@Component({
    components:{
        Btn
    },
})

export default class TermsOfService extends Vue {




}
