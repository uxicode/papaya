import MyClassService from '@/api/service/MyClassService';
import UserService from '@/api/service/UserService';
import {IClassInfo, IClassMemberList, IClassMembers, IQuestionList} from '@/views/model/my-class.model';
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

    /* 전체 멤버 리스트 */
    private classMemberList: IClassMembers[] = [];
    private memberLevel: number = 0;

    /* 멤버 검색 관련 */
    private searchWord: string = '';
    private searchValue: object = {};
    private isLoading: boolean = false;
    private searchResultItems: [] = [];

    /* 운영자/스탭/일반 멤버 토글 상태값 */
    private isAdminToggle: boolean = false;
    private isStaffToggle: boolean = false;
    private isMemberToggle: boolean = false;
    private isInvitePopup: boolean = false;
    private isSnackbar: boolean = false;
    private isDetailPopup: boolean = false;
    private isBlockModal: boolean = false;
    private isBlockCompleteModal: boolean = false;
    private isBanModal: boolean = false;
    private isBanCompleteModal: boolean = false;

    /* 멤버정보 상세 팝업 */
    private nickname: string = '';
    private detailMemberNum: number = 0;
    private userIdNum: number = 0;
    private mobileNo: number = 0;
    private userId: string = '';
    private email: string = '';
    private memberId: number = 0;
    private qnaList: IQuestionList[] = [];
    private isActive: boolean = false;

    public created() {
        this.getClassMembers();
        this.getClassMemberLevel();
        //this.search();
    }

    /**
     * 전체 멤버 리스트를 가져온다.
     * @private
     */
    private getClassMembers(): void {
        MyClassService.getClassInfoById(this.classID)
          .then((data) => {
              // 가입 승인된 멤버만 불러온다.
              this.classMemberList = data.classinfo.class_members.filter(
                (item: IClassMembers) => item.status === 1);
              console.log(this.classMemberList);
          });
    }

    /**
     * 등급별로 멤버 리스트를 구분
     * @param level
     * @private
     */
    private classifyLevel(level: number): IClassMembers[] {
        return this.classMemberList.filter(
          (item: IClassMembers) => item.level === level
        );
    }

    /**
     * 권한별로 더보기 메뉴가 다르기 때문에
     * 나의 멤버 등급을 가져온다.
     * @private
     */
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

    private search(value: string = ''){
        this.searchWord=( value!=='' )? value : '';
        //this.searchValue = {classId: this.classID, searchWord: this.searchWord};
        console.log(this.searchValue);
        this.searchResultItems=[];

        //$nextTick - 해당하는 엘리먼트가 화면에 렌더링이 되고 난 후
        this.$nextTick( ()=>{

            const searchMember = document.querySelector('#searchMember') as HTMLInputElement;
            // console.log(searchSchool);
            searchMember.focus();

            if (searchMember.value !== '') {
                this.checkLoading();
                // const valueToSearch$=fromEvent(searchSchool, 'input');
                MyClassService.searchMembers({classId: this.classID, searchWord: this.searchWord})
                  .then((data: any) => {
                      this.checkLoading();
                      this.searchResultItems = data.results.map((item: any) => item);
                  });
            }

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

    /**
     * 멤버 프로필 상세 팝업 열면서 해당 멤버의 정보 불러온다.
     * @param id
     * @param level
     * @param nickname
     * @private
     */
    private detailPopupOpen(userId: number, level: number, nickname: string, memberId: number): void {
        this.userIdNum = userId;
        this.isDetailPopup = true;
        this.detailMemberNum = level;
        this.nickname = nickname;
        this.memberId = memberId;
        UserService.getUserInfo(userId)
          .then((data) => {
              this.mobileNo = data.user.mobile_no;
              this.userId = data.user.user_id;
              this.email = data.user.email;
          });
        this.getMemberQna(this.memberId);
    }

    /**
     * 멤버 프로필 상세 팝업 내에 들어가는 질문 답변 가져오기
     * @param memberId
     * @private
     */
    private getMemberQna(memberId: number): void {
        MyClassService.getMemberClassQnA(this.classID, memberId)
          .then((data) => {
              this.qnaList = data.qnalist;
          });
    }

    /**
     * 멤버 차단 / 강제탈퇴 팝업 오픈시 해당 멤버의 정보를 불러온다.
     * @private
     */
    // private getMemberInfo(): void {
    //
    // }

    /**
     * 멤버 차단 팝업 열기
     * @private
     */
    private blockModalOpen(id: number): void {
        this.isActive = false;
        this.isBlockModal = true;
        this.memberId = id;
        // this.getMemberInfo();
    }

    /**
     * 멤버 차단 전송
     * @private
     */
    private memberBlockSubmit(): void {
        this.isBlockModal = false;
        this.isBlockCompleteModal = true;
        MyClassService.blockClassMember(this.classID, this.memberId)
          .then(() => {
              console.log(`${this.memberId} 멤버 차단 완료`);
          });
    }

    /**
     * 멤버 강제 탈퇴 팝업 열기
     * @private
     */
    private banModalOpen(id: number): void {
        this.isActive = false;
        this.isBanModal = true;
        this.memberId = id;
        // this.getMemberInfo();
    }
}