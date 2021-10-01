import {Vue, Component, Prop, Watch, Mixins} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {getAllPromise, getMax} from '@/types/types';
import MyClassService from '@/api/service/MyClassService';
import {NoticeScheduleModel} from '@/views/model/schedule.model';
import {IAttachFileModel, IPostInLinkModel, IPostModel} from '@/views/model/post.model';
import {PostService} from '@/api/service/PostService';
import {ScheduleService} from '@/api/service/ScheduleService';
import ListInImgPreview from '@/components/preview/ListInImgPreview.vue';
import ListInFilePreview from '@/components/preview/ListInFilePreview.vue';
import ListInVotePreview from '@/components/preview/ListInVotePreview.vue';
import ListInLinkPreview from '@/components/preview/ListInLinkPreview.vue';
import ConfirmPopup from '@/components/modal/confirmPopup.vue';
import NoticePopup from '@/components/modal/noticePopup.vue';
import ScrollObserver from '@/components/scrollObserver/ScrollObserver.vue';
import ScheduleDetailPopup from '@/views/class/schedule/ScheduleDetailPopup';
import NotifyDetailPopup from '@/views/class/notification/NotifyDetailPopup';
import {ICurriculumDetailList} from '@/views/model/my-class.model';
import CurriculumDetailPopup from '@/views/class/curriculum/CurriculumDetailPopup';
import Btn from '@/components/button/Btn.vue';
import PagingMixins from '@/mixin/PagingMixins';

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
    NotifyDetailPopup,
    Btn,
    ScrollObserver
  }
})
export default class MyClassListDetailView extends Mixins(PagingMixins){

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


  private scheduleTotal: number=-1;
  private curriculumTotal: number=-1;
  private postTotal: number=-1;

  private scheduleLastPage: number=-1;
  private curriculumLastPage: number=-1;
  private postTotalLastPage: number=-1;

  private curSchedulePageNum: number=1;
  private curCurriculumPageNum: number=1;
  private curPostPageNum: number=1;

  private contentsInfo: any[] = [];

  private isLoader: boolean=true;

  //start : 공통 팝업 변수 ================================================
  private isConfirmPopupOpen: boolean = false;
  private isNoticePopupOpen: boolean = false;
  private noticeTitle: string = '';
  private confirmTitle: string = '';
  private noticeDesc: string = '';
  private confirmDesc: string = '';
  //end : 공통 팝업 변수 ================================================

  private noticePost: IPostModel[]=[];
  private allData: any[] = [];

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



  get loaderModel() {
    return this.isLoader;
  }

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
        if (this.allDataModel.length > 0) {
          // this.scrollObserver( '.loader-checker');
        }
      });

  }

  // <scroll-observer> 태그에서 @update 이벤트 핸들러로 호출됨.
  public scrollObserver( value: boolean ) {
    this.isLoader=value;
    this.updateContents()
      .then(()=>{
        this.isLoader=false;
        console.log('추가 페이지 로드 완료.');
      });
  }

  public updatePaging( totalNum: number, numOfPage: number ) {
    //총 페이지 카운트
    const total=this.getTotalPageCount({total: totalNum, numOfPage});
    //페이지 카운트 구하기
    const pageItems = this.getPageNum({ totalPageCount: total, pageSize: total, curPageNum: 1});
    //마지막 페이지 카운트
    const lastPage = pageItems[pageItems.length - 1];
    return {
      total,
      lastPage
    };
  }
  //{total_count: 0, post_listcount: 0, post_list: Array(0)}
  //{ total: 0, class_schedule_list: Array(0)}
  // {page_item_count: 5, total: 0, curriculum_list: [], item_count: 0}

  private updateCallApi( name: string ): Promise<any> | null{
    if (this.isMember) {
      const findIdx = this.contentsInfo.findIndex((item) => item.name === name);
      if (findIdx === -1) { return null;}

      const infoOv=this.contentsInfo[findIdx];
      const {last, count, promise}=infoOv;

      if (last > count) {
        let pageNum=count;
        this.contentsInfo.splice(findIdx, 1, {...infoOv, count: ++pageNum});
        // console.log('findIdx=',findIdx, 'infoOv.count=', infoOv.count);
        return promise( Number(this.classID), {page_no: infoOv.count, count: this.numOfPage} );
      }else{
        return null;
      }
    }
    return null;
  }

  /**
   * promise.all 에 대입하기 위한 collection 만들기 -  유효한 promise 만 지정한 배열에 대입하기.
   * @param items
   * @param args
   * @private
   */
  private validContents( items: any[], ...args: Array<Promise<any>> ): void{
    args.forEach((promiseItem)=>{
      if (promiseItem) {
        items.push( promiseItem );
      }
    });
  }

  private shuffleContents( promiseItems: any[] ): unknown[] {
    const allContents: any[] = [];
    const contentsLen=promiseItems.length;

    for (let i = 0; i < this.numOfPage; i++) {
      allContents[i]=[];
      //
      for (let j = 0; j <contentsLen; j++) {
        const ov=promiseItems[j];
        //
        if (j === 0) {
          if (ov && ov.class_schedule_list[i]) {
            const scheduleList=ov.class_schedule_list[i];
            allContents[i].push({list: scheduleList, name:'schedule'});
          }
        }else if (j === 1) {
          if (ov && ov.curriculum_list[i]) {
            const curriculumList=ov.curriculum_list[i];
            allContents[i].push({ list:curriculumList, name:'curriculum'});
          }
        }else if (j=== 2) {
          if (ov && ov.post_list[i]) {
            const postList=ov.post_list[i];
            allContents[i].push({ list: postList, name:'post'});
          }
        }
      }
    }

    return allContents;
  }

  private async updateContents() {
    const collections: any[] = [];
    const scheduleItems=await this.updateCallApi('schedule');
    const curriculumItems=await this.updateCallApi('curriculum');
    const postItems=await this.updateCallApi('post');

    this.validContents(collections, scheduleItems, curriculumItems, postItems);

    // console.log(collections.length);

    if (collections.length >0) {
      await getAllPromise( collections )
        .then( ( items: any )=>{

          // console.log(max);
          // console.log( items );
          // this.noticeSchedule=data[0].class_schedule_list.filter((item: any) =>item.type===1 );

          const allItems=this.shuffleContents( collections );

          this.allData = [...this.allData, ...allItems];
          // console.log(this.allData);
          // const allData=[ ...data[0].post_list,  ...data[1].class_schedule_list, ...data[2].curriculum_list];
        }).catch((error)=>{
          console.log('클래스 홈 error', error );
        });
    }

  }



  private async getClassList(){

    const isMember= await MyClassService.getMyInfoInThisClass( Number( this.classID ) );
    this.memberStatus=isMember.result;

    console.log('isMember=',  this.memberStatus,  Number( this.classID ) );

    //멤버 일경우
    if (this.memberStatus) {

      //paging 처리 필요~
      const scheduleItems = await ScheduleService.getAllScheduleByClassId(this.classID, {page_no: this.curSchedulePageNum, count: this.numOfPage});
      const curriculumItems = await MyClassService.getAllCurriculumByClassId(this.classID, {page_no: this.curCurriculumPageNum, count:  this.numOfPage});
      const postsItems = await PostService.getAllPostsByClassId(this.classID, {page_no: this.curPostPageNum, count:  this.numOfPage});
      //
      //초기 created  시에 해당 api 접속후
      //각각 컨텐츠의 total = scheduleItems.total / curriculumItems.total / postsItems.post_listcount
      //total 값으로 페이징 처리 후 -> 스크롤값 end 시 --> 다음 페이징으로 api 로드 -> allData.push 처리

      const scheduleTotal=scheduleItems.total;
      const curriculumTotal=curriculumItems.total;
      const postTotal=postsItems.post_listcount;

      const schedulePagingOv= this.updatePaging(scheduleTotal, this.numOfPage);
      const curriculumPagingOv= this.updatePaging(curriculumTotal, this.numOfPage);
      const postPagingOv= this.updatePaging(postTotal, this.numOfPage);


      this.allData = [];
      this.contentsInfo = [];
      this.noticePost=[];

      this.contentsInfo.push( { name: 'schedule', total: scheduleItems.total, last: schedulePagingOv.lastPage, count: this.curSchedulePageNum, promise:ScheduleService.getAllScheduleByClassId } );
      this.contentsInfo.push( { name: 'curriculum', total: curriculumItems.total, last: curriculumPagingOv.lastPage, count: this.curCurriculumPageNum, promise: MyClassService.getAllCurriculumByClassId  } );
      this.contentsInfo.push( { name: 'post', total: postsItems.post_listcount, last: postPagingOv.lastPage, count: this.curPostPageNum, promise: PostService.getAllPostsByClassId } );
      // const allCollection=[ scheduleItems, curriculumItems, postsItems ];

      this.updateContents()
        .then(()=>{
          this.isLoader=false;
          this.noticeSchedule=scheduleItems.class_schedule_list.filter((item: any) =>item.type===1 );
        });
      /*await getAllPromise( allCollection )
        .then( ( data: any )=>{

        // console.log(max);
        // console.log( data );
        this.noticeSchedule=data[0].class_schedule_list.filter((item: any) =>item.type===1 );

        const allItems=this.shuffleContents( allCollection );

        this.allData = [...allItems];
        // console.log(this.allData);
        // const allData=[ ...data[0].post_list,  ...data[1].class_schedule_list, ...data[2].curriculum_list];
      }).catch((error)=>{
        console.log('클래스 홈 error', error );
      });*/
    }else{ //멤버가 아닐 경우
      await PostService.getAllPostsByClassId( this.classID, { page_no: 1, count:10})
        .then( (data)=>{
          // console.log('PostService data', data);

          this.allData=data.post_list.map( ( item: any )=> item );
          //
        });
    }

    //알림 글 중에서 공지만 가져온다.
    await PostService.getAllMyClassPosts({page_no: undefined, count: undefined} )
      .then((data)=>{
        // console.log(data);
        this.noticePost=data.post_list.filter((item: any) => item.type === 1);

        this.noticePost.forEach(( item: any, index: number ) => {
          let {isBookmark}=item;
          //
          if( item.user_keep_class_posts.length > 0){
            isBookmark=!isBookmark;
            this.noticePost.splice(index, 1, {...item, isBookmark} );
          }
        });
      });
  }


  //start : 상단 공지 ================================================
  private onKeepPostClick(idx: number ) {

    const findIdx=this.noticePost.findIndex((ele) => ele.id === idx);

    const targetPost=this.noticePost[findIdx];
    let { isBookmark } = targetPost;

    console.log('isBookmark=', isBookmark);
    const { user_keep_class_posts } = targetPost;

    if( isBookmark ){
      if( user_keep_class_posts!==undefined && Array.isArray(user_keep_class_posts) && user_keep_class_posts.length>0){
        PostService.deleteKeepPost( user_keep_class_posts[0].id )
          .then((postData)=>{
            isBookmark=!isBookmark;
            user_keep_class_posts.length=0;
            this.noticePost.splice(findIdx, 1, {...targetPost, isBookmark, user_keep_class_posts} );
          });
      }
    }else{
      //북마크 되어 있는 상태
      PostService.setKeepPost({ class_id:Number( this.classID ), post_id: idx })
        .then((postData: any )=>{
          // console.log(data);
          isBookmark=!isBookmark;
          user_keep_class_posts.push( postData.data );
          this.noticePost.splice(findIdx, 1, {...targetPost, isBookmark, user_keep_class_posts} );
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
    return ( this.noticePost[this.noticePost.length-1])? this.noticePost[this.noticePost.length-1].title : '';
  }
  //end : 상단 공지 ================================================





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
