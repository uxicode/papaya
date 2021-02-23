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

interface ISignUpForm extends IAuthTypeForm{
  name: string;
  id: string;
  pwd: string;
  rePwd: string;
}

interface ISignUpVerifiedForm extends ISignUpForm {
  userMobile: string;
  mVerifiedCode: string;
  userEmail: string;
  eVerifiedCode: string;
}


export { IMemberForm, IAuthTypeForm, IVerifiedForm,  ISignUpForm, ISignUpVerifiedForm};
