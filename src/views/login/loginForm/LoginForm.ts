import { Vue, Component, Prop } from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import WithRender from './LoginForm.html';

const Auth = namespace('Auth');

@WithRender
@Component
export default  class LoginForm extends Vue{
  private userId: string = '';
  private userPw: string = '';

  @Auth.Action
  private login!: (data: any) => Promise<any>;

  get rPath():string{
    return (this.$route.query.rqPath) ? this.$route.query.rqPath as string : '/';
  }

  private validate():void{
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

  private findIdHandler():void{
    this.$emit('findIdStatusEvent');
  }
}
