interface IAuthForm {
  radioValue: string;
  email: string;
  mobile: string;
}

interface IVerifiedForm extends IAuthForm {
  userId: string;
  verifiedCode: string;
}

interface IMessage {
  mobile: string;
  email: string;
  mobileReq: string;
  equal: string;
  notMobile: string;
  notEmail: string;
  warnNum: string;
  verify: string;
  error: string;
}

export {IAuthForm, IMessage, IVerifiedForm};
