import {Vue, Component, Prop} from 'vue-property-decorator';
import Btn from '@/components/button/Btn.vue';
import TxtField from '@/components/form/txtField.vue';
import WithRender from './ModifyPassword.html';

@WithRender
@Component({
    components: {
        Btn,
        TxtField
    }
})

export default class ModifyPassword extends Vue {
    private isPwConfirmed: boolean = false;

    private gotoMyProfile(): void {
        this.$router.push('/myProfile');
        this.$emit('updatePage', '');
    }
}