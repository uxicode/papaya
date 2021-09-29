import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IKeepPostList} from '@/views/model/my-class.model';
import {PostService} from '@/api/service/PostService';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';
import WithRender from './Bookmark.html';
import {ScheduleService} from '@/api/service/ScheduleService';
import {getAllPromise} from '@/types/types';
import {IScheduleTotal} from '@/views/model/schedule.model';

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
    private postItems: IKeepPostList[]=[];
    private scheduleItems: any[] = [];

    @MyClass.Action
    private KEEP_POST_LIST_ACTION!: ()=> Promise<IKeepPostList[]>;

    get myPostLists(): IKeepPostList[] {
        return this.postItems;
    }

    get myScheduleLists(): IScheduleTotal[] {
        return this.scheduleItems;
    }

    public created() {
        this.getMyPosts();
    }

    /**
     * 보관된 알림 가져오기
     * @public
     */
    public getMyPosts(): void {
        this.KEEP_POST_LIST_ACTION().then((data: IKeepPostList[]) => {
            this.postItems = data;
            // console.log(this.postItems);
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
        ScheduleService.getKeepSchedule()
          .then((data)=>{
              // console.log(data);
              /*data.keep_classschedule_list=[{
              class_id: 750
              createdAt: "2021-07-21 19:12:29"
              evt_endAt: "Invalid date"
              evt_startAt: "Invalid date"
              id: 200
              repeat_index: 0
              repeat_type: 0
              schedule_id: 2006
              user_id: 250}]*/
              // this.scheduleItems
              // 일정을 삭제하면 보관된 일정에 해당 일정이 있다면 같이 삭제 되어야 하는 데 삭제되지 않고 그냥 남아 있게 되는 에러가 있다.
              // 하여 아래에 보관된 일정내용이 디테일 하게 저장되어 있지 않기에 개별로 일정 데이터를 하나하나 조회해서 저장해 둬야 하는 데
              // 이때 이미 삭제된 일정 중 보관된 일정은 서로 매칭이 안되기에 조회시에 없는 일정이라고 나올 수 밖에 없다.
              const keepData=data.keep_classschedule_list;
              if (keepData.length > 0) {
                  const promiseInfo: any = [];
                  keepData.forEach( (item: any)=> {
                     const {class_id, schedule_id}=item;
                     return promiseInfo.push( ScheduleService.getScheduleById( class_id, schedule_id ) );
                  });

                  getAllPromise( promiseInfo )
                    .then(( readData: any )=>{
                        console.log(readData);

                        this.scheduleItems=readData.map(( item: any )=>item.schedule);
                    });
              }
          });

    }

    /**
     * 보관함 비우기 팝업 열기
     * @private
     */
    private resetModalOpen(): void {
        this.isPostsResetModal = !this.isPostsResetModal;
    }

    /**
     * 알림 보관(북마크) 해제
     * @param item
     * @private
     */
    private bookmarkDelete(item: IKeepPostList): void {
        const postId = item.user_keep_class_posts[0].id;
        PostService.deleteKeepPost(postId)
            .then(() => {
                console.log(`${postId} 알림 해제`);
            });
        const findIdx = this.myPostLists.findIndex((data) => data.user_keep_class_posts[0].id === postId);
        this.myPostLists.splice(findIdx, 1);
        this.closeToggle();
    }

    /**
     * 더보기 버튼 클릭시 토글 메뉴 열기
     * @param tabIndex
     * @param idx
     * @private
     */
    private listPopupToggle(tabIndex: number, idx: number): void {
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

    private async onClearKeepData() {
        //현재 탭이 보관된 일정일 경우
        if (this.tabIndex === 1) {
            await ScheduleService.deleteKeepAllSchedule()
              .then(()=>{
                  this.isPostsResetModal = false;
                  alert('보관된 일정이 모두 보관 해제 되었습니다.');
              });
            await ScheduleService.getKeepSchedule()
              .then((data)=>{
                  this.scheduleItems = [...data.keep_classschedule_list];
              });
        }
        //this.isPostsResetModal = false
    }

    private gotoSchedule() {
        this.$router.push({path: '/'});
    }
}
