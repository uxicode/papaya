import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IUserMe} from '@/api/model/user.model';
import UserService from '@/api/service/UserService';
import EventBus from '@/store/EventBus';
import Btn from '@/components/button/Btn.vue';
import TxtField from '@/components/form/txtField.vue';
import WithRender from './ModifyPassword.html';

const Auth = namespace('Auth');

interface IPwd {
    oPwd: string;
    nPwd: string;
    rePwd: string;
}

@WithRender
@Component({
    components: {
        Btn,
        TxtField,
    }
})

export default class ModifyPassword extends Vue {
    private isPwConfirmed: boolean = false;
    private isModifiedPwd: boolean = false;

    //비밀번호 재설정 관련
    private pwdFormData: IPwd = {
        oPwd: '',
        nPwd: '',
        rePwd: '',
    };

    @Auth.Action
    private LOGIN_ACTION!: (data: any) => Promise<any>;

    @Auth.Getter
    private userInfo!: IUserMe;

    @Auth.Getter
    private resetPwVerifyInfo!: any;

    public required(value: string): boolean {
        // console.log( value, !!value);
        return !!value;
    }

    private pwdConfirm(): void {
        this.LOGIN_ACTION({
            uid: this.userInfo.user_id,
            password: this.pwdFormData.oPwd,
        }).then(() => {
            console.log('비밀번호 확인 완료');
            this.isPwConfirmed = !this.isPwConfirmed;
        }).catch((error: any) => {
            console.log(error);
            alert('비밀번호가 틀립니다. 다시 입력해주세요');
            this.pwdFormData.oPwd = '';
        });
    }

    private getPwdEqual(): boolean {
        return this.required(this.pwdFormData.nPwd) && this.required(this.pwdFormData.rePwd) &&
            this.pwdFormData.nPwd===this.pwdFormData.rePwd;
    }

    private pwdChangeSubmit(): void {
        if( this.getPwdEqual() ){
            UserService.pwdChange({
                userId: this.userInfo.user_id,
                old_pw: this.pwdFormData.oPwd,
                new_pw: this.pwdFormData.nPwd,
            }).then( () => {
                alert('비밀번호가 변경 되었습니다.');
                this.isModifiedPwd=true;
                this.gotoMyProfile();
            });
        } else {
            alert('비밀번호가 일치하지 않습니다.');
        }
    }

    private gotoMyProfile(): void {
        this.$router.push('/myProfile')
            .then(() => {
                EventBus.$emit('updateTitle', '');
            });
    }
}