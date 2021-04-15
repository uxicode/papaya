import {Utils} from '@/utils/utils';

class ImageSettingService{
  public getProfileImg(imgUrl: string | null | undefined ): string{

    const imgItems = [
      'image-a.jpg',
      'image-b.jpg',
      'image-c.jpg',
      'image-d.jpg',
      'image-e.jpg'
    ];

    let img: string= '';
    if( imgUrl === null || imgUrl === undefined){
      // console.log('null 이거나 undefined', imgUrl);
      img=imgItems[ Utils.getRandomNum(0, imgItems.length-1) ];
    }else {
      if( isNaN(Number(imgUrl) )){
        if( imgUrl.indexOf('https:')!==-1 ){
          img=imgUrl;
          //console.log('https 주소값 가진 url =', imgUrl);
        }else if( imgUrl.length<2 ) {
          // console.log('랜덤 숫자', imgUrl);
          img = imgItems[parseInt(imgUrl, 10) - 1];
        }else{
          // console.log('이상한 문자', imgUrl);
          img=imgItems[ Utils.getRandomNum(0, imgItems.length-1) ];
        }
      }else{
        // console.log('이상한 문자', imgUrl);
        img=imgItems[ Utils.getRandomNum(0, imgItems.length-1) ];
      }
    }
    return ( img.indexOf('https:')!==-1 )? img : require( `@/assets/images/${img}`);
  }

}

export default new ImageSettingService();
