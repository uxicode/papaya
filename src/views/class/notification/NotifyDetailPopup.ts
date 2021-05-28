import {Vue, Component, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IClassInfo} from '@/views/model/my-class.model';
import {IPostModel} from '@/views/model/post.model';
import {PostService} from '@/api/service/PostService';
import {Utils} from '@/utils/utils';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';
import WithRender from './NotifyDetailPopup.html';

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

    private postData!: IPostModel;
    private commentData!: any;
    private replyData!: any;

    public mounted() {
        this.getPost();
        this.getComments();
        this.getReplys();
    }

    public calcDate(dateValue: Date): number[] {
        const today = Date.now();
        const updateDate = new Date(dateValue);
        const updateDateTime=updateDate.getTime();
        const calcDate=today - updateDateTime;
        const msOfDay = 24*60*60*1000;
        const msOfHour = 60*60*1000;
        const msOfMin = 60*1000;

        const calcDay: number = Math.floor( calcDate / msOfDay );
        const calcHour: number =( calcDay>7 )? Math.floor( calcDate / msOfHour ) : Math.floor((calcDate%msOfDay) / msOfHour );
        const calcMin: number =( calcDay>7 )? Math.floor( calcDate / msOfMin ) : Math.floor((calcDate %msOfHour) /msOfMin );

        return [ calcDay,  calcHour, calcMin ];
    }

    /**
     * 알림 정보 가져오기
     * @private
     */
    private getPost(): void {
        PostService.getPostsById(this.classID, this.postId)
            .then((data) => {
               console.log(data);
               this.postData = data.post;
            });
    }

    /**
     * 댓글 정보 가져오기
     * @private
     */
    private getComments(): void {
        PostService.getCommentsByPostId(this.postId)
            .then((data) => {
                console.log(data);
                this.commentData = data.comment_list;
            });
    }

    /**
     * 대댓글 정보 가져오기
     * @private
     */
    private getReplys(): void {
        // commentId 를 각각 다르게 해서 2차원 배열로 가져와야 함.
        PostService.getReplysByCommentId(79)
            .then((data) => {
               console.log(data);
               this.replyData = data.comment_list;
            });
    }

    private updatedDiffDate( dateValue: Date ): string{
        const resultDate=this.calcDate(dateValue);
        // console.log( resultDate[0], resultDate[1], resultDate[1]);
        return ( resultDate[0]>7 )? Utils.getTodayParseFormat( new Date(dateValue) ) : resultDate[1]+'시간 '+resultDate[2]+'분 전';
    }

    private popupChange( value: boolean ) {
        this.$emit('change', value);
    }
    private onDetailPostPopupOpen(id: number) {
        console.log(id);
        this.$emit('detailView', id );
    }


}
