import {Utils} from '@/utils/utils';

class ImageSettingService implements IProfileImg{
  public getProfileImg(imgItems: string[], imgUrl: string | null | undefined ): string{
    console.log( imgUrl);
    let img: string= '';
    if( imgUrl === null || imgUrl === undefined){
      // console.log('1', imgUrl);
      img=imgItems[ Utils.getRandomNum(0, imgItems.length-1) ];
    }else {
      if (imgUrl.length < 2) {
        // console.log('2', imgUrl);
        img = imgItems[parseInt(imgUrl, 10) - 1];
      }else{
        // console.log('3', imgUrl);
        img=imgUrl;
      }
    }

    return ( img.indexOf('https:')===-1 )? require( `@/assets/images/${img}`) : img;
  }

}

export default new ImageSettingService();
