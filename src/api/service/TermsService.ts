import {request} from '@/api/service/axiosService';
import {TERMS_BASE_URL} from '@/api/base';

class TermsService{
  public getTermsURLById(id:string):string{
    return `${TERMS_BASE_URL}/${id}`;
  }

  /**
   * 약관 개벌 조회
   * @param id
   */
  public getFindTerms(id:string):Promise<any>{
    return request('get', this.getTermsURLById(id));
  }

  /**
   * 시비스 이용약관 조회
   */
  public getServiceTerms():Promise<any>{
    return request('get', `${TERMS_BASE_URL}/type/service_use`);
  }

  /**
   * 개인정보 수집 및 이용에 대한 약관 조회
   */
  public getPrivateTerms():Promise<any>{
    return request('get', `${TERMS_BASE_URL}/type/personal_data_collect_and_use`);
  }

  /**
   * 마케팅정보 수신 동의 내용 조회
   */
  public getMarketTerms():Promise<any>{
    return request('get', `${TERMS_BASE_URL}/type/marketting_use`);
  }
}

export default new TermsService();
