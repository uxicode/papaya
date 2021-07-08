import {ImageFileService} from '@/views/service/preview/ImageFileService';

class ImageFileServiceHelper extends ImageFileService{

  private courseIndex: number = 0;

  public courseIndexNumber(index: number) {
    this.courseIndex = index;
  }

}

export {ImageFileServiceHelper};

