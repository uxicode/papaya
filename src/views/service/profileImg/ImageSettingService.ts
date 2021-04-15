import {Utils} from '@/utils/utils';

class ImageSettingService{
  public getProfileImg(imgUrl: string | null | undefined ): string{
    console.log( imgUrl);

    const imgItems = [
      'image-a.jpg',
      'image-b.jpg',
      'image-c.jpg',
      'image-d.jpg',
      'image-e.jpg'
    ];

    let img: string= '';
    if( imgUrl === null || imgUrl === undefined){
      // console.log('1', imgUrl);
      img=imgItems[ Utils.getRandomNum(0, imgItems.length-1) ];
    }else {
      if (imgUrl.length < 6 ) {
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
