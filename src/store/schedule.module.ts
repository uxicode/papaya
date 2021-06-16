import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import {
  SET_SCHEDULE_LIST,
  SET_SCHEDULE_DETAIL,
  SET_COMMENTS,
  SET_REPLY,
} from '@/store/mutation-class-types';
import {
  GET_SCHEDULE_LIST_ACTION,
  GET_SCHEDULE_DETAIL_ACTION,
  GET_COMMENTS_ACTION,
  ADD_COMMENT_ACTION,
  ADD_REPLY_ACTION,
} from '@/store/action-class-types';
import {IScheduleTotal} from '@/views/model/schedule.model';
import {ICommentModel, IReplyModel} from '@/views/model/comment.model';
import {PostService} from '@/api/service/PostService';
import {ScheduleService} from '@/api/service/ScheduleService';
import {CommentService} from '@/api/service/CommentService';
import {getAllPromise} from '@/views/model/types';

@Module({
  namespaced: true,
})
export default class ScheduleModule extends VuexModule {

  /* State */
  private scheduleListData: IScheduleTotal[] = [];
  private scheduleDetailData: IScheduleTotal = {
    attachment: [],
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
    user_keep_class_schedules: [],
    user_member_id: 0,
  };

  private commentData: ICommentModel[] = [];
  private replyData: IReplyModel[]=[];

  /* Getter */
  get scheduleListItems(): IScheduleTotal[] {
    return this.scheduleListData;
  }

  get scheduleDetailItem(): IScheduleTotal {
    return this.scheduleDetailData;
  }

  get commentItems(): ICommentModel[] {
    return this.commentData;
  }

  get replyItems(): IReplyModel[] {
    return this.replyData;
  }

  /* Mutation */
  @Mutation
  public [SET_SCHEDULE_LIST](data: any){
    this.scheduleListData=data;
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
  public [SET_SCHEDULE_DETAIL]( data: any ){
    this.scheduleDetailData=data;
  }

  /* Action */
  @Action
  public [GET_SCHEDULE_LIST_ACTION]( payload: { classId: number,  paging: {page_no: number, count: number } }  ): Promise<IScheduleTotal[]>{
    return ScheduleService.getAllScheduleByClassId( payload.classId, payload.paging)
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

  @Action
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

  @Action
  public [GET_COMMENTS_ACTION]( scheduleId: number): Promise<any> {
    return CommentService.getCommentsByScheduleId(scheduleId)
        .then((data) => {
          // console.log(data);

          // this.commentItems = data.comment_list;
          this.context.commit(SET_COMMENTS, data.comment_list);

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
  @Action
  public [ADD_COMMENT_ACTION](payload: {parent_id: number, parent_type: number, member_id: number, comment: string}): Promise<any> {
    return CommentService.setAddComment(payload)
        .then((data) => {
          console.log(data.comment);
          return Promise.resolve(this.commentData);
        });
  }

  @Action
  public [ADD_REPLY_ACTION](payload: {comment_id: number, member_id: number, comment: string}): Promise<any> {
    return CommentService.setAddReply(payload)
        .then((data) => {
          console.log(data.commentreply);
          return Promise.resolve(this.replyData);
        });
  }

}