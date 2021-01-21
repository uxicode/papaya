import { Vue, Component, Prop } from 'vue-property-decorator';
import WithRender from './Login.html';
import './Login.scss';
import {namespace} from 'vuex-class';

const Auth = namespace('Auth');

@WithRender
@Component
export default class Login extends Vue {

  private userId: string = '';
  private userPw: string = '';
  private STATUS_LOGIN: string = 'status_login';
  private STATUS_FIND_ID: string = 'status_find_id';
  private STATUS_PWD_RESET: string = 'status_pwd_reset';
  private currentStatus: string = this.STATUS_LOGIN;

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
    console.log(this.currentStatus===this.STATUS_LOGIN)
    return this.currentStatus===this.STATUS_LOGIN;
 }

 get findStatus():boolean{
    return ( this.currentStatus === this.STATUS_FIND_ID ) || (this.currentStatus === this.STATUS_PWD_RESET );
 }

  private setAccountStatus( status:string ):void{
    this.currentStatus=status;
  }

}

 /* export default {
    name: 'Login',
    data () {
      return {
        formValid: true,
        pwChk: false,
        formModels: {
          userId: null,
          userPw: ''
        },
        rules: {
          required: value => !!value || '비밀번호를 입력해 주세요.',
          min: v => ( v.length >= 8 ) || '최소 8글자 이상 입력해 주세요.'
        }
      }
    },
    created () {
      this.rPath = this.$route.query.rqPath || '/';
      this.$vuetify.theme.dark = true;
    },
    methods: {
      ...mapActions([
        LOGIN
      ]),
      validate () {
        this.$refs.loginForm.validate();
        // console.log( this.formValid );
        if (!this.formValid) {
          return false;
        }

        this.LOGIN({
          uid: this.formModels.userId,
          password: this.formModels.userPw
        })
          .then(() => {
            // localStorage.setItem('token', res.access_token );
            // setAuthorization(res.access_token);
            //이미 action.js 에서 직접 api 호출하고 리턴된 값을 mutation.js(상태변이)로 전달시키고 있다.
            //따라서 이 구간에서 프라미스 반환값은 없고 성공된 후의 타이밍만 맞추어 실행시킬 함수 등을 선언하면 된다.
            //만약 데이터에 결과값에 대한 작업이 필요하다면 action.js 에서 작업해야 한다.
            this.$router.push(this.rPath);
            // eslint-disable-next-line handle-callback-err
          }).catch( (error) => {
            this.formValid = false;
          });
      }
    }
  };*/

