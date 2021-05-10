import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import {SEARCH_KEYWORD, SEARCHING, SEARCH_DATA_SAVED, SEARCH_TOTAL} from '@/store/mutation-search-types';
import {SEARCH_RESULT_ACTION, SEARCHING_ACTION} from '@/store/action-search-types';
import {SearchApiService} from '@/api/service/SearchApiService';
import {ISearchModel} from '@/views/model/search.model';


@Module({
  namespaced: true,
})
export default class SearchModule extends VuexModule {
  public searchChk: boolean=false; //멤버 변수는 state 로 이용된다.
  public keywordItem: string = '';
  public schTotal: number = 0;
  public schData: ISearchModel[] = [];

  get isSearchChk(): boolean {
    return this.searchChk;
  }

  get keyword(): any{
    return this.keywordItem;
  }

  get searchTotal(): number{
    return this.schTotal;
  }

  get searchResultData(): ISearchModel[]{
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
  public [SEARCH_DATA_SAVED]( data: ISearchModel[] ): void {
    this.schData=data;
  }

  @Action
  public [SEARCHING_ACTION]( chk: boolean ): void {
    this.context.commit(SEARCHING, chk);
  }

  @Action({rawError: true})
  public [SEARCH_RESULT_ACTION]( keyword: string): Promise<any>{

    return SearchApiService.getSearchResult(keyword)
      .then((data) => {
        this.context.commit(SEARCH_KEYWORD, keyword );
        this.context.commit(SEARCH_DATA_SAVED, data.classlist );
        this.context.commit(SEARCH_TOTAL, data.total );
        // this.searchResults=data.best_classlist;
        // console.log(this.bestItems );
        return Promise.resolve(data);
      }).catch((error) => {
        return Promise.reject(error);
      });


  }

}
