import {IFile} from '@/views/service/preview/IFile';

class ImageFileService implements IFile{

  public imgFileItems: any[] = [];
  public imgURLFileItems: string[] = [];



  //start : IFile 에 있는 필수 선언 메서드 ================================================
  public getItems(): any[] {
    return this.imgFileItems;
  }

  public setImgURLItems( items: string[] ): void{
    this.imgURLFileItems=items;
  }

  public getImgURLItems(): string[] {
    return this.imgURLFileItems;
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
    this.imgURLFileItems = [];
    this.imgFileItems=[];
  }
  /**
   * 추가된 이미지 파일 제거하기
   * @param idx
   */
  public remove(idx: number): void {
    const blobURLs=this.imgURLFileItems.splice(idx, 1);
    this.removeBlobURL( blobURLs ); // blob url 제거
    this.imgFileItems.splice(idx, 1);
  }
  public reset() {
    this.removeAll();
  }
  /**
   *  이미지 파일이 저장된 배열을 전송할 formdata 에 값 대입.
   */
  public save( formData: FormData ): void {
    if( !this.imgFileItems.length ){ return; }
    // 아래  'files'  는  전송할 api 에 지정한 이름이기에 맞추어야 한다. 다른 이름으로 되어 있다면 변경해야 함.
    this.formDataAppendToFile( formData, this.imgFileItems, 'files');
  }
  //end : IFile 에 있는 필수 선언 메서드 ================================================

  /**
   * // blob url 폐기시키고 가비지 컬렉터 대상화시킴
   * - 확인하는 방법은 현재 이미지에 적용된 src 주소값을 복사해서 현재 브라우저에 주소를 붙여 실행해 보면 된다. 이미지가 보이면 url 이 폐기되지 않은 것이다.
   * @private
   */
  public removeBlobURL( items: string[] ) {
    items.forEach((item) => URL.revokeObjectURL(item));
  }
  /**
   * 이미지 파일 -> 배열에 지정 / 미리보기 link( blob link) 배열 생성~
   * @param data
   */
  private setImgFilePreviewSave(data: FileList ): void {

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < data.length; i++) {
      this.imgFileItems.push(data[i]);
      this.imgURLFileItems.push(URL.createObjectURL(data[i]));
    }
    // console.log(this.imgURLFileItems, data);
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

export {ImageFileService};
