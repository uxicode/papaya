import {request} from '@/api/service/AxiosService';
import {CLASS_BASE_URL} from '@/api/base';
import {IMyClassList} from '@/views/model/my-class.model';


class MyClassService {
    /**
     * 내가 가입한 클래스 전체 조회
     */
    public getAllMyClass(): Promise<IMyClassList> {
        return request('get', `${CLASS_BASE_URL}/me/all`);
    }

    public getClassInfoById( id: number | string ): Promise<any>{
        return request('get', `${CLASS_BASE_URL}/${id}`);
    }
}

export default new MyClassService();
