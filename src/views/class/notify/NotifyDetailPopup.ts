import {Vue, Component, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IClassInfo} from '@/views/model/my-class.model';
import {IPostModel} from '@/views/model/post.model';
import {PostService} from '@/api/service/PostService';
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

    @MyClass.Getter
    private classID!: string | number;

    @MyClass.Getter
    private myClassHomeModel!: IClassInfo;

    private postData!: IPostModel;
    private commentData!: any;
    private replyData!: any;

    public created() {
        this.getPost();
        this.getComments();
    }

    /**
     * 알림 정보 가져오기
     * @private
     */
    private getPost(): void {
        PostService.getPostsById(this.classID, 997)
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
        PostService.getCommentsByPostId(997)
            .then((data) => {
                console.log(data);
                this.commentData = data.comment_list;
            });
    }

    private popupChange( value: boolean ) {
        this.$emit('change', value);
    }

}
