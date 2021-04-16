import {Vue, Component, Prop} from 'vue-property-decorator';
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

interface ITagList {
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
    private tagList: ITagList[] = [];

    private isClassTagSearch: boolean = false;
    private isLoading: boolean = false;
    private searchTagValue: string = '';
    private searchResultItems: [] = [];

    @MyClass.Getter
    private classID!: number;

    get searchResultValue(): string{
        return this.searchTagValue;
    }

    get searchResults(): [] {
        return this.searchResultItems;
    }

    get loadingModel() {
        return this.isLoading;
    }

    public created() {
        this.getClassTags();
    }

    /**
     * 클래스 태그 가져오기
     * @private
     */
    private getClassTags(): void {
        console.log('동적라우트값=' , this.$route.params.classId, this.classID);
        MyClassService.getClassTags(this.classID)
          .then((data) => {
              this.tagList = data.tag_list;
              console.log(this.tagList);
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
            const keyup$ = searchKeyEventObservable('#searchSchool');

            //사용자가 입력한 값 처리 Observable
            //obv$: Observable<any>, loadChk: ()=>void, promiseFunc: Promise<any>, isLoading: boolean
            const userInter$ = searchUserKeyValueObservable(keyup$, this.checkLoading, MyClassService.getSearchSchool, this.isLoading );
            userInter$.subscribe({
                next:( searchData: any ) =>{
                    // console.log(searchData);
                    /*
                      message: "리스트 ....."
                      result_count: 2
                      results: (2) [{…}, {…}]
                      total: 2
                    */
                    this.searchResultItems=searchData.results.map( ( item: any )=> item );
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

    private tagSearch(searchText: string): void {
        MyClassService.searchTag(searchText)
          .then((data: ITagList) => {
             console.log(data);
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
}
