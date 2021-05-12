import {Vue, Component} from 'vue-property-decorator';
import MyClassService from '@/api/service/MyClassService';
import {namespace} from 'vuex-class';
import {IPostList} from '@/views/model/my-class.model';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';
import WithRender from './Bookmark.html';

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
    private tabIndex: number = 0;
    private postItems: IPostList[]=[];
    private myMemberLevel: number = 0;

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
            //console.log(this.postItems);
        });
    }

    /**
     * 알림이 온 클래스 내에서의 나의 멤버 등급 가져오기
     * @param idx
     * @private
     */
    private getLevelByPostItem(idx: number): void {
        // 알림 글마다 다른 클래스 아이디가 부여되어 있기 때문에
        // 멤버 변수가 아닌 지역 변수로 받는다.
        const classId = this.postItems[idx].class_id;
        MyClassService.getMyInfoInThisClass(classId)
          .then((data) => {
            this.myMemberLevel = data.result.level;
            //console.log(this.classInfo);
          });
    }

    /**
     * 알림 탭 열기
     * @private
     */
    private openPostTab(): void {
        this.tabIndex = 0;

    }

    /**
     * 일정 탭 열기
     * @private
     */
    private openScheduleTab(): void {
        this.tabIndex = 1;
    }

    /**
     * 보관함 비우기 팝업 열기
     * @private
     */
    private resetModalOpen(): void {
        this.isPostsResetModal = !this.isPostsResetModal;
    }

    /**
     * 더보기 버튼 클릭시 토글 메뉴 열기
     * @param tabIndex
     * @param idx
     * @private
     */
    private listPopupToggle(tabIndex: number, idx: number): void {
        this.getLevelByPostItem(idx);
        const bookmarkList = document.querySelectorAll('.bookmark-list');
        //console.log(bookmarkList.length);
        const listPopup = bookmarkList[tabIndex].querySelectorAll('.list-popup-menu');
        //console.log(listPopup.length);
        this.closeToggle(); // 열려있는 토글은 모두 닫는다.
        listPopup[idx].classList.toggle('active');
    }

    /**
     * 토글 메뉴 바깥 영역 클릭시 메뉴 닫기
     * @private
     */
    private closeToggle(): void {
        const listPopup = document.querySelectorAll('.bookmark-item .list-popup-menu');
        listPopup.forEach((item) => item.classList.remove('active'));
    }
}
