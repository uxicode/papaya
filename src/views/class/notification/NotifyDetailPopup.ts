import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IClassInfo} from '@/views/model/my-class.model';
import {IPostInLinkModel, IPostModel} from '@/views/model/post.model';
import {Utils} from '@/utils/utils';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';
import WithRender from './NotifyDetailPopup.html';
import {PostService} from '@/api/service/PostService';
import {getAllPromise} from '@/views/model/types';

const MyClass = namespace('MyClass');

@WithRender
@Component({
    components:{
        Btn,
        Modal,
    }
})
export default class NotifyDetailPopup extends Vue {

    @Prop(Boolean)
    private isOpen!: boolean;



    @Prop(Number)
    private postId!: number;

    @MyClass.Getter
    private classID!: string | number;

    @MyClass.Getter
    private myClassHomeModel!: IClassInfo;

    private postDetailData!: IPostModel & IPostInLinkModel;
    private commentItems: Array<{comment_list: []} > = [];
    private replyItems!: any;
    private isLoaded: boolean=false;

    get commentItemsModel() {
        return this.commentItems;
    }

    get replyItemsModel() {
        return this.replyItems;
    }


    get postDetailModel():  IPostModel & IPostInLinkModel{
        return this.postDetailData;
    }
    set postDetailModel( value:  IPostModel & IPostInLinkModel){
        this.postDetailData=value;
    }


    get getTitle(): string{
        if(this.postDetailModel===undefined){
            return '';
        }else{
            return this.postDetailModel.title;
        }
    }

    get getDate(): string{
        if(this.postDetailModel===undefined){
            return '';
        }else{
            return this.postDetailModel.createdAt as string;
        }
    }

    get getCount(): number{
        if(this.postDetailModel===undefined){
            return 0;
        }else{
            return this.postDetailModel.count as number;
        }
    }

    get getDetailInfo(): string{
        if(this.postDetailModel===undefined){
            return '';
        }else{
            return this.postDetailModel.text as string;
        }
    }

    @Watch('postId')
    public changeData() {
        this.getDetailPost(this.postId);
        this.getComments(this.postId);
        console.log(this.postDetailModel, this.postId);
    }

    private updatedDiffDate( dateValue: Date ): string{
        return Utils.updatedDiffDate(dateValue);
    }

    private popupChange( value: boolean ) {
        this.$emit('change', value);
        this.isLoaded=false;
    }
    private onDetailPostPopupOpen(id: number) {
        console.log(id);
        this.$emit('detailView', id );
    }


    /**
     * 알림 정보 가져오기
     * @private
     */
    private getDetailPost( postId: number ): void {
        PostService.getPostsById(this.classID, postId )
          .then((data) => {
              this.postDetailData = data.post;
              // console.log( this.postDetailData);
          });
    }

    /**
     * 댓글 정보 가져오기
     * @private
     */
    private getComments(postId: number): void {
        PostService.getCommentsByPostId(postId)
          .then((data) => {
              // console.log(data);
              this.commentItems = data.comment_list;
              //대댓글 정보 가져오기 - commentItems 에 맞는 대댓정보를 가져오기 위해 2차 반복문을 실행.
              const replyIdItems=this.commentItems.map((item: any)=>{
                  return PostService.getReplysByCommentId( item.id );
              });
              // console.log(replyIdItems);
              getAllPromise( replyIdItems )
                .then(( replyData: any[] )=>{
                    // console.log(replyData);
                    this.replyItems = replyData;

                    setTimeout(() => {
                        this.isLoaded=true;
                    }, 1000);

                });
          });
    }


}
