import {request} from '@/api/service/AxiosService';
import {CLASS_BASE_URL} from '@/api/base';

export class SearchApiService{
  /**
   * search 랜딩 페이지
   */
  public static getSearchHome(): Promise<any> {
    return request('get', `${CLASS_BASE_URL}/search/home`);
  }

  public static getSearchResult( searchWord: string, paging: {page_no: number, count: number}={page_no:0, count:10}): Promise<any> {
    return request('get', `${CLASS_BASE_URL}/search/all/${searchWord}`, paging );
  }
}
