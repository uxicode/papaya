import {request} from '@/api/service/axiosService';
import {CLASS_BASE_URL} from '@/api/base';
import {IMyClassList, IPostList} from '@/views/model/my-class.model';

class MyClassService {
    /**
     * 내가 가입한 클래스 전체 조회
     */
    public getAllMyClass(): Promise<IMyClassList> {
        return request('get', `${CLASS_BASE_URL}/me/all`);
    }

    /**
     * 내가 가입한 클래스 알림글 북마크한 글조회
     */
    public getMyKeepPosts(): Promise<IPostList> {
        return request('get', `${CLASS_BASE_URL}/me/keep/posts`);
    }
}

export default new MyClassService();
