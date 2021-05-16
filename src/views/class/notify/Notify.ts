import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IAttachFileModel, IPostModel} from '@/views/model/post.model';
import MyClassService from '@/api/service/MyClassService';
import Modal from '@/components/modal/modal.vue';
import WithRender from './Notify.html';

const MyClass = namespace('MyClass');

@WithRender
@Component({
  components:{
    Modal
  }
})
export default class Notify extends Vue {


  @MyClass.Getter
  private classID!: string | number;

  private noticeListItems: IPostModel[] = [];
  private reservedItems: any[] = [];
  private reservedTotal: number=0;
  private isAddPopupOpen: boolean=false;

  get noticeListItemsModel() {
    return this.noticeListItems;
  }

  public created() {
    this.getList();
  }

  private getList() {
    MyClassService.getAllPostsByClassId( this.classID, { page_no: 1, count:10})
      .then( (data)=>{
        // console.log(data);
        this.noticeListItems=data.post_list;
      });
    MyClassService.getReservedPost( this.classID, {page_no:1, count:100})
      .then((data)=>{
        console.log(data);
        this.reservedTotal=data.total_count;
        this.reservedItems=data.post_list;
      });
  }

  private isOwner( ownerId: number, userId: number): boolean {
    return (ownerId === userId);
  }

  private imgFileDataSort( fileData: IAttachFileModel[] ) {
    return fileData.filter((item: IAttachFileModel) => item.contentType === 'image/png' || item.contentType === 'image/jpg');
  }

  private fileDataSort( fileData: IAttachFileModel[] ) {
    return fileData.filter( (item: IAttachFileModel) => item.contentType !== 'image/png' && item.contentType !== 'image/jpg');
  }

  private isVote(item: Date) {
    if (item === null) {
      return true;
    }
    const finishTime = new Date(item).getTime();
    const currentTime = new Date().getTime();

    return (finishTime > currentTime);
  }

  private onAddPost() {
    this.isAddPopupOpen=true;
  }
}
