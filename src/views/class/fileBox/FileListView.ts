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
    private postContent: any = {};
    private postOwner: any = {};

    get content() {
      return this.postContent;
    }

    get attachments() {
      return this.allData;
    }

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
          console.log(data[2].curriculum_list);

          const postData = data[0].post_list.filter((item: any) => item.attachment.length !== 0)
              .map((item: any) => item.attachment).flat();
          postData.forEach((item: any) => item.post_type = 0);

          const scheduleData = data[1].class_schedule_list.filter((item: any) => item.attachment.length !== 0)
              .map((item: any) => item.attachment).flat();
          scheduleData.forEach((item: any) => item.post_type = 1);

          const courseListData = data[2].curriculum_list.filter((item: any) => item.course_list.length !== 0)
              .map((item: any) => item.course_list).flat().filter((item: any) => item.attachment.length !== 0);
          const curriculumData = courseListData.map((item: any) => item.attachment).flat();
          const curriculumIdList = courseListData.map((item: any) => item.curriculum_id);
          curriculumData.forEach((item: any) => item.post_type = 2);
          curriculumData.forEach((item: any, idx: number) => item.curriculum_id = curriculumIdList[idx]);
          console.log(curriculumData);

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

    /**
     * 파일이 첨부된 글로 이동 (팝업)
     * @param postType
     * @param mimetype
     * @param parentId
     * @private
     */
  private openParentContentPopup(postType: number, mimetype: string, parentId: number): void {
    this.mimeType = mimetype;
    switch (postType) {
      case 0:
        MyClassService.getPostsById(this.classID, parentId)
          .then((data) => {
            console.log(data);
            this.postContent = data.post;
            this.postOwner = data.post.owner;
          }).catch((error: any) => {
          console.log(error);
        });
        break;

      case 1:
        MyClassService.getScheduleById(this.classID, parentId)
          .then((data) => {
            console.log(data);
            this.postContent = data.schedule;
            this.postOwner = data.schedule.owner;
          });
        break;

      // case 2:
      //   MyClassService.getEduCurrList(this.classID, 0)
      //     .then((data) => {
      //       console.log(data);
      //       this.postContent = data.curriculum;
      //     });
      //   break;

      default:
        break;
    }

    this.isParentPopup = true;
  }

  /**
   * 멤버 등급에 따른 아이콘 클래스 바인딩
   * @param level
   * @private
   */
  private memberLevelIcon = (level: number): string => {
    switch (level) {
      case 1:
        return 'manager';
      case 2:
        return 'staff';
      default:
        return 'member';
    }
  }
}
