import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import {LOGIN, LOGOUT, GET_TOKEN} from '@/store/mutation-auth-types';
import {LOGIN_ACTION} from '@/store/action-auth-types';
import {IUser} from '@/api/model/user.model';
import AuthService from '@/api/service/AuthService';

@Module({
    namespaced: true,
})
export default class AuthModule extends VuexModule{
    private token: any = ''; //멤버 변수는 state 로 이용된다.
    private findId: string = '';
    private user:object= {};
    private count: number=0;

    get isAuth():boolean{
        return !!this.token;
    }

    get tokenStatus():string | null{
        return this.token;
    }

    get findUserId():string{
        return this.findId;
    }

    @Mutation
    public setUserId( userId:string ):void{
        this.findId=userId;
    }

    @Mutation
    public [LOGIN]( userData:IUser ):void{
        this.user={
            email:userData.email,
            fullname:userData.fullname,
            id:userData.id,
            mobile_no:userData.mobile_no,
            schedule_color:userData.schedule_color,
            user_id:userData.user_id,
        } as IUser;
        // console.log('this.token=', JSON.stringify(this.user) );
        localStorage.setItem('user', JSON.stringify(this.user)  );
        // console.log( localStorage.getItem('user') );
        this.count++;
    }

    @Mutation
    public [GET_TOKEN]( token:string | null ):void{
        this.token=token;
        if ( this.token === null) {return;}
        // AuthService.setAuthToken(this.token);
        localStorage.setItem('token', this.token);
    }

    @Mutation
    public [LOGOUT]():void{
        this.token = null;
        delete localStorage.token;
        delete localStorage.user;
    }

    @Action({commit: LOGIN, rawError:true})
    public [LOGIN_ACTION]( payload:{ uid:string, password:string } ):Promise<any>{
        console.log(payload);
        return AuthService.login(payload.uid, payload.password)
          .then((data: any) => {
              console.log(data);
              /* jbc2119 로 접속 성공시~
              email: "jbc2119@gmail.com"
              fullname: "전봉철"
              id: 250
              mobile_no: "01031992443"
              schedule_color: 0
              user_id: "jbc2119"
              */
              // console.log( data.user, data.access_token  )
              // mutation( type, payload, option ) 이렇게 매개변수가 지정되어 있다.
              this.context.commit(LOGIN, data.user);
              this.context.commit(GET_TOKEN, data.access_token);
              return Promise.resolve(data); // 왜인지는 모르겠으나 여기서 promise 를 리턴해주어야 함.
          }).catch((error) => {
              return Promise.reject(error);
          });
    }
}
