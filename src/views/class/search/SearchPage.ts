import {Vue, Component} from 'vue-property-decorator';
import MyClassService from '@/api/service/MyClassService';
import ImageSettingService from '@/views/service/profileImg/ImageSettingService';
import TxtField from '@/components/form/txtField.vue';
import WithRender from './SearchPage.html';
import {
  resetSearchInput,
  searchKeyEventObservable,
  searchUserKeyValueObservable
} from '@/views/service/search/SearchService';


const SEARCH_TYPE={
  HOME:'home',
  INPUT:'input',
  RESULT:'result'
};

@WithRender
@Component({
  components:{
    TxtField
  }
})
export default class SearchPage extends Vue {

  public isLoading: boolean= false;
  private recommandItems: any[] = [];
  private bestItems: any[] = [];
  private searchValue: string = '';
  private searchItems: any[]=[];
  private searchType: string = 'home';

  get bestItemsModel() {
    return this.bestItems;
  }

  get recommandItemsModel() {
    return this.recommandItems;
  }

  get isLandingPage() {
    return this.searchType === SEARCH_TYPE.HOME;
  }

  get isSearch() {
    return this.searchType === SEARCH_TYPE.INPUT;
  }

  get isSearchResult() {
    return this.searchType === SEARCH_TYPE.RESULT;
  }

  public created() {
    this.getSearchHome();
  }

  public mounted() {
    setTimeout(() => {
      const searchInput=document.querySelector('#searchInput') as HTMLInputElement;
      searchInput.focus();
    }, 1000);
  }

  private getSearchHome() {
    MyClassService.getSearchHome()
      .then( (data)=>{
        // console.log(data);
        this.bestItems=data.best_classlist;
        this.recommandItems=data.recommended_keywords;

        console.log(this.bestItems );
      });
  }

  private getProfileImg(imgUrl: string | null | undefined ): string{
    return ImageSettingService.getProfileImg( imgUrl );
  }

  private getHashTag( items: string[] ): string | undefined {
    if( !items ){ return; }
    // console.log(' items=',  items)
    if( items.length === 0 ){ return; }
    const keywords= items.map( ( prop: any ) => '#' + prop.keyword) ;
    return keywords.join(' ');
  }

  private gotoLink(item: any): void {
    this.$router.push('/class/enrollClass').then(() => {
      console.log(item.class.g_name, '으로 이동');
    });
  }

  // 트랜지션을 시작할 때 인덱스 * 100 ms 만큼의 딜레이를 적용합니다.
  private beforeEnterBestItem(el: HTMLElement): void {
    if(el.dataset.index !=='0'){
      // el.classList.add('skeleton-inner');
      // console.log(this.startNum, this.endNum);
      this.isLoading=true;
      el.style.transitionDelay =this.delayTime(300, String( el.dataset.index ), this.recommandItems.length);
    }
  }

  // 트랜지션을 시작할 때 인덱스 * 100 ms 만큼의 딜레이를 적용합니다.
  private beforeEnterKeywords(el: HTMLElement): void {
    if(el.dataset.index !=='0'){
      // el.classList.add('skeleton-inner');
      // console.log(this.startNum, this.endNum);
      // this.isLoading=true;
      el.style.transitionDelay = this.delayTime(120, String( el.dataset.index ), this.recommandItems.length);
    }
  }

  private afterEnter(el: HTMLElement): void {
    this.isLoading=false;
    el.style.transitionDelay = '';
  }

  private delayTime(speed: number, idx: string | number, len: number): string {
    const delay = (typeof idx === 'string') ? parseInt(idx as string, 10) : idx;
    return speed * (delay % len) + 'ms';
  }

  private watchBySearchModel(val: string) {
    this.searchValue = val;

    this.searchType = (this.searchValue !== '') ? SEARCH_TYPE.INPUT : SEARCH_TYPE.HOME;
    if (this.searchType === SEARCH_TYPE.INPUT) {
      this.search();
    }

  }

  private schoolNameSearchKeyEnter() {
    // console.log(this.searchSchoolValue);
    // this.openPopupStatus=true;

    // this.search();
   //classlist
    //total  ??
  }

  private search(){
    // this.searchSchoolValue=( value!=='' )? value : '';
    console.log(this.searchValue);
    this.searchItems=[];

    //$nextTick - 해당하는 엘리먼트가 화면에 렌더링이 되고 난 후
    this.$nextTick( ()=>{

      const searchClassInput= document.querySelector('#searchInput') as HTMLInputElement;
      // console.log(searchSchool);
      searchClassInput.focus();

      // console.log( searchSchool.value )
      //키가 눌렸을 때 체크 Observable
      // targetInputSelector: string
      const key$ = searchKeyEventObservable('#searchInput');

      const userInter$ =searchUserKeyValueObservable( key$, this.changeLoaded, { fn: MyClassService.getSearchResult, args: null}, this.isLoading);
      userInter$.subscribe({
        next:( data: any ) =>{
          // console.log( data.classlist );
          this.searchItems= data.classlist
            .map( ( item: any )=> item )
            .filter( (item: any )=> {
              // console.log(item.g_name.match( this.searchValue ), item.name.match( this.searchValue ), this.searchValue );
              return item.name.match( this.searchValue )!==null;
            });
        },
      });

      //검색어 없을 시 리셋 Observable
      //obv$: Observable<any>, reset: ()=>void
      const reset$ = resetSearchInput( key$, ()=>{
        this.isLoading=false;
        this.searchItems = [];
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
    const startIndex=word.indexOf(this.searchValue);
    const endIndex=startIndex+this.searchValue.length;
    const searchResultWord=word.substr(startIndex, this.searchValue.length);
    return [word.slice(0, startIndex), `<strong>${searchResultWord}</strong>`, word.slice(endIndex, word.length)].join('');
  }

  private applySearchResult( name: string): void {
    // this.closeSchoolSearchPopup();
    // this.searchSchoolValue=name;
    // this.changeSchoolNameValue(this.searchSchoolValue);
    // this.getSchoolNameInput('searchSchool');
   this.searchType=SEARCH_TYPE.RESULT;
  }


  private changeLoaded(): void{
    this.isLoading=!this.isLoading;
  }






}
