import {Vue, Component, Watch} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {
    resetSearchInput,
    searchKeyEventObservable,
    searchUserKeyValueObservable
} from '@/views/service/search/SearchService';
import MyClassService from '@/api/service/MyClassService';
import TxtField from '@/components/form/txtField.vue';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';
import WithRender from './ClassTagManage.html';

interface ITagInfo {
    id: number;
    class_id: number;
    keyword: string;
    updatedAt?: Date;
    createdAt?: Date;
}

const MyClass = namespace('MyClass');

@WithRender
@Component({
    components: {
        TxtField,
        Btn,
        Modal
    }
})

export default class ClassTagManage extends Vue {
    private tagList: ITagInfo[] = [];

    private isClassTagSearch: boolean = false;
    private isLoading: boolean = false;
    private searchTagValue: string = '';
    private searchResultItems: ITagInfo[] = [];

    @MyClass.Getter
    private classID!: number;

    get searchResultValue(): string{
        return this.searchTagValue;
    }

    get searchResults(): ITagInfo[] {
        return this.searchResultItems;
    }

    get loadingModel() {
        return this.isLoading;
    }

    // public created() {
    //     this.getClassTags();
    // }


    /**
     * 클래스 태그 가져오기(처음 실행시, 즉시 갱신)
     * @private
     */
    // immediate : 즉시 호출하겠다는 의미.
    // deep : object 내의 속성값까지 감시.
    // @Watch('감시할 변수', {immediate: true, deep: true})
    @Watch('tagList',{immediate: true, deep: false})
    private getClassTags(): void {
        //console.log('동적라우트값=' , this.$route.params.classId, this.classID);
        MyClassService.getClassTags(this.classID)
          .then((data) => {
              this.tagList = data.tag_list;
              //console.log(this.tagList);
          });
    }

    /**
     * 팝업 열기
     * @private
     */
    private openTagSearchPopup(): void{
        this.isClassTagSearch=true;
        this.search();
    }

    /**
     * 팝업 닫기
     * @private
     */
    private closeTagSearchPopup(): void{
        this.isClassTagSearch=false;
    }

    private search(){
        this.searchTagValue='';
        this.searchResultItems=[];

        //$nextTick - 해당하는 엘리먼트가 화면에 렌더링이 되고 난 후
        this.$nextTick( ()=>{

            //키가 눌렸을 때 체크 Observable
            // targetInputSelector: string
            const keyup$ = searchKeyEventObservable('#searchTag');

            //사용자가 입력한 값 처리 Observable
            //obv$: Observable<any>, loadChk: ()=>void, promiseFunc: Promise<any>, isLoading: boolean
            const userInter$ = searchUserKeyValueObservable(keyup$, this.checkLoading, { fn: MyClassService.searchTag, args: null} , this.isLoading );
            userInter$.subscribe({
                next:( searchData: any ) =>{
                    //console.log(searchData.tag_list);
                    this.searchResultItems=searchData.tag_list.map( ( item: any )=> item );
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
     * 검색어와 매칭되는 키워드만 볼드 처리
     * @param word
     * @private
     */
    private boldSearchResult( word: string): string{
        const startIndex=word.indexOf(this.searchResultValue);
        const endIndex=startIndex+this.searchResultValue.length;
        const searchResultWord=word.substr(startIndex, this.searchResultValue.length);
        return [word.slice(0, startIndex), `<strong>${searchResultWord}</strong>`, word.slice(endIndex, word.length)].join('');
    }

    /**
     * 로딩바 체크 toggle
     * @private
     */
    private checkLoading(): void{
        this.isLoading=!this.isLoading;
    }

    /**
     * autocomplete 로 검색된 리스트 중 하나를 클릭했을때 실행 -> 해당 클릭한 키워드값으로
     * @param name
     * @private
     */
    private applySearchResult(name: string): void {
        this.closeTagSearchPopup();
        this.searchTagValue=name;
        this.addTag(this.searchTagValue);
    }

    /**
     * 태그 이름 추가
     * @param val
     * @private
     */
    private addTag(val: string): void {
        MyClassService.addClassTag(this.classID, {keyword: val})
          .then((data) => {
              data.taginfo.keyword = val;
              console.log(`${data.taginfo.keyword} 태그 추가 완료`);
          });
    }

    /**
     * 클래스 태그 삭제
     * @param tagId
     * @private
     */
    private deleteTag(tagId: number): void {
        MyClassService.deleteTag(this.classID, tagId)
          .then(() => {
             console.log(`${tagId} 태그 삭제 완료`);
          });
    }

    /**
     * 뒤로가기
     * @private
     */
    private goBack(): void {
        this.$router.push('./')
            .then();
    }

    /**
     * 태그 수정 취소
     * @private
     */
    private tagModifyCancel(): void {
        this.goBack();
    }

    /**
     * 태그 수정 저장
     * @private
     */
    private tagModifySave(): void {

        this.goBack();
    }
}
