import {IFile} from '@/views/service/preview/IFile';
import {PostService} from '@/api/service/PostService';
import {IAttachFileModel} from '@/views/model/post.model';

class ImageFileService implements IFile{

  public imgFileItems: any[] = [];
  // public imgURLFileItems: string[] = [];

  //start : IFile 에 있는 필수 선언 메서드 ================================================
  public getItems(): string[] {
    //this.imgFileItems;
    return this.imgFileItems.map((item) => item.url);
  }

  public getFileItems(): any[] {
    return this.imgFileItems;
  }

  public getItemById(idx: number): any {
    return this.imgFileItems[idx];
  }

  public setAttachItems( items: IAttachFileModel[] ): void{
    // this.imgURLFileItems=items;
    this.imgFileItems=items.map(( item: IAttachFileModel, index: number)=>{
      return {
        file: item,
        id: index,
        url: item.location
      };
   });
  }

  /*public getImgURLItems(): string[] {
    return this.imgURLFileItems;
  }*/
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
    this.imgFileItems=[];
  }
  /**
   * 추가된 이미지 파일 제거하기
   * @param idx
   */
  public remove(idx: number): void {

    const removeItem=this.imgFileItems.splice(idx, 1);
    if (removeItem[0].url.indexOf('blob') !== -1) {
      this.removeBlobURL( removeItem[0].url ); // blob url 제거
    }
  }

  public reset() {
    this.removeAll();
  }

  /**
   * 신규로 add 된 이미지가 있는지 체크
   */
  public getAddFiles(){
   return this.imgFileItems
     .filter((item) => item.file.name !== undefined)
     .map((item)=>item.file);
  }
  /**
   *  이미지 파일이 저장된 배열을 전송할 formdata 에 값 대입.
   */
  public save( formData: FormData ): void {
    if( !this.imgFileItems.length ){ return; }

    const addFiles= this.getAddFiles();
    console.log(`??`, addFiles);
    //신규 전송할 파일이 없다면 여기서 종료.
    if( addFiles.length<0 ){ return; }

    // 아래  'files'  는  전송할 api 에 지정한 이름이기에 맞추어야 한다. 다른 이름으로 되어 있다면 변경해야 함.
    this.formDataAppendToFile( formData,  addFiles, 'files');
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

  //formdata 에 append 하여 formdata ( 딕셔너리 목록 ) 추가하기.
  protected formDataAppendToFile( formData: FormData, targetLists: File[], appendName: string | string[] ) {
    targetLists.forEach(( item: File, index: number )=>{
      // console.log(item, item.name);
      // 아래  'files'  는  전송할 api 에 지정한 이름이기에 맞추어야 한다. 다른 이름으로 되어 있다면 변경해야 함.
      if( Array.isArray(appendName) ){
        formData.append( appendName[index], item, item.name );
      }else{
        formData.append(appendName, item, `${index}_${item.name}` );
        console.log(item);
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
      this.imgFileItems.push( {file:data[i], id:i, url: URL.createObjectURL(data[i])} );
      // this.imgURLFileItems.push( URL.createObjectURL(data[i]) );
    }
    // console.log(this.imgURLFileItems, data);
  }


}

export {ImageFileService};

