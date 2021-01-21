import {request, setAuthorization} from '@/api/service/axiosService';
import {AUTH_BASE_URL} from '@/api/base';

class AuthService{

  public login(uid:string, password:string):Promise<any> {
    return request('post', `${AUTH_BASE_URL}/login`, {
      user_id: uid,
      user_password: password,
    });
  }

  public setAuthToken(token:string):void {
    setAuthorization(token);
  }

  public getAuthMobileNum( mobile:string ):Promise<any>{
    return request('get', `${AUTH_BASE_URL}/sms/${ mobile }`);
  }

  public getAuthEmail( email:string ):Promise<any> {
    return request('get', `${AUTH_BASE_URL}/email/${email}`);
  }

  public getVerification( verify:{ key:string, num:number }):Promise<any> {
    return request('post', '/verifications', {
      verification_key: verify.key,
      auth_number: verify.num,
    });
  }

}
/* getAuthMobileNum( mobile ){
    return request('get', `${AUTH_BASE_URL}/sms/${ mobile }`);
},
getAuthEmail (email) {
    return request('get', `${AUTH_BASE_URL}/email/${email}`);
},
getVerification ( {key, num}) {
    return request('post', '/verifications', {
        verification_key: key,
        auth_number: num
    })
},
getUserId( mobile ){
    return request( 'get', `/users/bymobile/${mobile}`);
}*/

export default new AuthService();
