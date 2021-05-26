import {request} from '@/api/service/AxiosService';
import {CLASS_BASE_URL, USER_BASE_URL} from '@/api/base';
import {IKeepPostList} from '@/views/model/my-class.model';
import {IVoteModel} from '@/views/model/post.model';

export class PostService{
  /**
   * 클래스 알림 전체 조회 (최신 위쪽에 )
   * @param classId
   * @param payload
   */
  public static getPosts(classId: number, payload: {page_no: number, count: number} ): Promise<any>{
    return request('get', `${CLASS_BASE_URL}/${classId}/posts`, payload );
  }

  /**
   * 게시글 개별 정보 조회
   * @param classId
   * @param postId
   */
  public static getPostsById(classId: number | string, postId: number): Promise<any> {
    return request('get', `${CLASS_BASE_URL}/${classId}/posts/${postId}`);
  }

  /**
   * 하나의 알림에 댓글 전체 조회.
   * @param postId
   */
  public static getCommentsByPostId(postId: number): Promise<any> {
    return request('get', `/comment/type/post/${postId}`);
  }

  /**
   * 하나의 댓글에 달린 답글 전체 조회
   * @param commentId
   */
  public static getReplysByCommentId(commentId: number): Promise<any> {
    return request('get', `comment-reply/on/${commentId}`);
  }


  /**
   * 클래스 예약된 알림(게시글) 전체 조회
   * @param classId
   * @param payload
   */
  public static getReservedPost(classId: number | string, payload: {page_no: number, count: number}={page_no:1, count:10}): Promise<any>{
    return request('get', `${CLASS_BASE_URL}/${classId}/posts/reserved`, payload);
  }


  /**
   * 모든 알림
   * @param classId
   * @param paging
   */
  public static getAllPostsByClassId(classId: string | number,  paging: {page_no: number, count: number}={page_no:1, count:10}): Promise<any>{
    return request('get', `${CLASS_BASE_URL}/${classId}/posts`, paging);
  }

  public static setAddPost(classId: string | number, formData: FormData) {
    return request('post', `${CLASS_BASE_URL}/${classId}/posts`, formData );
  }

  public static setAddVote(classId: string | number, payload: IVoteModel ): Promise<any>{
    return request('post', '/vote', payload );
  }


  /**
   * 내가 가입한 클래스 알림글 북마크한 글조회
   */
  public static getMyKeepPosts(): Promise<IKeepPostList> {
    return request('get', `${CLASS_BASE_URL}/me/keep/posts`);
  }

  public static setKeepPost(payload: { class_id: number, post_id: number }): Promise<any> {
    return request('post', `${USER_BASE_URL}/me/keep/class/post`, payload );
  }
  public static deleteKeepPost( postId: number ): Promise<any> {
    return request('delete', `${USER_BASE_URL}/me/keep/class/post/${postId}` );
  }
}



