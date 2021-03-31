import {IPostList} from '@/views/model/my-class.model';
import {Vue, Component, Prop} from 'vue-property-decorator';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';
import WithRender from './Bookmark.html';
import {namespace} from 'vuex-class';

const MyClass = namespace('MyClass');

@WithRender
@Component({
    components:{
        Btn,
        Modal,
    },
})

export default class Bookmark extends Vue {
    private isPostsResetModal: boolean = false;
    private bookmarkType: string = 'notification';
    private isMoreMenu: boolean = false;
    private postItems: IPostList[]=[];

    @MyClass.Action
    private POST_LIST_ACTION!: ()=> Promise<IPostList[]>;

    get myPostLists(): IPostList[] {
        return this.postItems;
    }

    public created() {
        this.getMyPosts();
    }

    /**
     * 보관된 알림 가져오기
     * @public
     */
    public getMyPosts(): void {
        this.POST_LIST_ACTION().then((data: IPostList[]) => {
            this.postItems = data;
        });
    }

    /**
     * 보관함 비우기 팝업 열기
     * @private
     */
    private resetModalOpen(): void {
        this.isPostsResetModal = !this.isPostsResetModal;
    }

    private moreMenuToggle(): void {
        this.isMoreMenu = !this.isMoreMenu;
    }
}