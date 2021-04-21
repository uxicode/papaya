import MyClassService from '@/api/service/MyClassService';
import {IClassInfo, IClassMembers} from '@/views/model/my-class.model';
import {
    resetSearchInput,
    searchKeyEventObservable,
    searchUserKeyValueObservable
} from '@/views/service/search/SearchService';
import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import WithRender from './ClassMember.html';

const MyClass = namespace('MyClass');

@WithRender
@Component({
    components:{
        Modal,
        Btn,
    }
})
export default class ClassMember extends Vue{
    @MyClass.Getter
    private classID!: number;

    @MyClass.Getter
    private myClassHomeModel!: IClassInfo;

    get memberID(): any {
        return this.myClassHomeModel;
    }

    get loadingModel() {
        return this.isLoading;
    }

    get searchResults(): object {
        return this.searchResultItems;
    }

    /* 운영자/스탭/일반 멤버 토글 상태값 */
    private isAdminToggle: boolean = false;
    private isStaffToggle: boolean = false;
    private isMemberToggle: boolean = false;

    private isInvitePopup: boolean = false;
    private isSnackbar: boolean = false;
    private isDetailPopup: boolean = false;
    private isBlockModal: boolean = false;
    private isBanModal: boolean = false;

    private memberLevel: number = 0;
    private totalMemberNum: number = 0;

    private classMembers: IClassMembers[] = [];
    private adminList: IClassMembers[] = [];
    private staffList: IClassMembers[] = [];
    private memberList: IClassMembers[] = [];

    /* 멤버 검색 관련 */
    private searchValue: string = '';
    private isLoading: boolean = false;
    private searchResultItems: [] = [];

    public created() {
        this.getClassMembers();
        this.getClassMemberLevel();
        this.search();
    }

    /**
     * 전체 멤버 리스트를 가져와서 등급별로 나눈다.
     * @private
     */
    private getClassMembers(): void {
        MyClassService.getClassInfoById(this.classID)
          .then((data) => {
              this.adminList = data.classinfo.class_members.filter(
                (item: IClassMembers) => item.level === 1);
              this.staffList = data.classinfo.class_members.filter(
                (item: IClassMembers) => item.level === 2);
              this.memberList = data.classinfo.class_members.filter(
                (item: IClassMembers) => item.level === 3);

              this.totalMemberNum = data.classinfo.class_members.length;
              this.classMembers = data.classinfo.class_members;
              console.log(this.classMembers);
          });
    }

    private getClassMemberLevel(): void {
        MyClassService.getClassMemberInfo(this.classID, this.memberID.me.id)
          .then((data) => {
            //console.log(data.member_info);
            this.memberLevel = data.member_info.level;
            //console.log(this.memberLevel);
          });
    }

    /**
     * 멤버 등급에 따른 아이콘 클래스 바인딩
     * @param level
     * @private
     */
    private memberLevelIcon(level: number): string {
        switch (level) {
            case 1:
                return 'admin';
            case 2:
                return 'staff';
            default:
                return 'member';
        }
    }

    /**
     * 멤버 등급 텍스트
     * @param level
     * @private
     */
    private memberLevelTxt(level: number): string {
        switch (level) {
            case 1:
                return '운영자';
            case 2:
                return '스탭 멤버';
            default:
                return '일반 멤버';
        }
    }

    /**
     * 멤버 초대 링크 복사
     * @private
     */
    private copyLink(): void {
        const copyText = document.getElementById('inviteLink');
        // @ts-ignore
        copyText.select();
        document.execCommand('copy');
        // @ts-ignore
        copyText.setSelectionRange(0, 0);
        this.isSnackbar = true;
    }

    /**
     * 멤버 초대 팝업 닫기
     * @private
     */
    private closeInvitePopup(): void {
        this.isInvitePopup = false;
        this.isSnackbar = false;
    }

    /**
     * 로딩바 체크 toggle
     * @private
     */
    private checkLoading(): void{
        this.isLoading=!this.isLoading;
    }

    private search(){
        this.searchValue = '';
        this.searchResultItems=[];

        //$nextTick - 해당하는 엘리먼트가 화면에 렌더링이 되고 난 후
        this.$nextTick( ()=>{

            //키가 눌렸을 때 체크 Observable
            // targetInputSelector: string
            const keyup$ = searchKeyEventObservable('#searchMember');

            //사용자가 입력한 값 처리 Observable
            //obv$: Observable<any>, loadChk: ()=>void, promiseFunc: Promise<any>, isLoading: boolean
            const userInter$ = searchUserKeyValueObservable(keyup$, this.checkLoading, MyClassService.searchMembers, this.isLoading );
            userInter$.subscribe({
                next:( searchData: any ) =>{
                    console.log(searchData);
                    /*
                      message: "리스트 ....."
                      result_count: 2
                      results: (2) [{…}, {…}]
                      total: 2
                    */
                    console.log(searchData.class_member_list);
                    this.searchResultItems=searchData.class_member_list.map( ( item: any )=> item );
                },
            });

            //검색어 없을 시 리셋 Observable
            //obv$: Observable<any>, reset: ()=>void
            const reset$ = resetSearchInput(keyup$, ()=>{
                this.isLoading=false;
                this.searchResultItems = [];
            });
            reset$.subscribe();
        });
    }
}
