import {Vue, Component} from 'vue-property-decorator';
import {IFormData, IMessage} from '@/views/signup/model/formdata.model';
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
    private formData: IFormData = {
        name: '',
        id: '',
        pwd: '',
        rePwd: '',
        mobile: '',
        email: '',
        radioValue: '',
    };
}
