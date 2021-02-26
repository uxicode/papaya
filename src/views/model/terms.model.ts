interface ITermData {
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
  val: string;
}

export { ITermData, ICheckData};
