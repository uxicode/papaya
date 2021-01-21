interface IUser{
  email:string;
  fullname:string;
  id: number;
  mobile_no: string;
  schedule_color: number;
  user_id: string;
}
interface IAuth extends IUser{
  access_token:string;
}
export { IUser, IAuth };
