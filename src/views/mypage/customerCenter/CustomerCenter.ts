import {Vue, Component} from 'vue-property-decorator';
import Btn from '@/components/button/Btn.vue';
import WithRender from './CustomerCenter.html';


@WithRender
@Component({
    components:{
        Btn
    },
})

export default class CustomerCenter extends Vue {




}
