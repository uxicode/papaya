interface IFile{
  save: ( formData: FormData )=>void;
  remove: ( idx: number )=> void;
  removeAll: ()=> void;
  reset: ()=> void;
  load: ( files: FileList, selector: string )=>void;
  getItems: ()=> any[];
}
export { IFile };
