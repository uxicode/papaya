import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {getAllPromise} from '@/views/model/types';
import MyClassService from '@/api/service/MyClassService';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import WithRender from './FileListView.html';

const MyClass = namespace('MyClass');

@WithRender
@Component({
    components:{
        Modal,
        Btn
    }
})
export default class FileBox extends Vue {
    @MyClass.Getter
    private classID!: string | number;

    private allData: any[] = [];
    private totalFileSize: number = 0;
    private isParentPopup: boolean = false;
    private mimeType: string = '';

    public created() {
        this.getAllClassAttachmentData();
    }

  /**
   * 알림, 일정, 교육과정에 있는 모든 파일의 데이터를 가져온다.
   * @private
   */
  private getAllClassAttachmentData(): void {
        getAllPromise([
          MyClassService.getAllPostsByClassId(this.classID, {page_no: 1, count: 100}),
          MyClassService.getAllScheduleByClassId(this.classID, {page_no: 1, count: 100}),
          MyClassService.getAllCurriculumByClassId(this.classID, {page_no: 1, count: 100}),
        ]).then((data: any) => {
          // console.log(data[0].post_list);
          // console.log(data[1].class_schedule_list);
          // console.log(data[2].curriculum_list);

          const postData = data[0].post_list.filter((item: any) => item.attachment.length !== 0)
            .map((item: any) => item.attachment).flat();
          const scheduleData = data[1].class_schedule_list.filter((item: any) => item.attachment.length !== 0)
            .map((item: any) => item.attachment).flat();
          const curriculumData = data[2].curriculum_list.reduce(
            (item: any) => item.course_list.filter(() => item.attachment.length !== 0))
            .map((item: any) => item.attachment).flat();
          this.allData = [...postData, ...scheduleData, ...curriculumData];
          console.log(this.allData);

          this.totalFileSize = this.allData.map((item) => item.size).reduce((acc, cur) => acc + cur);
        });
  }

  /**
   * 파일 크기를 MB 단위로 표현 (소숫점이하 첫번째 자리까지)
   * 1MB 이하는 KB 단위로
   * @param size
   */
  private getFileSize = (size: number): string => {
    const mb = 1024 * 1024;
    const kb = 1024;
    if (size > mb) {
      return `${Math.round((size / mb) * 10) / 10} MB`;
    } else {
      return `${Math.round((size / kb) * 10) / 10} KB`;
    }
  }

  /**
   * 파일 형식에 따른 아이콘 클래스 바인딩
   * @param mimetype
   */
  private getMimeType = (mimetype: string): string => {
    if (mimetype.includes('pdf')) {
      return 'pdf-file';
    } else if (mimetype.includes('jpg') || mimetype.includes('jpeg')) {
      return 'jpg-file';
    } else {
      return 'unknown-file';
    }
  }

  /**
   * 파일 새 탭에서 열기
   * @param location
   */
  private openFileByNewTab = (location: string): void => {
    window.open(location);
  }

  /**
   * 파일 다운로드
   * @param location
   * @private
   */
  private downloadFile = (location: string): void => {
    const link = document.createElement('a');
    link.href = location;
    link.click();
    link.remove();
  }

  private openParentContentPopup(mimetype: string, parentId: number): void {
    this.mimeType = mimetype;
    MyClassService.getPostsById(this.classID, parentId)
      .then((data: any) => {
        console.log(data);
      }).catch((error: any) => {
        console.log(error);
    });
    this.isParentPopup = true;
  }

}
