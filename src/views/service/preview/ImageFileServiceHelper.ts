import {ImageFileService} from '@/views/service/preview/ImageFileService';

class ImageFileServiceHelper extends ImageFileService{

  private courseIndex: number = 0;

  public courseIndexNumber(index: number) {
    this.courseIndex = index;
  }

  /**
   *  이미지 파일이 저장된 배열을 전송할 formdata 에 값 대입.
   */
  public savePreview( saveData: any, idx: number ): void {
    if (!this.imgFileItems.length) {return;}
    this.courseIndex = idx;

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.imgFileItems.length; i++) {
      saveData.push(this.imgFileItems[i]);
    }
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

  public saveData( formData: FormData, targetData: any ): void {
    if( !targetData.length ){ return; }

    const addFiles = targetData
        .filter((item: any) => item.file.name !== undefined)
        .map((item: any)=>item);

    // console.log(`addFilesList = `,addFiles);

    //신규 전송할 파일이 없다면 여기서 종료.
    if( addFiles.length<0 ){ return; }

    // 아래  'files'  는  전송할 api 에 지정한 이름이기에 맞추어야 한다. 다른 이름으로 되어 있다면 변경해야 함.
    this.formDataAppendToFileHelper( formData,  addFiles, 'files');
  }

  //formdata 에 append 하여 formdata ( 딕셔너리 목록 ) 추가하기.
  protected formDataAppendToFileHelper( formData: FormData, targetLists: any, appendName: string | string[] ) {
    targetLists.forEach(( item: any, index: number )=>{
      // console.log(item, item.name);
      // 아래  'files'  는  전송할 api 에 지정한 이름이기에 맞추어야 한다. 다른 이름으로 되어 있다면 변경해야 함.
      if( Array.isArray(appendName) ){
        formData.append( appendName[index], item.file, item.file.name );
      }else{
        formData.append(appendName, item.file, `${item.index+1}_${index}_${item.file.name}` );
      }
    });
  }

  /**
   * 이미지 파일 -> 배열에 지정 / 미리보기 link( blob link) 배열 생성~
   * @param data
   */
  protected setImgFilePreviewSave(data: FileList ): void {

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < data.length; i++) {
      this.imgFileItems.push( {file:data[i], index:this.courseIndex, id:i, url: URL.createObjectURL(data[i])} );
      // this.imgURLFileItems.push( URL.createObjectURL(data[i]) );
    }
    // console.log(this.imgURLFileItems, data);
  }


}

export {ImageFileServiceHelper};

