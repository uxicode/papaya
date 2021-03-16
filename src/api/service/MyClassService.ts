import {request} from '@/api/service/AxiosService';
import {CLASS_BASE_URL} from '@/api/base';
import {IClassInfo, IMyClassList, IClassMember} from '@/views/model/my-class.model';


class MyClassService {
    /**
     * 내가 가입한 클래스 전체 조회
     */
    public getAllMyClass(): Promise<IMyClassList> {
        return request('get', `${CLASS_BASE_URL}/me/all`);
    }

    public getClassInfoById( id: number | string ): Promise<IClassInfo>{
        return request('get', `${CLASS_BASE_URL}/${id}`);
    }

    public setClassBookmark(classId: number, memberId: number, payload: { is_bookmarked: number; nickname: string | undefined }): Promise<IClassMember>{
        return request('put', `${CLASS_BASE_URL}/${classId}/members/${memberId}`, payload);
    }

    public getClassBookmark(classId: number, memberId: number): Promise<IClassMember>{
        return request('put', `${CLASS_BASE_URL}/${classId}/members/${memberId}`);
    }
}

export default new MyClassService();
