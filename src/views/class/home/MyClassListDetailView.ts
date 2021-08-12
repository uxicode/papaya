import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {getAllPromise, getMax} from '@/types/types';
import MyClassService from '@/api/service/MyClassService';
import {NoticeScheduleModel} from '@/views/model/schedule.model';
import {IAttachFileModel, IPostModel} from '@/views/model/post.model';
import {PostService} from '@/api/service/PostService';
import {ScheduleService} from '@/api/service/ScheduleService';
import ListInImgPreview from '@/components/preview/ListInImgPreview.vue';
import ListInFilePreview from '@/components/preview/ListInFilePreview.vue';
import ListInVotePreview from '@/components/preview/ListInVotePreview.vue';
import ListInLinkPreview from '@/components/preview/ListInLinkPreview.vue';
import ConfirmPopup from '@/components/modal/confirmPopup.vue';
import NoticePopup from '@/components/modal/noticePopup.vue';
import ScheduleDetailPopup from '@/views/class/schedule/ScheduleDetailPopup';
import NotifyDetailPopup from '@/views/class/notification/NotifyDetailPopup';
import {ICurriculumDetailList} from '@/views/model/my-class.model';
import CurriculumDetailPopup from '@/views/class/curriculum/CurriculumDetailPopup';
import WithRender from './MyClassListDetailView.html';



const MyClass = namespace('MyClass');
const Schedule = namespace('Schedule');
const Post = namespace('Post');

@WithRender
@Component({
  components:{
    ListInImgPreview,
    ListInFilePreview,
    ListInVotePreview,
    ListInLinkPreview,
    ScheduleDetailPopup,
    ConfirmPopup,
    NoticePopup,
    CurriculumDetailPopup,
    NotifyDetailPopup
  }
})
export default class MyClassListDetailView extends Vue{

  private pagingCount: number=1;

  private numOfPage: number=10;
  private mChk: boolean=false;
  private isNoticeChk: boolean=false;
  private isPageLoaded: boolean=false;
  private memberStatus: object | null=null;
  private noticeSchedule: NoticeScheduleModel[] = [];
  private  commentsTotalItems: any[]=[];

  private isOpenDetailSch: boolean= false;
  private isOpenDetailCurriculum: boolean=false;
  private isOpenDetailNotification: boolean=false;

  private deleteScheduleId: number=-1;

  //start : 공통 팝업 변수 ================================================
  private isConfirmPopupOpen: boolean = false;
  private isNoticePopupOpen: boolean = false;
  private noticeTitle: string = '';
  private confirmTitle: string = '';
  private noticeDesc: string = '';
  private confirmDesc: string = '';
  //end : 공통 팝업 변수 ================================================

  @Schedule.Action
  private DELETE_SCHEDULE_ACTION!: (payload: { classId: string | number, scheduleId: number } ) => Promise<unknown>;

  @Schedule.Action
  private GET_SCHEDULE_DETAIL_ACTION!: (payload: { classId: number, scheduleId: number })=>Promise<any>;

  @Schedule.Action
  private GET_SCHEDULE_COMMENTS_ACTION!: ( scheduleId: number ) => Promise<any>;

  @MyClass.Action
  private GET_CURRICULUM_DETAIL_ACTION!: ( payload: { classId: number, curriculumId: number }) =>Promise<any>;

  @Post.Action
  private GET_POST_DETAIL_ACTION!: ( payload: { classId: number, postId: number }) =>Promise<any>;

  @Post.Action
  private GET_POST_COMMENTS_ACTION!: ( postId: number)=>Promise<any>;

  @MyClass.Getter
  private classID!: string | number;

  @Schedule.Getter
  private schEditId!: number;

  @MyClass.Getter
  private curriculumDetailItem!: ICurriculumDetailList;

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

  get isMember(): boolean {
    return ( this.memberStatus !== null );
  }

  get updateNoticeTitle(): string {
    return this.noticeTitle;
  }

  get updateNoticeDesc(): string {
    return this.noticeDesc;
  }

  get updateConfirmTitle(): string {
    return this.confirmTitle;
  }

  get updateConfirmDesc(): string {
    return this.confirmDesc;
  }

  get courseDetailData(): any {
    return this.curriculumDetailItem.course_list;
  }

  //myClassHeader 에서 select 로 가입클래스를 선택하면 classId 및 클래스 홈의 데이를 변경하는  MYCLASS_HOME() action 함수를  ㅌ
  // 호출 하지만 정작 컨텐츠가 해당 사항을 반영하지 못하기에 ( classId 가 바뀌는 것을 header 와 sidemenu 만 인지된다. ) 아래처럼 watch 를 써서 classId 를 체크 하게 한다.
  //
  @Watch('classID')
  public changeClassId( val: string, old: string) {
    if (val !== old) {
      // console.log('changeClassId', val, old);
      this.getClassList().then(
        ()=>{
          this.isPageLoaded=true;
        }
      );
    }
  }

  public created(): void{
    // console.log(this.$route.params.classId, this.$route.query.classIdx, this.classID );
    this.getClassList().then(
      ()=>{
        this.isPageLoaded=true;
      }
    );
  }

  /*public getMax<T>( items: T[] ): T{
    return items.reduce( (a: T, b: T )=>{
      return a>b? a : b;
    });
  }*/

  //{total_count: 0, post_listcount: 0, post_list: Array(0)}
  //{ total: 0, class_schedule_list: Array(0)}
  // {page_item_count: 5, total: 0, curriculum_list: [], item_count: 0}
  private async getClassList(){

    const isMember= await MyClassService.getMyInfoInThisClass(Number( this.classID ) );

    this.memberStatus=isMember.result;

    // console.log('isMember=',  this.memberStatus );

    if (isMember.result) {

      //paging 처리 필요~
      const scheduleItems = await ScheduleService.getAllScheduleByClassId(this.classID, {page_no: 1, count: 10});
      const curriculumItems = await MyClassService.getAllCurriculumByClassId(this.classID, {page_no: 1, count: 10});
      const postsItems = await PostService.getAllPostsByClassId(this.classID, {page_no: 1, count: 10});
      //

      //초기 created  시에 해당 api 접속후
      //각각 컨텐츠의 total = scheduleItems.total / curriculumItems.total / postsItems.post_listcount
      //total 값으로 페이징 처리 후 -> 스크롤값 end 시 --> 다음 페이징으로 api 로드 -> allData.push 처리
      const allCollection=[ scheduleItems, curriculumItems, postsItems ];
      await getAllPromise( allCollection )
        .then( ( data: any )=>{

        const max=getMax<number>([data[0].class_schedule_list.length, data[1].curriculum_list.length, data[2].post_list.length] );
        // console.log(max);
        // console.log( data );
        this.noticeSchedule=data[0].class_schedule_list.filter((item: any) =>item.type===1 );

        const allData: any[] = [];
        const contentsLen=allCollection.length;

        for (let i = 0; i < max; i++) {
          allData[i]=[];
          //
          for (let j = 0; j <contentsLen; j++) {
            const ov=allCollection[j];
            //
            if (j === 0) {
              if (ov && ov.class_schedule_list[i]) {
                const scheduleList=ov.class_schedule_list[i];
                allData[i].push({list: scheduleList, name:'schedule'});
              }
            }else if (j=== 1) {
              if (ov && ov.curriculum_list[i]) {
                const curriculumList=ov.curriculum_list[i];
                allData[i].push({ list:curriculumList, name:'curriculum'});
              }
            }else if (j=== 2) {
              if (ov && ov.post_list[i]) {
                const postList=ov.post_list[i];
                allData[i].push({ list: postList, name:'post'});
              }
            }
          }
        }

        this.allData = [...allData];
        console.log(this.allData);
        // const allData=[ ...data[0].post_list,  ...data[1].class_schedule_list, ...data[2].curriculum_list];
      }).catch((error)=>{
        console.log('클래스 홈 error', error );
      });
    }else{
      await PostService.getAllPostsByClassId( this.classID, { page_no: 1, count:10})
        .then( (data)=>{
          // console.log('PostService data', data);

          this.allData=data.post_list.map( ( item: any )=> item );
          //
        });
    }


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

  //start : curriculum ================================================
  private onCurriculumClick(id: number) {
    console.log(id);
    this.curriculumDetailViewOpen(id);
  }

  private onDetailCurriculumPopupStatus(value: boolean) {
    this.isOpenDetailCurriculum=value;
    this.courseDetailArray( this.courseDetailData );
  }
  private courseDetailArray(target: any) {
    target.sort((x: any, y: any)=> x.index - y.index);
  }

  /**
   * 디테일 팝업 오픈
   * @param id
   */
  private curriculumDetailViewOpen(id: number) {
    this.GET_CURRICULUM_DETAIL_ACTION({classId: Number(this.classID), curriculumId: id})
      .then((data) => {
        this.isOpenDetailCurriculum = true;
      });

    this.courseDetailArray(this.courseDetailData);
  }
  //end : curriculum ================================================


  //start : schedule detail ================================================
  private onScheduleClick(id: number) {
    this.isOpenDetailSch=true;
    this.scheduleDetailView({classId: Number(this.classID), id});
  }

  private scheduleDetailView(option: { classId: number, id: number }): void{
    const {classId, id}=option;

    //캘린더 상세 내역 데이타 호출 및 저장 - get scheduleDetailItem(): IScheduleDetail  통해 getter 로 상세 데이터를 가져올 수 있음.
    this.GET_SCHEDULE_DETAIL_ACTION({classId: Number(classId), scheduleId: id})
      .then((data) => {
        // console.log('캘린더 상세보기');
      });

    this.GET_SCHEDULE_COMMENTS_ACTION(id)
      .then(() => {
        // console.log(this.selectedEvent);
      });
  }

  private onDetailScheduleClose(val: boolean) {
    this.isOpenDetailSch=val;
    this.headerDepthChange(false);
  }

  private headerDepthChange( isDepth: boolean=true ) {
    const header=document.querySelector('header') as HTMLElement;
    if (isDepth) {
      header.classList.add('none-index');
    }else{
      header.classList.remove('none-index');
    }
  }

  private onDeleteByScheduleId( scheduleId: number) {
    this.isConfirmPopupOpen=true;
    this.confirmTitle = '일정 삭제';
    this.confirmDesc = `선택하신 일정을 삭제 하시겠습니다까?`;
    this.deleteScheduleId=scheduleId;
  }
  private onDeleteCheck( scheduleId: number) {
    // const findIdx=this.events.findIndex((item)=> item.id === scheduleId );
    // this.deleteScheduleEvent(findIdx);
  }

  private onEditSchedule() {
    if (this.schEditId !== -1) {
      //현재 스케줄이 들어 가 있는 배열을 splice 로 수정하는 작업 대입..
      console.log(this.schEditId);
      /*
      const findIdx = this.scheduleListsModel.findIndex((item) => item.id === this.schEditId);
      const { startAt, endAt, title, text, owner, count, id }=this.scheduleListsModel[findIdx];
      const changeColor = this.scheduleColor[owner.schedule_color].color;

      this.events.splice( findIdx, 1, {
        name: title,
        details: text,
        color:changeColor,
        start: new Date(startAt),
        end: new Date( endAt ),
        repeat: count,
        timed:true,
        id, // schedule_id (parent_id)
      });*/
    }
  }
  //end : schedule detail ================================================


  //start : notification ================================================

  private onNotificationClick(id: number) {
    this.detailPostOpen(id).then(()=>{
      console.log('디테일 오픈');
    });
  }

  /**
   * 알림 상세 화면 띄우기
   * @param id
   * @private
   */
  private async detailPostOpen(id: number) {
    // this.$emit('click:detailPost', id);
    // this.detailPostId = id; // update postId
    await this.GET_POST_DETAIL_ACTION({classId: Number(this.classID), postId: id });
    await this.GET_POST_COMMENTS_ACTION(id)
      .then((data) => {
        this.isOpenDetailNotification = true;
      });
  }

  private onDetailPostPopupStatus(value: boolean) {
    this.isOpenDetailNotification=value;
  }
  //end : notification ================================================


  //start : 공통팝업 ================================================
  private onConfirmClose(result: boolean) {
    this.isConfirmPopupOpen = false;
    if (result) {
      //
    }
  }

  private onNoticePopupClose(value: boolean) {
    this.isNoticePopupOpen = value;
    if (!value) {
      this.noticeTitle = '';
      this.noticeDesc = '';
    }
  }
  //end : 공통팝업 ================================================




}
