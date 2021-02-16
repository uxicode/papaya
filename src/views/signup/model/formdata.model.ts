interface IFormData {
  name: string;
  id: string;
  pwd: string;
  rePwd: string;
  mobile: string;
  email: string;
  radioValue: string;
}

interface IFormAuthData extends IFormData {
  userMobile: string;
  mVerifiedCode: string;
  userEmail: string;
  eVerifiedCode: string;
}

interface IHints {
  idMin: string;
  warnId: string;
  pwMin: string;
  warnPw: string;
  mobile: string;
}

interface IMessage {
  name: string;
  id: string;
  pw: string;
  pwRe: string;
  equal: string;
  mobileReq: string;
  notMobile: string;
  warnNum: string;
  verify: string;
  email: string;
  notEmail: string;
  error: string;
}

export {IFormData, IFormAuthData, IHints, IMessage};
