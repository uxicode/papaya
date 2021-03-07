
interface IMsg{
  mobile: string;
  email: string;
}

interface IWarnAuthMsg extends IMsg{
  mobileReq: string;
  equal: string;
  notMobile: string;
  notEmail: string;
  warnNum: string;
  verify: string;
  error: string;
}

interface IFindIdWarnMsg extends IWarnAuthMsg{
  mobile: string;
}

/*interface ISignUpWarnMsg extends IWarnAuthMsg{
  name: string;
  id: string;
  pw: string;
  pwRe: string;
}

interface IHints {
  idMin: string;
  warnId: string;
  pwMin: string;
  warnPw: string;
  mobile: string;
}*/

interface ISignupModalMsg{
  status: string;
  title: string;
  desc: string | string[];
}
export {IWarnAuthMsg, IFindIdWarnMsg, ISignupModalMsg};
