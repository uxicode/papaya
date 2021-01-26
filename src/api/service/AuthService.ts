import {request, setAuthorization} from '@/api/service/axiosService';
import {AUTH_BASE_URL, USER_BASE_URL} from '@/api/base';

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

  public getUserIdByMobile(mobile: string): Promise<any> {
    return request('get', `${USER_BASE_URL}/bymobile/${mobile}`);
  }

  /**
   * 핸드폰 번호로 인증번호 전송
   * @param mobile
   */
  public getAuthMobileNum( mobile:string ):Promise<any>{
    return request('get', `${AUTH_BASE_URL}/sms/${ mobile }`);
  }

  /**
   * 메일 주소로 인증 번호 전송
   * @param email
   */
  public getAuthEmail( email:string ):Promise<any> {
    return request('get', `${AUTH_BASE_URL}/email/${email}`);
  }

  /**
   * 인증하기
   * @param verify
   */
  public getVerification( verify:{ key:string, num:string }):Promise<any> {
    return request('post', '/verifications', {
      verification_key: verify.key,
      auth_number: verify.num,
    });
  }
  public getUserId( mobile:string ):Promise<any>{
    return request( 'get', `/users/bymobile/${mobile}`);
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
