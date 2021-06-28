import {ImageFileService} from '@/views/service/preview/ImageFileService';

class ImageFileServiceHelper extends ImageFileService {
  private courseIndex: number = 0;

  get getCourseIdx(): number{
    return this.courseIndex;
  }

  public courseIndexNumber(index: number) {
    this.courseIndex = index;
  }

  //formdata 에 append 하여 formdata ( 딕셔너리 목록 ) 추가하기.
  protected formDataAppendToFile( formData: FormData, targetLists: File[], appendName: string | string[] ) {
    targetLists.forEach(( item: File, index: number )=>{
      // console.log(item, item.name);
      // 아래  'files'  는  전송할 api 에 지정한 이름이기에 맞추어야 한다. 다른 이름으로 되어 있다면 변경해야 함.

      if( Array.isArray(appendName) ){
        formData.append( appendName[index], item, item.name );
      }else{
        formData.append(appendName, item, `${this.courseIndex+1}_${index}_${item.name}` );
      }
    });
  }
}

export {ImageFileServiceHelper};

