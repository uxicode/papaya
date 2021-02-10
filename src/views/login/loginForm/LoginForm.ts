import {Vue, Component, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import WithRender from './LoginForm.html';


const Auth = namespace('Auth');

@WithRender
@Component({
  components:{
    Modal,
    Btn
  }
})
export default class LoginForm extends Vue {
  private userId: string = '';
  private userPw: string = '';
  private isLoginFail: boolean=false;
  private errorMsg: string = '';

  @Auth.Action
  private LOGIN_ACTION!: (data: any) => Promise<any>;

  get rPath(): string {
    return (this.$route.query.rqPath) ? this.$route.query.rqPath as string : '/';
  }

  private validate(): void {
    this.LOGIN_ACTION({
      uid: this.userId,
      password: this.userPw,
    }).then((data: any) => {
      // console.log('this.rPath=', this.rPath);
      this.$router.push(this.rPath);

    }).catch((error) => {
      console.log(error.data.message, error.data.error.message);
      this.errorMsg=error.data.error.message;
      this.isLoginFail=true;
    });
  }

  private findIdHandler(): void {
    // this.$emit('findIdStatusEvent');
    this.$router.push('/login/findId').then((r) => {
      console.log('findId 로 이동 ');
    });
  }

  private resetPwHandler(): void {
    this.$router.push('/login/findId/resetPw').then((r) => {
      console.log('reset pw 로 이동 ');
    });
  }
}
