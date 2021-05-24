import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {getAllPromise} from '@/views/model/types';
import MyClassService from '@/api/service/MyClassService';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import WithRender from './FileListView.html';
import {PostService} from '@/api/service/PostService';
import {ScheduleService} from '@/api/service/ScheduleService';

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
    private classID!: number;

    private allData: any[] = [];
    private totalFileSize: number = 0;
    private isParentPopup: boolean = false;
    private mimeType: string = '';
    private postContent: any = {};
    private postOwner: any = {};
    private postType: number = 0;
    private fileCount: number = 0;

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
          PostService.getAllPostsByClassId(this.classID, {page_no: 1, count: 100}),
          ScheduleService.getAllScheduleByClassId(this.classID, {page_no: 1, count: 100}),
          MyClassService.getAllCurriculumByClassId(this.classID, {page_no: 1, count: 100}),
        ]).then((data: any) => {
          // console.log(data[0].post_list);
          // console.log(data[1].class_schedule_list);
          // console.log(data[2].curriculum_list);

          const postData = data[0].post_list.filter((item: any) => item.attachment.length !== 0)
            .map((item: any) => item.attachment).flat();
          postData.map((item: any) => item.post_type = 0);

          const scheduleData = data[1].class_schedule_list.filter((item: any) => item.attachment.length !== 0)
            .map((item: any) => item.attachment).flat();
          scheduleData.map((item: any) => item.post_type = 1);

          /* 교육과정의 경우 첨부파일이 course_list 안에 들어있으며,
          첨부파일 내용에 curriculum_id 가 없어서 팝업 오픈시 통신하기 위해 키를 추가해준다. */
          const courseListData = data[2].curriculum_list.filter((item: any) => item.course_list.length !== 0)
            .map((item: any) => item.course_list).flat().filter((item: any) => item.attachment.length !== 0);
          const curriculumData = courseListData.map((item: any) => item.attachment).flat();
          const curriculumIdList = courseListData.map((item: any) => item.curriculum_id);
          curriculumData.map((item: any) => item.post_type = 2);
          curriculumData.map((item: any, idx: number) => item.curriculum_id = curriculumIdList[idx]);
          // console.log(curriculumData);

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
   * 해당 파일이 첨부된 글로 이동 (팝업 내용 주입)
   * @param postType
   * @param mimetype
   * @param parentId
   * @param curriculumId
   * @private
   */
  private openParentContentPopup(postType: number, mimetype: string, parentId: number, curriculumId?: number): void {
    this.mimeType = mimetype;
    this.postType = postType;
    switch (postType) {
      case 0:
        PostService.getPosts(this.classID, parentId)
          .then((data: any) => {
            // console.log(data);
            this.postContent = data.post;
            this.postOwner = data.post.owner;
            this.fileCount = data.post.attachment.length;
          });
        break;

      case 1:
        ScheduleService.getScheduleById(this.classID, parentId)
          .then((data) => {
            // console.log(data);
            this.postContent = data.schedule;
            this.postOwner = data.schedule.owner;
            this.fileCount = data.schedule.attachment.length;
          });
        break;

      case 2:
        if (curriculumId != null) {
          MyClassService.getEduCurrList(this.classID, curriculumId)
            .then((data) => {
              // console.log(data);
              this.postContent = data.curriculum;
              this.postOwner = data.curriculum.owner;
              // 교육과정은 course 별로 attachment 가 개별적으로 있기 때문에 parent_id (course_id) 가 일치하는 첨부파일의 길이를 받는다.
              this.fileCount = Number(data.curriculum.course_list.filter((item: any) => item.id === parentId)
                  .map((item: any) => item.attachment.length));
            });
        }
        break;

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
