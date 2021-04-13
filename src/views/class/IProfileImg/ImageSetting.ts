import {Utils} from '@/utils/utils';

class ImageSetting implements IProfileImg{
  public getProfileImg(imgItems: string[], imgUrl: string | null | undefined ): string{

    // console.log(imgItems, imgUrl);
    let img: string= '';
    if( imgUrl === null || imgUrl === undefined){
      img=imgItems[ Utils.getRandomNum(0, imgItems.length) ];
    }else if( !isNaN( parseInt(imgUrl, 10) ) ){
      img=imgItems[ parseInt(imgUrl, 10) ];
    }else{
      img=imgUrl;
    }

    return ( imgUrl !== null && imgUrl !== undefined )? img : require( `@/assets/images/${img}` );
  }

}

export default new ImageSetting();
