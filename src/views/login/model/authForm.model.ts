interface IAuthFormData {
  radioValue: string;
  email: string;
  mobile: string;
}

interface IVerifiedFormData extends IAuthFormData {
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

export {IAuthFormData, IMessage, IVerifiedFormData};
