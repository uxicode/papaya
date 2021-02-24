interface ITermsData {
  name: string;
  type: string;
  bodytext: string;
}

interface ICheckData{
  idx: number;
  tit: string;
  isActive: boolean;
  isChecked: boolean;
  desc: string[];
}

export { ITermsData, ICheckData};
