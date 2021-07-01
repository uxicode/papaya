import {IFile} from '@/views/service/preview/IFile';
import {Utils} from '@/utils/utils';
import {IAttachFileModel} from '@/views/model/post.model';

class AttachFileService implements IFile{

  private attachFileItems: any[] = [];

  //start : IFile 에 있는 필수 선언 메서드 ================================================
  public getItems(): any[] {
    return this.attachFileItems.map( (item)=>item.file);
  }

  public getFileItems(): any[] {
    return this.attachFileItems;
  }

  public getItemById(idx: number): any {
    return this.attachFileItems[idx];
  }

  public setAttachItems( items: IAttachFileModel[] ){
    this.attachFileItems=items.map(( item: IAttachFileModel, index: number)=>{
      return {
        file: item,
        id: index,
        url: item.location
      };
    });
  }

  public load(files: FileList, selector: string): void {
    //전달되는 파일없을시 여기서 종료.
    if( !files.length ){ return; }

    this.setAttachFileSave(files);
    //file type input
    const attachFileInput =document.querySelector(selector) as HTMLInputElement;
    attachFileInput.value = '';
  }

  public remove(idx: number): void {
    this.attachFileItems.splice(idx, 1);
  }

  public removeAll(): void {
    this.attachFileItems = [];
  }

  public reset(): void {
    this.removeAll();
  }

  public save(formData: FormData): void {
    if( !this.attachFileItems.length ){ return; }

    //현재 추가된 파일, 이미 업로드되어 로드된 파일 두개를 분리해서
    // 현재 추가된 파일 ( file - Blob 타입 ) 만 추출해서 formdata 에 append 한다.
    const addFiles= this.attachFileItems
      .filter((item) => item.file.name )
      .map((item)=>item.file);

    //전송할 파일이 없다면 여기서 종료.
    if( addFiles.length<1 ){ return; }

    // 아래  'files'  는  전송할 api 에 지정한 이름이기에 맞추어야 한다. 다른 이름으로 되어 있다면 변경해야 함.
    this.formDataAppendToFile(formData, addFiles, 'files'  );
  }

  //formdata 에 append 하여 formdata ( 딕셔너리 목록 ) 추가하기.
  protected formDataAppendToFile( formData: FormData, targetLists: File[], appendName: string | string[] ) {
    targetLists.forEach(( item: File, index: number )=>{
      // console.log(item, item.name);
      // 아래  'files'  는  전송할 api 에 지정한 이름이기에 맞추어야 한다. 다른 이름으로 되어 있다면 변경해야 함.
      if( Array.isArray(appendName) ){
        formData.append( appendName[index], item, item.name );
      }else{
        formData.append(appendName, item, `${index}_${item.name}` );
      }
    });
  }

  //end : IFile 에 있는 필수 선언 메서드 ================================================
  //로드한 파일 배열에 저장
  private setAttachFileSave(data: FileList ): void {
    // console.log(data);
     for (let i = 0; i < data.length; i++) {
      // console.log(data,  item, Utils.getFileType(item) );
      // this.attachFileItems.push(file);
      this.attachFileItems.push( {file:data[i], id:i } );
    }
  }

}

export {AttachFileService};
