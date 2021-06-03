import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {getAllPromise} from '@/views/model/types';
import MyClassService from '@/api/service/MyClassService';
import {NoticeScheduleModel} from '@/views/model/schedule.model';
import {IAttachFileModel, IPostModel} from '@/views/model/post.model';
import {PostService} from '@/api/service/PostService';
import {ScheduleService} from '@/api/service/ScheduleService';
import ListInImgPreview from '@/components/preview/ListInImgPreview.vue';
import ListInFilePreview from '@/components/preview/ListInFilePreview.vue';
import ListInVotePreview from '@/components/preview/ListInVotePreview.vue';
import ListInLinkPreview from '@/components/preview/ListInLinkPreview.vue';
import WithRender from './MyClassListDetailView.html';


const MyClass = namespace('MyClass');

@WithRender
@Component({
  components:{
    ListInImgPreview,
    ListInFilePreview,
    ListInVotePreview,
    ListInLinkPreview
  }
})
export default class MyClassListDetailView extends Vue{

  private pagingCount: number=1;

  private numOfPage: number=10;
  private mChk: boolean=false;
  private isNoticeChk: boolean=false;
  private isPageLoaded: boolean=false;
  private noticeSchedule: NoticeScheduleModel[] = [];
  private  commentsTotalItems: any[]=[];


  @MyClass.Getter
  private classID!: string | number;

  private allData: any[] = [];

  get noticeScheduleModel(): any[]{
    return this.noticeSchedule;
  }

  get allDataModel(): any[]{
    return this.allData;
  }

  get commentsTotalItemsModel() {
    return this.commentsTotalItems;
  }

  //myClassHeader 에서 select 로 가입클래스를 선택하면 classId 및 클래스 홈의 데이를 변경하는  MYCLASS_HOME() action 함수를  ㅌ
  // 호출 하지만 정작 컨텐츠가 해당 사항을 반영하지 못하기에 ( classId 가 바뀌는 것을 header 와 sidemenu 만 인지된다. ) 아래처럼 watch 를 써서 classId 를 체크 하게 한다.
  //
  @Watch('classID')
  public changeClassId( val: string, old: string) {
    if (val !== old) {
      this.getClassList().then(
        ()=>{
          this.isPageLoaded=true;
        }
      );
    }

  }

  public created(): void{
    this.getClassList().then(
      ()=>{
        this.isPageLoaded=true;
      }
    );
  }

  public getMax<T>( items: T[] ): T{
    return items.reduce( (a: T, b: T )=>{
      return a>b? a : b;
    });
  }

  //{total_count: 0, post_listcount: 0, post_list: Array(0)}
  //{ total: 0, class_schedule_list: Array(0)}
  // {page_item_count: 5, total: 0, curriculum_list: [], item_count: 0}
  private async getClassList(){
    await getAllPromise([
      ScheduleService.getAllScheduleByClassId( this.classID, { page_no: 1, count:10} ),
      MyClassService.getAllCurriculumByClassId( this.classID, { page_no: 1, count:10} ),
      PostService.getAllPostsByClassId( this.classID, { page_no: 1, count:10}),
    ]).then( ( data: any )=>{

      const max=this.getMax<number>([data[0].class_schedule_list.length, data[1].curriculum_list.length, data[2].post_list.length] );
      // console.log(max);
      console.log(data[0].class_schedule_list );


      this.noticeSchedule=data[0].class_schedule_list.filter((item: any) =>item.type===1 );

      const allData: any[] = [];
      for (let i = 0; i < max; i++) {
        allData[i]=[];
        for (let j = 0; j < data.length; j++) {
          if (j=== 0) {
            if (data[j].class_schedule_list[i]!== undefined) {
              allData[i].push({list: data[j].class_schedule_list[i], name:'schedule'});
            }
          }else if (j=== 1) {
            if (data[j].curriculum_list[i]!== undefined) {
              allData[i].push({ list: data[j].curriculum_list[i], name:'curriculum'});
            }
          }else if (j=== 2) {
            if (data[j].post_list[i] !== undefined) {
              allData[i].push({ list: data[j].post_list[i], name:'post'});
            }
          }
        }
      }

      this.allData = [...allData];
      console.log(this.allData);
      // const allData=[ ...data[0].post_list,  ...data[1].class_schedule_list, ...data[2].curriculum_list];
    }).catch((error)=>{
      console.log('class more info error', error );
    });
  }


  private isOwner( ownerId: number, userId: number): boolean {
    return (ownerId === userId);
  }

  private onNoticeMenuClick() {
    this.isNoticeChk = !this.isNoticeChk;
  }

  private getNoticeMainTitle(): string {
    return ( this.noticeSchedule[this.noticeSchedule.length-1])? this.noticeSchedule[this.noticeSchedule.length-1].title : '';
  }




}
