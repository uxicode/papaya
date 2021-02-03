import {request} from '@/api/service/axiosService';
import {TERMS_BASE_URL} from '@/api/base';

class TermsService{
  public getTermsURLById(id:string):string{
    return `${TERMS_BASE_URL}/${id}`;
  }
  public getFindTerms(id:string):Promise<any>{
    return request('get', this.getTermsURLById(id));
  }
  public getServiceTerms():Promise<any>{
    return request('get', `${TERMS_BASE_URL}/type/service_use`);
  }
  public getPrivateTerms():Promise<any>{
    return request('get', `${TERMS_BASE_URL}/type/personal_data_collect_and_use`);
  }
  public getMarketTerms():Promise<any>{
    return request('get', `${TERMS_BASE_URL}/type/marketting_use`);
  }
}

export default new TermsService();
