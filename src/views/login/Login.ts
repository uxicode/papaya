import { Vue, Component } from 'vue-property-decorator';
import WithRender from './Login.html';
import './Login.scss';
import {namespace} from 'vuex-class';

const Auth = namespace('Auth');

interface IFormData{
  radioValue:string;
  email:string;
  mobile:string;
}

@WithRender
@Component
export default class Login extends Vue {

  private userId: string = '';
  private userPw: string = '';
  private STATUS_LOGIN: string = 'status_login';
  private STATUS_FIND_ID: string = 'status_find_id';
  private STATUS_PWD_RESET: string = 'status_pwd_reset';
  private currentStatus: string = this.STATUS_LOGIN;

  //아이디 찾기 관련
  private formData:IFormData = {
    radioValue:'mobile',
    email:'',
    mobile:'',
  };

  @Auth.Getter
  private isAuth!:boolean;

  @Auth.Action
  private login!: (data: any) => Promise<any>;

  get rPath():string{
    return (this.$route.query.rqPath) ? this.$route.query.rqPath as string : '/';
  }

  public getTxtMin( v: string ): boolean | string {
    return ( v.length >= 8 ) || '최소 8글자 이상 입력해 주세요.';
  }
  public getRequired( val: string ): boolean | string {
    return !!val || '비밀번호를 입력해 주세요.';
  }

  private created() {
    console.log(this.isAuth);
  }
  private validate() {
    this.login({
      uid:this.userId,
      password:this.userPw,
    }).then( ( data:any ) => {
      // console.log('this.rPath=', this.rPath);
      this.$router.push(this.rPath);
    }).catch( ( error ) => {
      console.log(error);
    });
  }

 get loginStatus():boolean{
    console.log(this.currentStatus===this.STATUS_LOGIN);
    return this.currentStatus===this.STATUS_LOGIN;
 }

 get findStatus():boolean{
    return ( this.currentStatus === this.STATUS_FIND_ID ) || (this.currentStatus === this.STATUS_PWD_RESET );
 }

  private setAccountStatus( status:string ):void{
    this.currentStatus=status;
  }

  get userMobileState() {
    const userMobile=/^\d{3}\d{3,4}\d{4}$/;
    return userMobile.test(this.formData.mobile );
  }

}

