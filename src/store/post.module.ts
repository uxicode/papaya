import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import {SET_OPEN_ADD_POST, SET_POST_LIST, SET_POST_IN_BOOKMARK} from '@/store/mutation-class-types';
import {
  GET_POST_LIST_ACTION,
  ADD_POST
} from '@/store/action-class-types';
import {IPostInLinkModel, IPostModel, IVoteModel} from '@/views/model/post.model';
import {PostService} from '@/api/service/PostService';

@Module({
  namespaced: true,
})
export default class PostModule extends VuexModule {

  private openAddPopup: boolean= false;
  private postListData: IPostModel[] & IPostInLinkModel[]= [];

  /* Getters */
  get isOpenAddPopup(): boolean{
    return this.openAddPopup;
  }

  get postListItems(): IPostModel[] & IPostInLinkModel[] {
    return this.postListData;
  }

  @Mutation
  public [SET_OPEN_ADD_POST]( value: boolean ): void{
    this.openAddPopup=value;
  }

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

  @Action
  public [ADD_POST]( payload: { classId: number, formData: FormData  }): Promise<any> {
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
      });
  }

}
