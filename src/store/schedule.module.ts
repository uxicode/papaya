import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import {
  SET_SCHEDULE_LIST,
  SET_SCHEDULE_DETAIL,
  SET_COMMENTS,
  SET_REPLY,
  DELETE_SCHEDULE, EDIT_SCHEDULE,
} from '@/store/mutation-class-types';
import {
  GET_SCHEDULE_ACTION,
  GET_SCHEDULE_DETAIL_ACTION,
  GET_SCHEDULE_COMMENTS_ACTION,
  ADD_SCHEDULE_COMMENT_ACTION,
  ADD_SCHEDULE_REPLY_ACTION,
  ADD_SCHEDULE_ACTION,
  DELETE_SCHEDULE_ACTION,
  EDIT_SCHEDULE_ACTION,
} from '@/store/action-class-types';
import {IScheduleDetail, IScheduleTotal} from '@/views/model/schedule.model';
import {ICommentModel, IReplyModel} from '@/views/model/comment.model';
import {PostService} from '@/api/service/PostService';
import {ScheduleService} from '@/api/service/ScheduleService';
import {CommentService} from '@/api/service/CommentService';
import {getAllPromise} from '@/types/types';

@Module({
  namespaced: true,
})
export default class ScheduleModule extends VuexModule {

  /* State */
  private scheduleListData: IScheduleTotal[] = [];
  private scheduleDetailData: IScheduleDetail = {
    board_id: 0,
    class_id: 0,
    count: 0,
    createdAt: '',
    endAt: '',
    deletedYN: false,
    expiredAt: '',
    id: 0,
    owner: {
      class_id: 0,
      createdAt: '',
      id: 0,
      is_bookmarked: 0,
      joinedAt: '',
      level: 0,
      nickname: '',
      onoff_comment_noti: 0,
      onoff_post_noti: 0,
      onoff_push_noti: 0,
      onoff_schedule_noti: 0,
      open_level_email: 0,
      open_level_id: 0,
      open_level_mobileno: 0,
      profile_image: '',
      schedule_color: 0,
      schedule_noti_intime: 0,
      status: 0,
      updatedAt: '',
      user_id: 0,
      visited: 0,
    },
    param1: 0,
    post_type: 0,
    startAt: '',
    text: '',
    title: '',
    type: 0,
    updatedAt: '',
    user_id: 0,
    attachment: [],
    user_keep_class_schedules: [],
    user_member_id: 0,
    me: {
      joinedAt: '',
      createdAt: '',
      updatedAt: '',
      id: 0,
      class_id: 0,
      user_id: 0,
      nickname: '',
      profile_image: '',
      is_bookmarked: 0,
      schedule_color: 0,
      level: 0,
      status: 0,
      open_level_id: 0,
      open_level_mobileno: 0,
      open_level_email: 0,
      onoff_push_noti: 0,
      onoff_post_noti: 0,
      onoff_comment_noti: 0,
      onoff_schedule_noti: 0,
      schedule_noti_intime: 0,
      visited: 0,
    }
  };
  private scheduleEditIdx: number=-1;

  private commentData: ICommentModel[] = [];
  private replyData: IReplyModel[]=[];

  /* Getter */
  get scheduleListItems(): IScheduleTotal[] {
    return this.scheduleListData;
  }

  get scheduleDetailItem(): IScheduleDetail {
    return this.scheduleDetailData;
  }

  get scheduleCommentItems(): ICommentModel[] {
    return this.commentData;
  }

  get scheduleReplyItems(): IReplyModel[] {
    return this.replyData;
  }

  get schEditId(): number{
    return this.scheduleEditIdx;
  }

  /* Mutation */
  @Mutation
  public [SET_SCHEDULE_LIST](data: any){
    this.scheduleListData=data;
  }

  @Mutation
  public [SET_SCHEDULE_DETAIL]( data: IScheduleDetail ){
    this.scheduleDetailData=data;
  }

  @Mutation
  public [SET_COMMENTS](data: any){
    this.commentData=data;
  }

  @Mutation
  public [SET_REPLY](data: any){
    this.replyData=data;
  }

  @Mutation
  public [EDIT_SCHEDULE]( info: { scheduleId: number, editInfo: any }){
    const {scheduleId, editInfo} = info;
    const findIdx=this.scheduleListData.findIndex((item) => item.id === scheduleId );
    this.scheduleListData.splice(findIdx, 1, {...this.scheduleListData[findIdx],  ...editInfo});

    this.scheduleEditIdx=scheduleId;
  }


  @Mutation
  public [DELETE_SCHEDULE](info: { scheduleId: number }){
    const {scheduleId} = info;
    const findIdx=this.scheduleListData.findIndex((item) => item.id === scheduleId );
    this.scheduleListData.splice(findIdx, 1);
  }

  /* Action */
  @Action({rawError: true})
  public [GET_SCHEDULE_ACTION]( payload: { classId: number,  paging: {page_no: number, count: number } }  ): Promise<any>{
    const {classId, paging }=payload;

    return ScheduleService.getAllScheduleByClassId( classId, paging )
        .then((data) => {
          // console.log(data);
          console.log('scheduleListData=', this.scheduleListData);
          this.context.commit(SET_SCHEDULE_LIST, data.class_schedule_list);
          return Promise.resolve(this.scheduleListData);
        })
        .catch((error) => {
          console.log(error);
          return Promise.reject(error);
        });
  }

  @Action({rawError: true})
  public [GET_SCHEDULE_DETAIL_ACTION](payload: { classId: number, scheduleId: number }): Promise<any>{
    return ScheduleService.getScheduleById(payload.classId, payload.scheduleId )
        .then((data) => {
          this.context.commit(SET_SCHEDULE_DETAIL, data.schedule);
          console.log('scheduleDetailData=', this.scheduleDetailData);

          return Promise.resolve(this.scheduleDetailData);
        }).catch((error) => {
          console.log(error);
          return Promise.reject(error);
        });
  }

  @Action({rawError: true})
  public async [ADD_SCHEDULE_ACTION](payload: { classId: number, formData: FormData }): Promise<any>{
    const {classId, formData}=payload;
   /*
   schedule:{
    class_id: 750
    count: 0
    createdAt: "2021-07-14 00:00:00"
    deletedYN: false
    endAt: "2021-07-14 03:30:00"
    expiredAt: "2021-07-14 03:30:00"
    id: 1977
    param1: 0
    post_type: 1
    startAt: "2021-07-14 03:30:00"
    text: "dsadfsdafasf"
    title: "asdfsadfsa"
    type: 0
    updatedAt: "2021-07-14 00:00:00"
    user_id: 250
    user_member_id: 844
   }
   */

    try{
      const addSchedule=await ScheduleService.setAddSchedule( Number(classId), formData);
      const {id}=addSchedule.schedule;
      const readData=await ScheduleService.getScheduleById( classId, id );
      const {schedule} = readData;
      this.scheduleListData.push(schedule);
      return Promise.resolve(readData);
    }catch(error){
      return Promise.reject(error);
    }
  }

  @Action({rawError: true})
  public [EDIT_SCHEDULE_ACTION](payload: { classId: number, scheduleId: number, promise: Array<Promise<any>> }): Promise<any>{
    const {classId, scheduleId, promise} = payload;

    return getAllPromise(promise)
      .then((data)=>{

        console.log(data);

        ScheduleService.getScheduleById(classId, scheduleId)
          .then((readData) => {
            this.context.commit(EDIT_SCHEDULE, {scheduleId, editInfo: readData.schedule});
            this.context.commit(SET_SCHEDULE_DETAIL, readData.schedule);
          });

        return Promise.resolve(data);
      }).catch((error) => {
        console.log(error);
        return Promise.reject(error);
      });
  }


  /**
   * 알림글 삭제
   * @param payload
   */
  @Action({rawError: true})
  public [DELETE_SCHEDULE_ACTION](payload: { classId: string | number, scheduleId: number }): Promise<any>{
    const {classId, scheduleId }=payload;
    return ScheduleService.deleteScheduleById( classId, scheduleId )
      .then((data)=>{
        this.context.commit(DELETE_SCHEDULE, {scheduleId});
        return Promise.resolve(data);
      }).catch((error) => {
        console.log(error);
        return Promise.reject(error);
      });
  }

  @Action({rawError: true})
  public [GET_SCHEDULE_COMMENTS_ACTION]( scheduleId: number): Promise<any> {
    return CommentService.getCommentsByScheduleId(scheduleId)
        .then((data) => {
          // console.log(data);

          // this.commentItems = data.comment_list;
          // this.context.commit(SET_COMMENTS, data.comment_list);

          // 댓글 삭제를 해도 완전히 제거가 안되고 deleteYN: true 로 변경만 되므로 filter 로 걸러준다.
          const notDeletedComments = data.comment_list.filter((item: any) => item.deletedYN === false);
          this.context.commit(SET_COMMENTS, notDeletedComments);

          //대댓글 정보 가져오기 - commentItems 에 맞는 대댓정보를 가져오기 위해 2차 반복문을 실행.
          const replyIdPromiseItems=this.commentData.map((item: any)=>{
            return CommentService.getReplysByCommentId( item.id );
          });

          // console.log(replyIdItems);
          getAllPromise( replyIdPromiseItems )
              .then(( replyData: any[] )=>{
                // console.log(replyData);
                // this.replyData = replyData;
                this.context.commit(SET_REPLY, replyData);
              });
        });
  }

  /**
   * 댓글 추가
   * parent_type: 댓글이 달린 원글 타입. 0 - 알림글 , 1 - 일정글
   * @param payload
   */
  @Action({rawError: true})
  public [ADD_SCHEDULE_COMMENT_ACTION](payload: {parent_id: number, parent_type: number, member_id: number, comment: string}): Promise<any> {
    return CommentService.setAddComment(payload)
        .then((data) => {
          console.log(data.comment);
          return Promise.resolve(this.commentData);
        });
  }

  @Action({rawError: true})
  public [ADD_SCHEDULE_REPLY_ACTION](payload: {comment_id: number, member_id: number, comment: string}): Promise<any> {
    return CommentService.setAddReply(payload)
        .then((data) => {
          console.log(data.commentreply);
          return Promise.resolve(this.replyData);
        });
  }

}
