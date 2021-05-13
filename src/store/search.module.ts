import MyClassService from '@/api/service/MyClassService';
import {IClassTag} from '@/views/model/my-class.model';
import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import {
  SEARCH_KEYWORD,
  SEARCHING,
  SEARCH_DATA_SAVED,
  SEARCH_TOTAL,
  SEARCHING_TYPE
} from '@/store/mutation-search-types';
import {SEARCH_RESULT_ACTION, SEARCHING_ACTION, TAG_SEARCH_RESULT_ACTION} from '@/store/action-search-types';
import {SearchApiService} from '@/api/service/SearchApiService';
import {ISearchModel } from '@/views/model/search.model';


@Module({
  namespaced: true,
})
export default class SearchModule extends VuexModule {
  public searchChk: boolean=false; //멤버 변수는 state 로 이용된다.
  public keywordItem: string = '';
  public schTotal: number = 0;
  public schData: ISearchModel[] | IClassTag[] = [];

  get isSearchChk(): boolean {
    return this.searchChk;
  }

  get keyword(): any{
    return this.keywordItem;
  }

  get searchTotal(): number{
    return this.schTotal;
  }

  get searchResultData(): ISearchModel[] | IClassTag[] {
    return this.schData;
  }

  @Mutation
  public [SEARCHING]( chk: boolean): void {
    this.searchChk = chk;
  }

  @Mutation
  public [SEARCH_KEYWORD]( keyword: any ): void {
    this.keywordItem=keyword;
  }


  @Mutation
  public [SEARCH_TOTAL]( total: number ): void {
    this.schTotal =total;
  }

  @Mutation
  public [SEARCH_DATA_SAVED]( data: ISearchModel[] | IClassTag[] ): void {
    this.schData=data;
  }

  @Action
  public [SEARCHING_ACTION]( chk: boolean ): void {
    this.context.commit(SEARCHING, chk);
  }

  @Action({rawError: true})
  public [SEARCH_RESULT_ACTION]( payload: { keyword: string, page_no: number, count: number}={keyword:'', page_no:1, count:10}): Promise<any>{

    const {keyword, page_no, count} = payload;

    return SearchApiService.getSearchResult(keyword, {page_no, count})
      .then((data) => {
        this.context.commit(SEARCH_KEYWORD, keyword );
        this.context.commit(SEARCH_DATA_SAVED, data.classlist );
        this.context.commit(SEARCH_TOTAL, data.total );
        this.context.commit(SEARCHING_TYPE, false );
        // this.searchResults=data.best_classlist;
        // console.log(this.bestItems );
        return Promise.resolve(data);
      }).catch((error) => {
        return Promise.reject(error);
      });


  }

  @Action({rawError: true})
  public [TAG_SEARCH_RESULT_ACTION](payload: { keyword: string, page_no: number, count: number}={keyword:'', page_no:1, count:10}): Promise<any>{

    const {keyword, page_no, count} = payload;

    return MyClassService.searchTag(keyword, {page_no, count})
      .then((data) => {
        this.context.commit(SEARCH_KEYWORD, keyword);
        this.context.commit(SEARCH_DATA_SAVED, data.tag_list);
        this.context.commit(SEARCH_TOTAL, data.total);
        return Promise.resolve(data);
      }).catch((error) => {
        return Promise.reject(error);
      });
  }

}
