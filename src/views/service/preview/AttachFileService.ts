import {IFile} from '@/views/service/preview/IFile';
import {Utils} from '@/utils/utils';

class AttachFileService implements IFile{

  private attachFileItems: any[] = [];

  //start : IFile 에 있는 필수 선언 메서드 ================================================
  public getItems(): any[] {
    return this.attachFileItems;
  }

  public setItems(items: any[]){
    this.attachFileItems=items;
  }

  public load(files: FileList, selector: string): void {
    //전달되는 파일없을시 여기서 종료.
    if( !files.length ){ return; }

    this.setAttachFileSave(files);
    //file type input
    const attachFileInput =document.querySelector('#attachFileInput') as HTMLInputElement;
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
    // 아래  'files'  는  전송할 api 에 지정한 이름이기에 맞추어야 한다. 다른 이름으로 되어 있다면 변경해야 함.
    this.formDataAppendToFile(formData, this.attachFileItems, 'files'  );
  }
  //end : IFile 에 있는 필수 선언 메서드 ================================================
  //로드한 파일 배열에 저장
  private setAttachFileSave(data: FileList ): void {
    // console.log(data);
    for (const file of data) {
      // console.log(data,  item, Utils.getFileType(item) );
      this.attachFileItems.push(file);
    }
  }

  //formdata 에 append 하여 formdata ( 딕셔너리 목록 ) 추가하기.
  private formDataAppendToFile( formData: FormData, targetLists: File[], appendName: string | string[] ) {
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
}

export {AttachFileService};
