import {Vue, Component} from 'vue-property-decorator';
import {ISignUpForm} from '@/views/model/member-form.model';
import TxtField from '@/components/form/txtField.vue';
import Btn from '@/components/button/Btn.vue';
import WithRender from './SignUpForm.html';

@WithRender
@Component({
    components: {
        TxtField,
        Btn,
    },
})
export default class SignUpForm extends Vue {
    private formData: ISignUpForm = {
        name: '',
        id: '',
        pwd: '',
        rePwd: '',
        mobile: '',
        email: '',
        radioValue: '',
    };
}
