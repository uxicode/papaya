import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import {IUser} from '@/api/model/user.model';
import AuthService from '@/api/service/AuthService';
import UserService from '@/api/service/UserService';
import {
    LOGIN,
    LOGOUT,
    GET_TOKEN,
    USER_ID, USER_EMAIL,
    VERIFY_BY_MOBILE,
} from '@/store/mutation-auth-types';
import {
    LOGIN_ACTION,
    FIND_ID_BY_MOBILE,
    FIND_ID_BY_EMAIL,
    AUTH_BY_MOBILE,
} from '@/store/action-auth-types';


@Module({
    namespaced: true,
})
export default class AuthModule extends VuexModule{
    private token: any = ''; //멤버 변수는 state 로 이용된다.
    private findId: string = '';
    private user:object= {};
    private count: number=0;
    private inputUserEmail: string = '';
    private resetPwByVerifyInfo: object = {};

    get isAuth():boolean{
        return !!this.token;
    }

    get tokenStatus():string | null{
        return this.token;
    }

    get findUserId():string{
        return this.findId;
    }

    get findInputUserEmail():string{
        return this.inputUserEmail;
    }

    get resetPwVerifyInfo():object{
        return this.resetPwByVerifyInfo;
    }

    @Mutation
    public [USER_EMAIL]( value:string ):void{
        this.inputUserEmail=value;
    }

    @Mutation
    public [USER_ID]( userId:string ):void{
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
    public [VERIFY_BY_MOBILE]( payload:{userId:string, key:string, mobile:string} ):void{
        this.resetPwByVerifyInfo={
          userId:payload.userId,
          key:payload.key,
          mobile:payload.mobile,
        };
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

    @Action({rawError:true})
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

    @Action({rawError:true})
    public [FIND_ID_BY_MOBILE](mobile:string ):Promise<any>{
        return UserService.getUserIdByMobile( mobile )
          .then((data:any)=>{
              /*{
                "mobile_no": "01031992443",
                "user_id": "jbc2119",
                "message": "아이디 조회 성공."
              }*/
              // console.log('모바일번호로 아이디조회=', data );
              this.context.commit( USER_ID, data.user_id  ); //찾은 아이디 값을 store 에 기록
              return Promise.resolve(data);
          }).catch((error:any)=>{
              return Promise.reject(error);
          });
    }

    @Action({rawError:true})
    public [FIND_ID_BY_EMAIL](email:string):Promise<any>{
        return UserService.getUserIdByEmail(email)
          .then((data:any)=>{
              this.context.commit( USER_ID, data.user_id );
              this.context.commit( USER_EMAIL, email );
              return Promise.resolve(data);
          }).catch((error:any)=>{
              return Promise.reject(error);
          });
    }

    //this.formData.userId, this.formData.mobile
    //getAuthByMobileNum
    @Action({rawError: true})
    public [AUTH_BY_MOBILE](payload: { userId:string, mobile:string } ): Promise<any> {
        return UserService.getAuthByMobileNum(payload.userId, payload.mobile )
          .then( (data:any) => {
              console.log('핸폰번호와 아이디로 인증=', data );
              //{verification_key: "3091612168945547", message: "sms 로 인증번호 발송 성공"}
              this.context.commit(VERIFY_BY_MOBILE, {
                  userId:payload.userId,
                  mobile:payload.mobile,
                  key:data.verification_key,
              });
              return Promise.resolve(data);
          }).catch((error:any)=>{
              console.log('error', error );
              return Promise.reject(error);
        });
    }



}
