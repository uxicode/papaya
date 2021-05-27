interface IFile{
  remove: ( idx: number )=> void;
  removeAll: ()=> void;
  reset: ()=> void;
  load: ( files: FileList, selector: string )=>void;
  save: ( formData: FormData )=>void;
  getItems: ()=> any[];
}
export { IFile };
