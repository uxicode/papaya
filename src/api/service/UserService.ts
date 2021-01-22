import {request} from '@/api/service/axiosService';
import {USER_BASE_URL} from '@/api/base';

class UserService {

  public getUserURLById(id:string):string {
    return `${USER_BASE_URL}/${id}`;
  }
  public getIDCheck(id:string):Promise<any> {
    return request('get', `${this.getUserURLById(id)}/check`);
  }

  public signUp( info:{
    user_id:string,
    user_password:string,
    fullname:string,
    mobile_no:string,
    email:string,
    agree_marketing:boolean,
    agree_email:boolean,
  }):Promise<any>{
    /*{
      "user_id": "testuser1",
      "user_password": "12341234",
      "fullname": "testuser1",
      "mobile_no": "01012341111",
      "email": "dev@inition.kr",
      "agree_marketing": false,
      "agree_email": true
    }*/
    return request('post', `${USER_BASE_URL}`, info );
  }

  public getUsers(offset:number, limit:number):Promise<any> {
    return request('get', USER_BASE_URL, {offset, limit});
  }

  public getFindUser(id:string):Promise<any>{
    return request('get', this.getUserURLById(id));
  }

  public setUserInfo(id:string, data:any ):Promise<any> {
    return request('put', this.getUserURLById(id), data);
  }

  public deleteUser(id:string):Promise<any> {
    return request('delete', this.getUserURLById(id), { user_id: id });
  }

}


export default new UserService();
