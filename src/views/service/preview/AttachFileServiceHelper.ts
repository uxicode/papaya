import {AttachFileService} from '@/views/service/preview/AttachFileService';
import {IAttachFileModel} from '@/views/model/post.model';

class AttachFileServiceHelper extends AttachFileService {

  private courseIndex: number = 0;

  public courseIndexNumber(index: number) {
    this.courseIndex = index;
  }

  //start : IFile 에 있는 필수 선언 메서드 ================================================
  /**
   *  이미지 파일이 저장된 배열을 전송할 formdata 에 값 대입.
   */
  public savePreview(saveData: any, idx: number): void {
    if( !this.attachFileItems.length ){ return; }
    this.courseIndex = idx;

    // tslint:disable-next-line:prefer-for-of
    for(let i=0; i < this.attachFileItems.length; i++){
      saveData.push(this.attachFileItems[i]);
    }
  }

  public setAttachItems( items: IAttachFileModel[] ){
    this.attachFileItems=items.map(( item: IAttachFileModel, index: number)=>{
      return {
        file: item,
        index: this.courseIndex,
        id: index,
        url: item.location
      };
    });
  }

  /**
   * 코스 삭제되었을 때, 첨부파일 삭제 & index 수정
   * @param saveData
   * @param idx
   */
  public deleteImgFileItem(saveData: any, idx: number){
    while( saveData.findIndex((item: any)=>item.index === idx) > -1 ) {
      saveData.splice(saveData.findIndex((item: any)=>item.index === idx), 1);
    }

    saveData.filter((item: any)=> {
      if(item.index > idx){
        item.index = item.index -1;
      }
    });
    console.log(saveData);
  }

  public saveData(formData: FormData, targetData: any): void {
    if( !targetData.length ){ return; }

    //현재 추가된 파일, 이미 업로드되어 로드된 파일 두개를 분리해서
    // 현재 추가된 파일 ( file - Blob 타입 ) 만 추출해서 formdata 에 append 한다.
    const addFiles= targetData
        .filter((item: any) => item.file.name !== undefined)
        .map((item: any)=>item);

    // console.log(`addFilesList = `,addFiles);

    //전송할 파일이 없다면 여기서 종료.
    if( addFiles.length<0 ){ return; }

    // 아래  'files'  는  전송할 api 에 지정한 이름이기에 맞추어야 한다. 다른 이름으로 되어 있다면 변경해야 함.
    this.formDataAppendToFileHelper(formData, addFiles, 'files'  );
  }

  //formdata 에 append 하여 formdata ( 딕셔너리 목록 ) 추가하기.
  protected formDataAppendToFileHelper( formData: FormData, targetLists: any, appendName: string | string[] ) {
    targetLists.forEach(( item: any, index: number )=>{
      // console.log(item, item.name);
      // 아래  'files'  는  전송할 api 에 지정한 이름이기에 맞추어야 한다. 다른 이름으로 되어 있다면 변경해야 함.
      if( Array.isArray(appendName) ){
        formData.append( appendName[index], item.file, item.name );
      }else{
        formData.append(appendName, item.file, `${item.index+1}_${index}_${item.file.name}` );
      }
    });
  }


  //end : IFile 에 있는 필수 선언 메서드 ================================================
  //로드한 파일 배열에 저장
  protected setAttachFileSave(data: FileList ): void {
    // console.log(data);
    for (let i = 0; i < data.length; i++) {
      this.attachFileItems.push( {file:data[i], index:this.courseIndex, id:i } );
    }
  }
}

export {AttachFileServiceHelper};
