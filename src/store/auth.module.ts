import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import {IUser, IUserMe} from '@/api/model/user.model';
import AuthService from '@/api/service/AuthService';
import UserService from '@/api/service/UserService';
import {
  LOGIN,
  LOGOUT,
  GET_TOKEN,
  USER_ID, USER_EMAIL,
  VERIFY_BY_MOBILE,
  SIGN_UP,
  SIGN_UP_MOVE,
  SET_MY_INFO,
} from '@/store/mutation-auth-types';
import {
  LOGIN_ACTION,
  FIND_ID_BY_MOBILE,
  FIND_ID_BY_EMAIL,
  AUTH_BY_MOBILE,
  SIGN_UP_ACTION,
  SIGNIN_BY_TOKEN,
} from '@/store/action-auth-types';


@Module({
  namespaced: true,
})
export default class AuthModule extends VuexModule {
  public token?: string | null= null; //멤버 변수는 state 로 이용된다.
  public findId: string = '';
  public user: IUser[] =[];
  public me: IUserMe | null =null;
  public count: number = 0;
  public inputUserEmail: string = '';
  public signupName: string = '';
  public resetPwByVerifyInfo: object = {};

  get isAuth(): boolean {
    return !!this.token;
  }

  get findUserId(): string {
    return this.findId;
  }

  get findInputUserEmail(): string {
    return this.inputUserEmail;
  }

  get resetPwVerifyInfo(): object {
    return this.resetPwByVerifyInfo;
  }

  get userName(): string{
    return this.signupName;
  }

  get userInfo(): IUserMe | null{
    return this.me;
  }



  @Mutation
  public [USER_EMAIL](value: string): void {
    this.inputUserEmail = value;
  }

  @Mutation
  public [USER_ID](userId: string): void {
    this.findId = userId;
  }

  @Mutation
  public [LOGIN](userData: IUser[]): void {
    this.user = userData;
    // console.log('this.token=', JSON.stringify(this.user) );
    localStorage.setItem('user', JSON.stringify(this.user));
    // console.log( localStorage.getItem('user') );
    this.count++;
  }

  @Mutation
  public [SET_MY_INFO]( me: IUserMe ): void{
    this.me = me;
    localStorage.setItem('me', JSON.stringify(this.me));
  }

  @Mutation
  public [VERIFY_BY_MOBILE](payload: { userId: string, key: string, mobile: string }): void {
    this.resetPwByVerifyInfo = {
      userId: payload.userId,
      key: payload.key,
      mobile: payload.mobile,
    };
  }

  @Mutation
  public [GET_TOKEN](token: string | null): void {
    console.log('token=', this.token);
    if (token !== null) {
      this.token = token;
      AuthService.setAuthToken(this.token);
      localStorage.setItem('token', this.token);
    }
  }


  @Mutation
  public [LOGOUT](): void {
    this.token = null;
    delete localStorage.token;
    delete localStorage.user;
  }

  @Mutation
  public [SIGN_UP]( name: string ): void{
    this.signupName=name;
    localStorage.setItem('signupName', this.signupName );
  }

  @Mutation
  public [SIGN_UP_MOVE](): void{
    this.signupName= '';
    delete localStorage.signupName;
  }

  @Action({rawError: true})
  public [SIGNIN_BY_TOKEN]( token: string ){
    this.context.commit(GET_TOKEN, token);

    return UserService.getUserMe()
      .then( ( data: any )=>{
        console.log('UserMe=', data.user );
        this.context.commit(SET_MY_INFO, data.user );
        return Promise.resolve('signin status');
      });
  }

  @Action({rawError: true})
  public [LOGIN_ACTION](payload: { uid: string, password: string }): Promise<any> {
    console.log(payload);
    return AuthService.login(payload.uid, payload.password)
      .then((data: any) => {
        // console.log(data);
        /* jbc2119 로 접속 성공시~
        email: "jbc2119@gmail.com"
        fullname: "전봉철"
        id: 250
        mobile_no: "01031992443"
        schedule_color: 0
        user_id: "jbc2119"
        */
        // console.log(data.user, data.access_token);
        // mutation( type, payload, option ) 이렇게 매개변수가 지정되어 있다.z

        this.context.commit(GET_TOKEN, data.access_token );
        return UserService.getUserMe().then( (data: any)=>{
            this.context.commit(SET_MY_INFO, data.user);
            return Promise.resolve( data.user);
          });// 왜인지는 모르겠으나 여기서 promise 를 리턴해주어야 함.
      }).catch((error) => {
        return Promise.reject(error);
      });
  }

  @Action({rawError: true})
  public [FIND_ID_BY_MOBILE](mobile: string): Promise<any> {
    return UserService.getUserIdByMobile(mobile)
      .then((data: any) => {
        /*{
          "mobile_no": "01031992443",
          "user_id": "jbc2119",
          "message": "아이디 조회 성공."
        }*/
        // console.log('모바일번호로 아이디조회=', data );
        this.context.commit(USER_ID, data.user_id); //찾은 아이디 값을 store 에 기록
        return Promise.resolve(data);
      }).catch((error: any) => {
        return Promise.reject(error);
      });
  }

  @Action({rawError: true})
  public [FIND_ID_BY_EMAIL](email: string): Promise<any> {
    return UserService.getUserIdByEmail(email)
      .then((data: any) => {
        this.context.commit(USER_ID, data.user_id);
        this.context.commit(USER_EMAIL, email);
        return Promise.resolve(data);
      }).catch((error: any) => {
        return Promise.reject(error);
      });
  }

  //this.formData.userId, this.formData.mobile
  //getAuthByMobileNum
  @Action({rawError: true})
  public [AUTH_BY_MOBILE](payload: { userId: string, mobile: string }): Promise<any> {
    return AuthService.getAuthByMobileNum(payload.userId, payload.mobile)
      .then((data: any) => {
        console.log('핸폰번호와 아이디로 인증=', data);
        //{verification_key: "3091612168945547", message: "sms 로 인증번호 발송 성공"}
        this.context.commit(VERIFY_BY_MOBILE, {
          userId: payload.userId,
          mobile: payload.mobile,
          key: data.verification_key,
        });
        return Promise.resolve(data);
      }).catch((error: any) => {
        console.log('error', error);
        return Promise.reject(error);
      });
  }

  @Action( {rawError: true})
  public [SIGN_UP_ACTION]( payload: {
    user_id: string,
    user_password: string,
    fullname: string,
    mobile_no: string,
    email: string,
    agree_marketing: boolean,
    agree_email: boolean,
  }): Promise<any>{
    return UserService.signUp( payload )
      .then( (data: any)=>{
        console.log('payload.fullname=', payload.fullname, data.user.fullname );
        this.context.commit(SIGN_UP, payload.fullname );
        /*
        {
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9......"
        message: "회원가입 성공"
        refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9......"
        user:{
            agree_email: false
            agree_marketing: false
            createdAt: "2021-03-06 08:12:50"
            deletedYN: false
            email: ""
            fullname: "전봉철"
            lastloginAt: "2021-03-06 08:12:50"
            marketingAgreeAt: null
            mobile_no: "01031992443"
            nickname: null
            push_onoff: true
            push_token: null
            schedule_color: 0
            updatedAt: "2021-03-06 08:12:50"
            user_id: "jbc103"
             }
         }*/

        return Promise.resolve( data );
    }).catch( (error: any)=>{
      return Promise.reject(error);
    });

  }


}
