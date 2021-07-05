import {AttachFileService} from '@/views/service/preview/AttachFileService';
import {IAttachFileModel} from '@/views/model/post.model';

class AttachFileServiceHelper extends AttachFileService {
  public attachFilePreviewItems: any[] = [];
  public renameDataList: any[] = [];

  private courseIndex: number = 0;

  public courseIndexNumber(index: number) {
    this.courseIndex = index;
  }

  get getCourseIdx(): number{
    return this.courseIndex;
  }

  //start : IFile 에 있는 필수 선언 메서드 ================================================
  public getItems(): any[] {
    return this.attachFilePreviewItems.map( (item)=>item.file);
  }

  public setAttachItems( items: IAttachFileModel[] ){
    this.attachFilePreviewItems=items.map(( item: IAttachFileModel, index: number)=>{
      return {
        file: item,
        id: index,
        index: this.courseIndex,
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

    this.attachFileNaming();

    console.log(this.attachFilePreviewItems);
    console.log(this.renameDataList);
  }

  public remove(idx: number): void {
    this.attachFilePreviewItems.splice(idx, 1);

    console.log(this.attachFilePreviewItems);
  }

  public removeAll(): void {
    this.attachFilePreviewItems = [];
  }

  public reset(): void {
    this.removeAll();
  }

  public savePreview(attachFileData: any): void {
    if( !this.attachFilePreviewItems.length ){ return; }

    //현재 추가된 파일, 이미 업로드되어 로드된 파일 두개를 분리해서
    // 현재 추가된 파일 ( file - Blob 타입 ) 만 추출해서 formdata 에 append 한다.
    const checkAddFile= this.attachFilePreviewItems
        .filter((item) => item.file.name );

    //전송할 파일이 없다면 여기서 종료.
    if( checkAddFile.length<1 ){ return; }

    for(let i=0; i<this.attachFilePreviewItems.length; i++){
      attachFileData.push(this.renameDataList[i]);
    }

    console.log(attachFileData);
  }

  public attachFileNaming() {
    const targetLists = this.attachFilePreviewItems.map((item: any)=>item.file.name);
    const courseList = this.attachFilePreviewItems.map((item: any)=>item.index);

    targetLists.forEach((item: string, index: number) => {
      const renameData = new File( [item], `${courseList[index]+1}_${index}_${item}` );
      this.renameDataList.push(renameData);
    });
  }

  public saveData(formData: FormData, saveData: any): void {
    // 아래  'files'  는  전송할 api 에 지정한 이름이기에 맞추어야 한다. 다른 이름으로 되어 있다면 변경해야 함.
    this.formDataAppendToFile(formData, saveData, 'files' );
  }

  //formdata 에 append 하여 formdata ( 딕셔너리 목록 ) 추가하기.
  protected formDataAppendToFile( formData: FormData, targetLists: File[], appendName: string | string[] ) {
    targetLists.forEach(( item: File, index: number )=>{
      // console.log(item, item.name);
      // 아래  'files'  는  전송할 api 에 지정한 이름이기에 맞추어야 한다. 다른 이름으로 되어 있다면 변경해야 함.
      if( Array.isArray(appendName) ){
        formData.append( appendName[index], item, item.name );
      }else{
        formData.append(appendName, item, item.name );
      }
    });
  }

  //end : IFile 에 있는 필수 선언 메서드 ================================================
  //로드한 파일 배열에 저장
  protected setAttachFileSave(data: FileList ): void {
    // console.log(data);
    for (let i = 0; i < data.length; i++) {
      // console.log(data,  item, Utils.getFileType(item) );
      // this.attachFileItems.push(file);
      this.attachFilePreviewItems.push( {file:data[i], index:this.courseIndex, id:i } );
    }
  }
}

export {AttachFileServiceHelper};
