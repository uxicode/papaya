import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {ISearchModel} from '@/views/model/search.model';
import ImageSettingService from '@/views/service/profileImg/ImageSettingService';
import RadioButton from '@/components/radio/RadioButton.vue';
import WithRender from './SearchResultPage.html';
import {SearchApiService} from '@/api/service/SearchApiService';

const SearchStatus = namespace('SearchStatus');


@WithRender
@Component({
  components:{
    RadioButton
  }
})
export default class SearchResultPage extends Vue {

  // public isLoading: boolean= false;
  private searchResults: any[]=[];
  private radioItems: any[] = [
    { idx:0, name:'전체', value:'all'},
    { idx:1, name:'소속기관', value:'union'},
    { idx:2, name:'클래스', value:'class'},
    { idx:3, name:'태그', value:'tag'}
  ];
  private radioValue: string = '';
  private pageCount: number=1;
  private pageItems: number[] = [];
  private numOfPage: number=10;
  private pageSize: number=5;
  private totalPageCount: number=-1;


  @SearchStatus.Getter
  private keyword!: string;

  @SearchStatus.Getter
  private searchTotal!: number;

  @SearchStatus.Getter
  private searchResultData!: ISearchModel[];

  get searchResultsModel(): any[]{
    if( this.radioValue ==='union'){
      this.searchResults=[...this.searchResultData.filter( (item: any )=> item.g_name.match( this.keyword )!==null ) ];
    }else if( this.radioValue ==='class'){
      this.searchResults=[...this.searchResultData.filter( (item: any )=> item.name.match( this.keyword )!==null) ];
    }else if( this.radioValue==='tag'){
      this.searchResults=[...this.searchResultData.filter( (item: any )=> {
        return ( item.class_tags!==undefined) && ( item.class_tags.filter((target: any) =>target.keyword.match(this.keyword) !== null) );
      }) ];
    }else{
      this.searchResults = [...this.searchResultData];
    }
    return this.searchResults;
  }

  private getSearchResultList( payload: {page_no: number, count: number}) {
    //SearchApiService.getSearchResult

  }

  private getProfileImg(imgUrl: string | null | undefined ): string{
    return ImageSettingService.getProfileImg( imgUrl );
  }

  private getHashTag( items: string[] ): string | undefined {
    if( !items ){ return; }
    // console.log(' items=',  items)
    // if( items.length === 0 ){ return; }
    const keywords= items.map( ( prop: any ) => '#' + prop.keyword) ;
    return keywords.join(' ');
  }

  private gotoLink(item: any): void {
    this.$router.push( {path:'/class/enrollClass'} ).then(() => {
      console.log(item.class.g_name, '으로 이동');
    });
  }


  // 트랜지션을 시작할 때 인덱스 * 100 ms 만큼의 딜레이를 적용합니다.
  private beforeEnter(el: HTMLElement): void {
    if(el.dataset.index !=='0'){
      // el.classList.add('skeleton-inner');
      // console.log(this.startNum, this.endNum);
      // this.isLoading=true;
      el.style.transitionDelay = this.delayTime(120, String( el.dataset.index ), this.searchResults.length);
    }
  }

  private afterEnter(el: HTMLElement): void {

    // this.isLoading=false;
    el.style.transitionDelay = '';
  }

  private delayTime(speed: number, idx: string | number, len: number): string {
    const delay = (typeof idx === 'string') ? parseInt(idx as string, 10) : idx;
    return speed * (delay % len) + 'ms';
  }

  private optionChange( value: string, checked: boolean ): void{
    // console.log(value, checked);
    this.radioValue=value;
  }

  private mounted() {
    // this.createPaging();
  }

/*
  private createPaging() {
    this.totalPageCount = this.getTotalPageCount({total: 134, numOfPage: this.numOfPage});
    this.pageItems=[...this.getPageNum( {totalPageCount: this.totalPageCount, pageSize: this.pageSize, curPageNum:this.pageCount }) ];
    // console.log(this.pageItems);
  }

  /!**
   * 총 페이지 카운트 구하기
   * @param paging
   * @private
   *!/
  private getTotalPageCount( paging: {total: number, numOfPage: number}): number {
    const { total, numOfPage } = paging;
    const reminderValue=( total%numOfPage === 0)? 0 : 1;
    return parseInt(`${total / numOfPage}`, 10)+reminderValue;
  }

  private onPageNumClick(num: number) {
    this.pageCount=num;
    this.pageItems=[...this.getPageNum( {totalPageCount: this.totalPageCount, pageSize: this.pageSize, curPageNum:this.pageCount }) ];
  }

  /!**
   * 페이징 범위에 맞게 각 페이지 넘버 생성 배열 구하기
   * @param paging
   * @private
   *!/
  private getPageNum(  paging: { totalPageCount: number, pageSize: number, curPageNum: number} ): number[] {
    const { start, end }=this.getPageRange( paging );
    const pageNumItems: number[] = [];
    for (let i = start+1; i < end+1; i++) {
      pageNumItems.push(i);
    }
    return pageNumItems;
  }

  /!**
   * 페이징 범위 구하기
   * @param paging
   * @private
   *!/
  private getPageRange( paging: { totalPageCount: number, pageSize: number, curPageNum: number} ): {start: number, end: number}{
    //total - 전체 개수
    //numOfPage - 페이지 당 개수
    //pageSize - 화면에 표시할 페이징 범위
    // curPageNum - 현재 페이지
    const { pageSize, curPageNum, totalPageCount} = paging;
    const reminderValChk = (curPageNum % pageSize === 0) ? -1 : 0;
    const curCountByPageSize: number = parseInt(`${curPageNum / pageSize}`, 10)+reminderValChk;

    const startPage=curCountByPageSize*pageSize;
    const endCalc= (curCountByPageSize + 1) * pageSize;
    const endPage = ( endCalc >= totalPageCount) ? totalPageCount : (curCountByPageSize + 1) * pageSize;
    // console.log('현재페이지 번호='+curPageNum, 'startPage=' + startPage, 'pageRange='+endPage, this.totalPageCount);
    return {
      start: startPage,
      end: endPage
    };
  }

  private onPrevPageClick() {
    if (this.pageCount <= 1) {
      this.pageCount=1;
    }else{
      this.pageCount--;
    }
    this.pageItems=[...this.getPageNum( {totalPageCount: this.totalPageCount, pageSize: this.pageSize, curPageNum:this.pageCount }) ];
    // console.log(this.pageCount);
  }
  private onNextPageClick() {
    this.pageCount++;
    if (this.pageCount > this.totalPageCount) {
      this.pageCount= this.totalPageCount;
    }
    this.pageItems=[...this.getPageNum( {totalPageCount: this.totalPageCount, pageSize: this.pageSize, curPageNum:this.pageCount }) ];
  }*/



}
