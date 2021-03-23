import {request} from '@/api/service/AxiosService';
import {CLASS_BASE_URL, SCHOOL_URL} from '@/api/base';
import {IClassInfo, IMyClassList, IClassMember, IPostList} from '@/views/model/my-class.model';


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

    /**
     * 내가 가입한 클래스 알림글 북마크한 글조회
     */
    public getMyKeepPosts(): Promise<IPostList> {
        return request('get', `${CLASS_BASE_URL}/me/keep/posts`);
    }

    /**
     * 내가 가입한 클래스 북마크한 일정 글조회
     */
    public getMyKeepSchedules(): Promise<any> {
        return request('get', `${CLASS_BASE_URL}/me/keep/schedules`);
    }

    public setClassBookmark(classId: number, memberId: number, payload: { is_bookmarked: number; nickname: string | undefined }): Promise<IClassMember>{
        return request('put', `${CLASS_BASE_URL}/${classId}/members/${memberId}`, payload);
    }

    public getClassBookmark(classId: number, memberId: number): Promise<IClassMember>{
        return request('put', `${CLASS_BASE_URL}/${classId}/members/${memberId}`);
    }

    public getSearchSchool(name: string, query: { count: number }={ count:10 }): Promise<any> {
        return request('get', `${SCHOOL_URL}/searchbyname/${name}`, query);
    }
}

export default new MyClassService();
