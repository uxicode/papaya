import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IClassInfo, IClassMemberInfo, IQnaInfo, IQuestionInfo} from '@/views/model/my-class.model';
import ClassMemberService from '@/api/service/ClassMemberService';
import MyClassService from '@/api/service/MyClassService';
import UserService from '@/api/service/UserService';
import {
    resetSearchInput,
    searchKeyEventObservable,
    searchUserKeyValueObservable
} from '@/views/service/search/SearchService';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import WithRender from './ClassMember.html';

const MyClass = namespace('MyClass');

interface IAccordionList {
    listTit: string;
    level: number;
    active: boolean;
}

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

    get classInfo(): any {
        return this.myClassHomeModel;
    }

    get loadingModel() {
        return this.isLoading;
    }

    get searchResults(): object {
        return this.searchResultItems;
    }

    private myMemberLevel: number = 0; // 내 멤버 등급

    /* 전체 멤버 리스트 */
    private classMemberList: IClassMemberInfo[] = [];
    private totalMemberNum: number = 0;

    /* 멤버 검색 관련 */
    private searchValue: string = '';
    private isLoading: boolean = false;
    private searchResultItems: [] = [];

    /* 운영자/스탭/일반 멤버 토글 상태값 */
    private isInvitePopup: boolean = false;
    private isSnackbar: boolean = false;
    private isDetailPopup: boolean = false;
    private isDetailAccordion: boolean = true;
    private isBlockModal: boolean = false;
    private isBlockCompleteModal: boolean = false;
    private isBanModal: boolean = false;
    private isBanCompleteModal: boolean = false;

    /* 멤버정보 상세 팝업 */
    private nickname: string = '';
    private memberLevel: number = 0;
    private userIdNum: number = 0;
    private mobileNo: number = 0;
    private userId: string = '';
    private email: string = '';
    private memberId: number = 0;
    private qnaList: IQnaInfo[] = [];
    private isActive: boolean = false;

    /* 아코디언 리스트 관련(스탭 멤버, 일반 멤버) */
    private accordionList: IAccordionList[] = [
        {
            listTit: '스탭 멤버',
            level: 2,
            active: true
        },
        {
            listTit: '일반 멤버',
            level: 3,
            active: true
        }
    ];

    public created() {
        this.getAllClassMembers();
        this.getMyMemberLevel();
        //this.search();
    }

    /**
     * 전체 멤버 리스트를 가져온다.
     * @private
     */
    private getAllClassMembers(): void {
        MyClassService.getClassInfoById(this.classID)
          .then((data) => {
              // 가입 승인된 멤버만 불러온다.
              this.classMemberList = data.classinfo.class_members.filter(
                (item: IClassMemberInfo) => item.status === 1);
              console.log(this.classMemberList);
              this.totalMemberNum = this.classMemberList.length;
          });
    }

    /**
     * 등급별로 멤버 리스트를 구분
     * @param level
     * @private
     */
    private classifyLevel(level: number): IClassMemberInfo[] {
        return this.classMemberList.filter(
          (item: IClassMemberInfo) => item.level === level
        );
    }

    /**
     * 권한별로 더보기 메뉴가 다르기 때문에
     * 나의 멤버 등급을 가져온다.
     * @private
     */
    private getMyMemberLevel(): void {
        ClassMemberService.getClassMemberInfo(this.classID, this.classInfo.me.id)
          .then((data: any) => {
            this.myMemberLevel = data.member_info.level;
            console.log(this.myMemberLevel);
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
                return 'manager';
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

    private search(value: string){
        this.searchValue = (value === '') ? '' : value;
        this.classMemberList=[];

        //$nextTick - 해당하는 엘리먼트가 화면에 렌더링이 되고 난 후
        this.$nextTick( ()=>{

            //키가 눌렸을 때 체크 Observable
            // targetInputSelector: string
            const keyup$ = searchKeyEventObservable('#searchMember');

            //사용자가 입력한 값 처리 Observable
            //obv$: Observable<any>, loadChk: ()=>void, promiseFunc: Promise<any>, isLoading: boolean
            const userInter$ = searchUserKeyValueObservable(keyup$, this.checkLoading, { fn: ClassMemberService.searchMembers, args:[Number(this.classID)] }, this.isLoading );
            userInter$.subscribe({
                next:( searchData: any ) =>{
                    console.log(searchData);
                    /*
                      class_member_list: [{…}]
                      message: "클래스 멤버 조회"
                      total: 1
                    */
                    this.classMemberList=searchData.class_member_list.map( ( item: any )=> item );
                },
            });

            //검색어 없을 시 리셋 Observable
            //obv$: Observable<any>, reset: ()=>void
            const reset$ = resetSearchInput(keyup$, ()=>{
                this.isLoading=false;
                this.classMemberList = [];
            });
            reset$.subscribe();
        });
    }

    /**
     * 멤버 프로필 상세 팝업 열면서 해당 멤버의 정보 불러온다.
     * @param userId
     * @param level
     * @param nickname
     * @param memberId
     * @private
     */
    private detailPopupOpen(userId: number, level: number, nickname: string, memberId: number): void {
        this.userIdNum = userId;
        this.memberLevel = level;
        this.nickname = nickname;
        this.memberId = memberId;
        this.isDetailPopup = true;
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
        ClassMemberService.getMemberClassQnA(this.classID, memberId)
          .then((data) => {
              this.qnaList = data.qnalist;
          });
    }

    /**
     * 멤버 차단 팝업 열기
     * @private
     */
    private blockModalOpen(id: number): void {
        this.isActive = false;
        this.isBlockModal = true;
        this.memberId = id;
    }

    /**
     * 멤버 차단 전송
     * @private
     */
    private memberBlockSubmit(): void {
        this.isBlockModal = false;
        this.isBlockCompleteModal = true;
        ClassMemberService.setBlockClassMember(this.classID, this.memberId)
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
    }

    /**
     * 멤버 강제 탈퇴
     * @private
     */
    private banMember(): void {
        this.isBanModal = false;
        ClassMemberService.deleteClassMemberByAdmin(this.classID, this.memberId)
            .then((data) => {
                const findIdx = this.classMemberList.findIndex((ele) => ele.id === data.user_id);
                this.classMemberList.splice(findIdx, 1);
            });
        this.isBanCompleteModal = true;
    }
}
