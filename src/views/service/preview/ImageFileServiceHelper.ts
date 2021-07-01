
import {ImageFileService} from '@/views/service/preview/ImageFileService';

class ImageFileServiceHelper extends ImageFileService{
  public imgFIlePreviewItems: any[] = [];

  private courseIndex: number = 0;

  public courseIndexNumber(index: number) {
    this.courseIndex = index;
  }

  get getCourseIdx(): number{
    return this.courseIndex;
  }

  //start : IFile 에 있는 필수 선언 메서드 ================================================
  public getItems(): string[] {
    return this.imgFIlePreviewItems.map((item) => item.url);
  }

  //모델에 이미지 파일 추가
  public load( files: FileList, selector: string ): void{
    if( !files.length ){ return; }

    this.setImgFilePreviewSave(files);

    //file type input
    const imgFileInput =document.querySelector(selector) as HTMLInputElement;
    imgFileInput.value = '';
  }

  /**
   * 모두 지우기
   */
  public removeAll(): void {
    // this.imgURLFileItems = [];
    this.imgFIlePreviewItems=[];

  }
  /**
   * 추가된 이미지 파일 제거하기
   * @param idx
   */
  public remove(idx: number): void {
    const removeItem=this.imgFIlePreviewItems.splice(idx, 1);
    if (removeItem[0].url.indexOf('blob') !== -1) {
      this.removeBlobURL( removeItem[0].url ); // blob url 제거
    }
  }

  public reset() {
    this.removeAll();
  }

  /**
   *  이미지 파일이 저장된 배열을 전송할 formdata 에 값 대입.
   */
  public savePreview( imgAttachData: any ): void {
    if( !this.imgFIlePreviewItems.length ){ return; }

    const checkAddFile= this.imgFIlePreviewItems
        .filter((item) => item.file.name !== undefined);

    //전송할 파일이 없다면 여기서 종료.
    if( checkAddFile.length<1 ){ return; }

    for (let i = 0; i<this.imgFIlePreviewItems.length; i++){
      imgAttachData.push(this.imgFIlePreviewItems[i]);
    }

  }

  //end : IFile 에 있는 필수 선언 메서드 ================================================

  /**
   * // blob url 폐기시키고 가비지 컬렉터 대상화시킴
   * - 확인하는 방법은 현재 이미지에 적용된 src 주소값을 복사해서 현재 브라우저에 주소를 붙여 실행해 보면 된다. 이미지가 보이면 url 이 폐기되지 않은 것이다.
   * @private
   */
  public removeBlobURL( target: string | string[] ) {
    if( Array.isArray(target) ){
      target.forEach((item) => URL.revokeObjectURL(item) );
    }else{
      URL.revokeObjectURL( target);
    }
  }

  public saveData( formData: FormData, saveData: any ): void {
    // 아래  'files'  는  전송할 api 에 지정한 이름이기에 맞추어야 한다. 다른 이름으로 되어 있다면 변경해야 함.
    this.formDataAppendToFile( formData, saveData, 'files');
  }

  //formdata 에 append 하여 formdata ( 딕셔너리 목록 ) 추가하기.
  protected formDataAppendToFile( formData: FormData, saveDataList: any, appendName: string | string[] ) {

    const targetLists = saveDataList.map((item: any) => item.file);
    const courseIdx = saveDataList.map((item: any) => item.index);

    targetLists.forEach(( item: File, index: number )=>{
      // console.log(item, item.name);
      // 아래  'files'  는  전송할 api 에 지정한 이름이기에 맞추어야 한다. 다른 이름으로 되어 있다면 변경해야 함.
      if( Array.isArray(appendName) ){
        formData.append( appendName[index], item, item.name );
      }else{
        formData.append(appendName, item, `${courseIdx[index]+1}_${index}_${item.name}` );
      }
    });
  }

  /**
   * 이미지 파일 -> 배열에 지정 / 미리보기 link( blob link) 배열 생성~
   * @param data
   */
  protected setImgFilePreviewSave(data: FileList ): void {
    for (let i = 0; i < data.length; i++) {
      this.imgFIlePreviewItems.push( {file:data[i], id:i, index: this.courseIndex, url: URL.createObjectURL(data[i])} );
      // this.imgURLFileItems.push( URL.createObjectURL(data[i]) );
    }
    // console.log(this.imgURLFileItems, data);
  }


}

export {ImageFileServiceHelper};

