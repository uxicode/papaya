import {Component, Vue} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import { IPostInLinkModel, IPostModel} from '@/views/model/post.model';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';
import AddNotifyPopup from '@/views/class/notification/AddNotifyPopup';
import NotificationListView from '@/views/class/notification/NotificationListView';
import {CommentService} from '@/api/service/CommentService';
import {getAllPromise} from '@/types/types';
import WithRender from './AllNotify.html';
import {IMyClassList} from '../model/my-class.model';
import ImageSettingService from '../service/profileImg/ImageSettingService';

const MyClass = namespace('MyClass');
const Post = namespace('Post');

@WithRender
@Component({
    components:{
        Modal,
        Btn,
        AddNotifyPopup,
        NotificationListView
    }
})
export default class AllNotify extends Vue {

    ///// 추가된 목록 /////////
    @MyClass.Mutation
    private SET_CLASS_ID!: (id: number) => void;

    @MyClass.Action
    private MYCLASS_LIST_ACTION!: () => Promise<IMyClassList[]>;
    //// 추가된 목록 /////////

    @Post.Action
    private GET_POST_LIST_ACTION!: (  payload: { classId: number, paging: {page_no: number, count: number } }) => Promise<IPostModel[] & IPostInLinkModel[]>;

    @Post.Action
    private GET_RESERVED_LIST_ACTION!: (classId: number) => Promise<any>;

    @Post.Action
    private DELETE_POST_ACTION!: (payload: { classId: string | number, postId: number })=>Promise<any>;


    ///// 추가된 목록 /////////
    @MyClass.Getter
    private myClassLists!: IMyClassList[];
    ///// 추가된 목록 /////////


    @MyClass.Getter
    private classID!: string | number;

    @Post.Getter
    private postListItems!: IPostModel[] & IPostInLinkModel[];

    @Post.Getter
    private reservedItems!: IPostModel[] & IPostInLinkModel[];

    @Post.Getter
    private reservedTotalItem!: number;


    // private postListItems: IPostModel[] & IPostInLinkModel[]= [];
    // private reservedItems: any[] = [];
    private reservedTotal: number=0;
    private isAddPopupOpen: boolean=false;
    private commentsTotalItems: any[] = [];

    private isPageLoaded: boolean=false;

    //datepicker
    private startDatePickerModel: string= new Date().toISOString().substr(0, 10);
    private startDateMenu: boolean=false;
    private isReservedChk: boolean=false;

    ///// 추가된 목록 /////////
    private sideMenuActiveNum: number = -1;
    private currentClassId: number = -1;
    ///// 추가된 목록 /////////


    get reservedChk(): boolean {
        return this.isReservedChk;
    }

    get postListItemsModel() {
        return this.postListItems;
    }

    get commentsTotalItemsModel() {
        return this.commentsTotalItems;
    }

    ///// 추가된 목록 /////////
    get myAllClassListModel(): IMyClassList[] {
        return this.myClassLists;
    }
    ///// 추가된 목록 /////////



    public async created() {
        console.log( this.$route.query.sideNum );
        if (this.$route.query.sideNum && this.$route.query.sideNum !== '') {
            this.$emit('sideNum', Number(this.$route.query.sideNum));
        }

        await this.MYCLASS_LIST_ACTION()
          .then((data: IMyClassList[]) => {
              /*data.map( (item: IMyClassList )=>{
                console.log(item.me, item );
              });*/
          });

        await this.getList().then(
          ()=>{
              this.isPageLoaded=true;
          }
        );
    }

    public getProfileImg(imgUrl: string | null | undefined): string {
        //프로필 이미지를 세팅 하는 데 있어서 click 등의 이벤트로 인해 데이터 바인딩 즉, 썸네일 이미지가 매번 갱신 된다.
        //따라서 v-once 디렉티브를 사용하여 데이터 변경 시 업데이트 되지 않는 일회성 보간을 수행할 수 있지만, 같은 노드의 바인딩에도 영향을 미친다는 점을 유의해야 합니다.
        const resultURL = (imgUrl) ? imgUrl : 'profile-class.png';
        return ImageSettingService.getProfileImg(resultURL);
    }


    /**
     * 클릭 이벤트 핸들러 - 모든 클래스 알림 메뉴
     * @private
     */
    private onClassAllNotifyList() {
        this.sideMenuActiveNum = -1;
        this.currentClassId = -1;
        /*this.getAllScheduleList()
          .then(() => {
              // console.log('캘린더 로드 완료.', this.events);
              this.updateAllScheduleEvent();
          });*/
    }

    /**
     * 클릭 이벤트 핸들러 - 개별 클래스 알림 메뉴
     * @param item
     * @param index
     * @private
     */
    private onClassNotifyList(item: IMyClassList, index: number) {
        this.sideMenuActiveNum = index;
        this.currentClassId = item.id;
        this.SET_CLASS_ID(this.currentClassId);

        this.getList().then(
          ()=>{
              this.isPageLoaded=true;
          });
       /* this.getClassScheduleListById(item.id)
          .then(() => {
              // console.log('클래스별 리스트 호출', this.events);
              this.updateClassScheduleEvent();
          });*/
    }


    private getAllNotifyList() {

    }

    private async getList() {
        //알림 가져오기
        await this.GET_POST_LIST_ACTION({classId: Number( this.classID ), paging:{page_no:1, count:100} });

        //예약된 알림 가져오기.
        await this.GET_RESERVED_LIST_ACTION(Number(this.classID));

        //댓글 총 개수 가져옴
        await getAllPromise( this.getAllCommentsPromiseResult() )
          .then((data) => {
              // console.log(data);
              const comments=data.map(( item)=>{
                  return {
                      id: item.post_id,
                      total : item.total
                  };
              });
              this.commentsTotalItems = [...comments];
          });
    }


    private isOwner( ownerId: number, userId: number): boolean {
        return (ownerId === userId);
    }
    /**
     * 댓글 총 개수 api 배열에 담아 두기.
     * @private
     */
    private getAllCommentsPromiseResult() {
        // const commentTotalItems: Array<{ total: any; postId: number, id: number; }> = [];
        const totalPromise: Array<Promise<any>> = [];
        this.postListItems.forEach((item: IPostModel) => {
            totalPromise.push( CommentService.getCommentsByPostId(item.id) );
        });
        return totalPromise;
    }

    /**
     * datepicker 닫기 참조
     * @private
     */
    private startDatePickerChange( ) {
        this.startDateMenu = false;
        // console.log(this.startDatePickerModel);
    }

    private onAddPostPopupStatus(value: boolean) {
        this.isAddPopupOpen=value;
    }

    private onAddPost(value: boolean) {
        this.isAddPopupOpen=value;
    }

    private onAddPostPopupOpen() {
        this.isAddPopupOpen=true;
    }

    private onReservedMenuDownUp() {
        this.isReservedChk=!this.isReservedChk;
    }

    /**
     * 예약 알림 제거
     * @param postIdx
     * @private
     */
    private async onDeleteReservedByPostId(postIdx: number) {
        await this.DELETE_POST_ACTION( {classId: this.classID, postId: postIdx})
          .then((data)=>{
              alert('예약된 알림이 제거 되었습니다.');
          });
        await this.GET_RESERVED_LIST_ACTION(Number(this.classID));
    }

    private onDetailPostOpen(id: number) {
        console.log('클릭');
    }

}
