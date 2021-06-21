import {Component, Vue} from 'vue-property-decorator';
import ImageSettingService from '@/views/service/profileImg/ImageSettingService';
import {IAttachFileModel} from '@/views/model/post.model';
import {Utils} from '@/utils/utils';

@Component
export default class UtilsMixins extends Vue {

  /**
   * 프로필 이미지 지정.
   * 만약 프로필 이미지가 지정이 안되어 있다면 내부적으로
   * 'image-a.jpg', 'image-b.jpg', 'image-c.jpg', 'image-d.jpg', 'image-e.jpg'
   * 5개 랜덤 이미지 설정.
   * @param imgUrl
   */
  public getProfileImg(imgUrl: string | null | undefined ): string{
    return ImageSettingService.getProfileImg( imgUrl );
  }

  /**
   * attachment 인자에서 이미지 파일만 추출
   * @param attachment
   */
  public attachFilePreviewInit(attachment: IAttachFileModel[]): IAttachFileModel[] {
    return attachment.filter((item: IAttachFileModel) => item.contentType !== 'image/png' && item.contentType !== 'image/jpg' && item.contentType !== 'image/jpeg' && item.contentType !== 'image/gif');
  }

  /**
   * attachment 인자에서 첨부 파일만 추출
   * @param attachment
   */
  public imgPreviewInit( attachment: IAttachFileModel[] ): IAttachFileModel[]{
    return attachment.filter((item: IAttachFileModel) => item.contentType === 'image/png' || item.contentType === 'image/jpg' || item.contentType === 'image/jpeg' || item.contentType === 'image/gif');
  }

  public txtAreaEleH( txtAreaEle: HTMLTextAreaElement, txt: string ) {
    // const scheduleDetailAreaTxt=this.$refs.scheduleDetailAreaTxt as HTMLInputElement;
    txtAreaEle.style.height = String( Utils.autoResizeTextArea(txt) + 'px');
  }

  /**
   * //input click event 발생시키기.
   * @param targetSelector
   * @private
   */
  public inputEventBind( targetSelector: string ) {
    //파일 input 에 클릭 이벤트 붙이기~
    const imgFileInput = document.querySelector(targetSelector) as HTMLInputElement;
    //input click event 발생시키기.
    imgFileInput.dispatchEvent(Utils.createMouseEvent('click'));
  }

}
