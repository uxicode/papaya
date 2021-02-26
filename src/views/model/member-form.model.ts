interface IMemberForm{
  email: string;
  mobile: string;
}
interface IAuthTypeForm extends IMemberForm{
  radioValue: string;
}

interface IVerifiedForm extends IAuthTypeForm {
  userId: string;
  verifiedCode: string;
}

interface ISignUpForm{
  user_id: string;
  user_password: string;
  fullname: string;
  mobile_no: string;
  email: string;
  agree_marketing: boolean;
  agree_email: boolean;
}

interface ISignUpVerifiedForm{
  name: string;
  id: string;
  pwd: string;
  rePwd: string;
  userMobile: string;
  mVerifiedCode: string;
  userEmail: string;
  eVerifiedCode: string;
}


export { IMemberForm, IAuthTypeForm, IVerifiedForm,  ISignUpForm, ISignUpVerifiedForm};
