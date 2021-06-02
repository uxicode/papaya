import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import {
  SET_POST_IN_BOOKMARK,
  SET_RESERVED_LIST,
  SET_RESERVED_TOTAL,
  SET_POST_DETAIL,
  SET_COMMENTS,
  SET_REPLY
} from '@/store/mutation-class-types';
import {
  GET_POST_LIST_ACTION,
  ADD_POST_ACTION,
  GET_RESERVED_LIST_ACTION,
  DELETE_POST_ACTION,
  POST_TYPE_CHANGE_ACTION,
  GET_POST_DETAIL_ACTION,
  GET_COMMENTS_ACTION
} from '@/store/action-class-types';
import {IPostInLinkModel, IPostModel, IVoteModel} from '@/views/model/post.model';
import {PostService} from '@/api/service/PostService';
import {getAllPromise} from '@/views/model/types';

@Module({
  namespaced: true,
})
export default class PostModule extends VuexModule {

  private openAddPopup: boolean= false;
  private postListData: IPostModel[] & IPostInLinkModel[]= [];
  private reservedTotal: number=0;
  private reservedData: IPostModel[] & IPostInLinkModel[]= [];
  private postDetailData: IPostModel & IPostInLinkModel={
    attachment: [],
    class_id: 0,
    count: 0,
    createdAt: '',
    endAt: '',
    expiredAt:  '',
    id: 0,
    owner: {
      class_id: 0,
      createdAt: '',
      id: 0,
      is_bookmarked: 0,
      joinedAt: '',
      level: 0,
      nickname: '',
      onoff_comment_noti:  0,
      onoff_post_noti: 0,
      onoff_push_noti: 0,
      onoff_schedule_noti:  0,
      open_level_email: 0,
      open_level_id:  0,
      open_level_mobileno:  0,
      profile_image: '',
      schedule_color:  0,
      schedule_noti_intime:  0,
      status:  0,
      updatedAt: '',
      user_id:  0,
      visited: 0,
    },
    param1: 0,
    post_type: 0,
    startAt:  '',
    text: '',
    title: '',
    type: 0,
    updatedAt: '',
    user_id: 0,
    user_keep_class_posts: [],
    user_member_id: 0,
    vote: {
      anonymous_mode: false, // 익명 모드
      createdAt: '',
      finishAt: '',
      id: 0,
      multi_choice: false,
      open_progress_level: 0,
      open_result_level: 0,
      parent_id: 0,
      title: '',
      type: 0,
      updatedAt: '',
      vote_choices: []
    },
    isBookmark: false,
    link: {
      createdAt:'',
      id: 0,
      parent_id: 0,
      title: '',
      type: 0,
      updatedAt: '',
      link_items: []
    },
  };
  private commentData: any[] = [];
  private replyData: any[]=[];


  /* Getters */
  get isOpenAddPopup(): boolean{
    return this.openAddPopup;
  }

  get postListItems(): IPostModel[] & IPostInLinkModel[] {
    return this.postListData;
  }

  get reservedItems(): IPostModel[] & IPostInLinkModel[]{
    return this.reservedData;
  }

  get reservedTotalItem(): number{
    return this.reservedTotal;
  }

  get postDetailItem(): IPostModel & IPostInLinkModel{
    return this.postDetailData;
  }

  get commentItems(): any[] {
    return this.commentData;
  }

  get replyItems(): any[] {
    return this.replyData;
  }

  /**
   * 알림 리스트 reverse 및 북마크 초기 상태 지정
   * @param items
   */
  @Mutation
  public [SET_POST_IN_BOOKMARK](  items: IPostModel[] & IPostInLinkModel[] ): void{
    this.postListData=items;
    //
    this.postListData.reverse();

    this.postListData.forEach(( item: any, index: number ) => {
      let {isBookmark}=item;
      //
      if( item.user_keep_class_posts.length > 0){
        isBookmark=!isBookmark;
        this.postListData.splice(index, 1, {...item, isBookmark} );
      }
    });
  }

  /**
   * 예약 알림 글 데이터 저장
   * @param items
   */
  @Mutation
  public [SET_RESERVED_LIST](items: any[]){
    this.reservedData=items;
  }

  /**
   * 예약 알림 총 개수 지정
   * @param total
   */
  @Mutation
  public [SET_RESERVED_TOTAL]( total: number ){
    this.reservedTotal=total;
  }

  @Mutation
  public [SET_POST_DETAIL]( data: any ){
    this.postDetailData=data;
  }

  @Mutation
  public [SET_COMMENTS](data: any){
    this.commentData=data;
  }

  @Mutation
  public [SET_REPLY](data: any){
    this.replyData=data;
  }

  /**
   * 알림글 리스트 조회
   * @param payload
   */
  @Action
  public [GET_POST_LIST_ACTION]( payload: { classId: number,  paging: {page_no: number, count: number } }  ): Promise<IPostModel[] & IPostInLinkModel[]>{
    return PostService.getAllPostsByClassId( payload.classId, payload.paging)
      .then((data) => {
        // console.log(data);
        // this.postListItems = data.post_list;
        console.log('noticeListItems=', this.postListData);

        this.context.commit(SET_POST_IN_BOOKMARK, data.post_list);

        return Promise.resolve(this.postListData);
      })
      .catch((error) => {
        console.log(error);
        return Promise.reject(error);
      });
  }

  /**
   * 알림 글 생성
   * @param payload
   */
  @Action
  public [ADD_POST_ACTION](payload: { classId: number, formData: FormData  }): Promise<any> {
    return PostService.setAddPost( payload.classId, payload.formData )
      .then(( data )=>{
        console.log( data );
        let addPostData=data.post;
        if( addPostData.user_keep_class_posts.length > 0){
          let isBookmark: boolean=false;
          isBookmark=!isBookmark;
          addPostData = {...addPostData, ...{isBookmark}};
        }
        this.postListData.unshift(addPostData);

        // this.$emit('submit', false);
        // voteData 는 알림의 id 값을 알아야 하기에 먼저 알림을 생성/등록>완료 후 해당 알림의 id 을 가져와서 voteData 를 생성한다.
        /*if ( payload.voteData ) {
          let { parent_id } = payload.voteData;
          parent_id=data.post.id;
          PostService.setAddVote(payload.classId, {...payload.voteData, parent_id})
            .then(( voteData: any)=>{
              console.log(voteData);

             /!* *!/
            });
        }*/

        // this.imgFilesAllClear();
        // this.attachFilesAllClear();
        // this.postData={ title: '', text: ''};
      }).catch((error) => {
        console.log(error);
        return Promise.reject(error);
      });
  }

  /**
   * 알림글 삭제
   * @param payload
   */
  @Action
  public [DELETE_POST_ACTION](payload: { classId: string | number, postId: number }): Promise<any>{
    return PostService.deletePostById( payload.classId, payload.postId )
      .then((data)=>{
        const findIdx=this.postListItems.findIndex((item) => item.id === payload.postId);
        this.postListItems.splice(findIdx, 1);
        return Promise.resolve(data);
      }).catch((error) => {
        console.log(error);
        return Promise.reject(error);
      });
  }

  /**
   *  알림글을 공지 혹은 일반 글로 등록
   * @param payload
   */
  @Action
  public [POST_TYPE_CHANGE_ACTION](payload: { classId: string | number, postId: number }): Promise<any>{
    const findIdx=this.postListItems.findIndex((item) => item.id === payload.postId);
    const targetItem = this.postListItems[findIdx];
    let { type }=targetItem;
    const { title, text }=targetItem;
    type=( type===0 )? 1 : 0;
    return PostService.setPostById( payload.classId, payload.postId, {type, title, text} )
      .then( (data)=>{
        this.postListItems.splice(findIdx, 1, {...targetItem, type, title, text});
        return Promise.resolve(data);
      }).catch((error) => {
        console.log(error);
        return Promise.reject(error);
      });
  }


  @Action
  public [GET_RESERVED_LIST_ACTION](classId: number ) {
    PostService.getReservedPost( classId )
      .then((data)=>{

        // console.log(data);
        this.context.commit(SET_RESERVED_TOTAL, data.post_listcount);
        this.context.commit(SET_RESERVED_LIST, data.post_list);

        return Promise.resolve(this.reservedData);
      }).catch((error) => {
      console.log(error);
      return Promise.reject(error);
    });
  }

  @Action
  public [GET_POST_DETAIL_ACTION](payload: { classId: number, postId: number }): Promise<any>{
    return PostService.getPostsById(payload.classId, payload.postId )
      .then((data) => {
        this.context.commit(SET_POST_DETAIL, data.post);
        // this.postDetailData = data.post;
        console.log('postDetailData=', this.postDetailData);

        return Promise.resolve(this.postDetailData);
      }).catch((error) => {
        console.log(error);
        return Promise.reject(error);
      });
  }

  @Action
  public [GET_COMMENTS_ACTION]( postId: number): Promise<any> {
    return PostService.getCommentsByPostId(postId)
      .then((data) => {
        // console.log(data);

        // this.commentItems = data.comment_list;
        this.context.commit(SET_COMMENTS, data.comment_list);

        //대댓글 정보 가져오기 - commentItems 에 맞는 대댓정보를 가져오기 위해 2차 반복문을 실행.
        const replyIdPromiseItems=this.commentData.map((item: any)=>{
          return PostService.getReplysByCommentId( item.id );
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

}
