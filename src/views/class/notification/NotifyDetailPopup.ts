import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IClassInfo} from '@/views/model/my-class.model';
import {IAttachFileModel, IPostInLinkModel, IPostModel} from '@/views/model/post.model';
import {Utils} from '@/utils/utils';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';
import {PostService} from '@/api/service/PostService';
import {getAllPromise} from '@/views/model/types';
import ListInImgPreview from '@/components/preview/ListInImgPreview.vue';
import ListInFilePreview from '@/components/preview/ListInFilePreview.vue';
import PhotoViewer from '@/views/class/notification/PhotoViewer';
import WithRender from './NotifyDetailPopup.html';

const MyClass = namespace('MyClass');

@WithRender
@Component({
    components:{
        Btn,
        Modal,
        ListInImgPreview,
        ListInFilePreview,
        PhotoViewer
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
    private commentItems: Array<{comment_list: []} > = [];
    private replyItems!: any;
    private isLoaded: boolean=false;
    private isPhotoViewer: boolean = false;

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

    public reset() {
        this.postDetailData = {
            attachment: [],
            class_id: 0,
            count: 0,
            createdAt: '',
            endAt: '',
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
                createdAt: '',
                id: 0,
                parent_id: 0,
                title: '',
                type: 0,
                updatedAt: '',
                link_items: []
            },
        };
        this.commentItems = [];
        this.replyItems = [];
    }

    @Watch('postId')
    public changeData() {
        setTimeout(()=>{
            this.getDetailPost(this.postId);
            this.getComments(this.postId);
            console.log(this.postDetailModel, this.postId);
        }, 500 );
    }

    private updatedDiffDate( dateValue: Date ): string{
        return Utils.updatedDiffDate(dateValue);
    }

    private popupChange( value: boolean ) {
        this.$emit('change', value);
        this.isLoaded=false;
        this.reset();
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

              this.isLoaded=true;

              // console.log(replyIdItems);
              getAllPromise( replyIdItems )
                .then(( replyData: any[] )=>{
                    // console.log(replyData);
                    this.replyItems = replyData;
                });
          });
    }

    private getImgFileDataSort(fileData: IAttachFileModel[] ) {
        return fileData.filter((item: IAttachFileModel) => item.contentType === 'image/png' || item.contentType === 'image/jpg' || item.contentType === 'image/jpeg' || item.contentType === 'image/gif');
    }

    private openPhotoViewer(): void {
        const attachment = this.postDetailModel.attachment;
        if (this.getImgFileDataSort(attachment).length > 0) {
            this.isPhotoViewer = true;
        }
    }

    private onPhotoViewerStatus(value: boolean) {
        this.isPhotoViewer = value;
    }

}
