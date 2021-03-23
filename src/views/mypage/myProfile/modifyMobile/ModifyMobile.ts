import {Vue, Component, Prop} from 'vue-property-decorator';
import Btn from '@/components/button/Btn.vue';
import TxtField from '@/components/form/txtField.vue';
import WithRender from './ModifyMobile.html';

@WithRender
@Component({
    components:{
        Btn,
        TxtField,
    },
})

export default class ModifyMobile extends Vue {
    private gotoMyProfile(): void {
        this.$router.push('/myProfile')
            .then(() => {
                this.$emit('updatePage', '');
            });
    }
}