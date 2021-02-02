interface IFormData{
  radioValue:string;
  email:string;
  mobile:string;
}

interface IFormAuthData extends IFormData{
  userId:string;
}

interface IMessage{
  mobile:string;
  email:string;
  mobileReq:string;
  equal:string;
  notMobile:string;
  notEmail:string;
  warnNum:string;
  verify:string;
  error:string;
}

export {IFormData, IMessage, IFormAuthData};
