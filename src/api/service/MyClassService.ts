import {request} from '@/api/service/AxiosService';
import {CLASS_BASE_URL, SCHOOL_URL} from '@/api/base';
import {
    IMyClassList,
    IPostList,
    IMakeClassInfo,
    ClassEachInfo, IMakeEducation
} from '@/views/model/my-class.model';


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

    public setClassInfoById(id: number, data: any): Promise<any>{
        return request('put', `${CLASS_BASE_URL}/${id}`, data);
    }

    /**
     * 해당 클래스의 내 정보 조회
     * @param id
     */
    public getMyInfoInThisClass(id: number): Promise<any> {
        return request('get', `${CLASS_BASE_URL}/${id}/me`);
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

    public setClassBookmark(classId: number, memberId: number, payload: { is_bookmarked: number; nickname: string | undefined }): Promise<ClassEachInfo>{
        return request('put', `${CLASS_BASE_URL}/${classId}/members/${memberId}`, payload);
    }

    public getClassBookmark(classId: number, memberId: number): Promise<ClassEachInfo>{
        return request('put', `${CLASS_BASE_URL}/${classId}/members/${memberId}`);
    }

    public getSearchSchool(name: string): Promise<any> {
        return request('get', `${SCHOOL_URL}/searchbyname/${name}`);
    }
    public setMakeClass( info: IMakeClassInfo ): Promise<any>{
        return request('post', `${CLASS_BASE_URL}`, info );
    }

    /**
     * profile image 등록
     * @param classId
     * @param file
     */
    public setUploadProfileImg( classId: string | number, file: any ): Promise<any>{
        return request('upload', `/upload/class/${classId}/banner`, file );
    }

    /**
     * classId 값을 갖는 해당 클래스 일정 전체 조회
     * @param classId
     * @param payload
     */
    public async getAllScheduleByClassId(classId: string | number, payload: { page_no: number | null, count: number | null }={page_no:null, count:null} ): Promise<any>{
        return await request('get', `${CLASS_BASE_URL}/${classId}/schedule`, payload );
    }

    /**
     * 클래스 일정 정보 조회
     * @param classId
     * @param scheduleId
     */
    public getScheduleById(classId: number, scheduleId: number): Promise<any> {
        //test - classId - 592 / scheduleId - 564 - 조회시 아래와 같은 데이터
        /*{
            "schedule": {
              "startAt": "2020-03-30 08:19:00",
              "endAt": "2020-03-30 18:19:00",
              "expiredAt": "2020-03-31 03:19:00",
              "createdAt": "2020-03-30 12:19:07",
              "updatedAt": "2020-04-10 16:17:10",
              "id": 564,
              "class_id": 592,
              "board_id": null,
              "post_type": 1,
              "type": 0,
              "user_id": 51,
              "user_member_id": 563,
              "title": "등록",
              "text": "",
              "count": 10,
              "param1": 0,
              "deletedYN": false,
              "owner": {
                "joinedAt": "2019-12-02 14:32:14",
                  "createdAt": "2019-12-02 14:32:14",
                  "updatedAt": "2019-12-02 14:33:44",
                  "id": 563,
                  "class_id": 592,
                  "user_id": 51,
                  "nickname": "닉네임",
                  "profile_image": null,
                  "is_bookmarked": 0,
                  "schedule_color": 8,
                  "level": 1,
                  "status": 1,
                  "open_level_id": 0,
                  "open_level_mobileno": 0,
                  "open_level_email": 0,
                  "onoff_push_noti": 1,
                  "onoff_post_noti": 1,
                  "onoff_comment_noti": 1,
                  "onoff_schedule_noti": 1,
                  "schedule_noti_intime": 10,
                  "visited": 135
            },
            "user_keep_class_schedules": [],
              "attachment": [],
              "me": null
           },
            "message": "성공 - 클래스 일정 건별 조회"
        }*/
        return request('get', `${CLASS_BASE_URL}/${classId}/schedule/${scheduleId}`);
    }
// tslint:disable-next-line:no-shadowed-variable
    public getAllPostsByClassId(classId: string | number, pageNum: number, count: number = 5): Promise<any>{
        return request('get', `${CLASS_BASE_URL}/${classId}/posts`, {page_no:pageNum, count});
    }

    // tslint:disable-next-line:no-shadowed-variable
    public getAllCurriculumByClassId(classId: string | number, pageNum: number, count: number = 5): Promise<any>{
        return request('get', `${CLASS_BASE_URL}/${classId}/curriculum`, {page_no:pageNum, count});
    }

    /**
     * 클래스 가입 질문 전체 조회
     * @param classId
     */
    public getClassQuestion(classId: number): Promise<any> {
        return request('get', `${CLASS_BASE_URL}/${classId}/question`);
    }

    public setClassQuestion(classId: number, questionId: number, payload: {new_question: string}): Promise<any> {
        return request('put', `${CLASS_BASE_URL}/${classId}/question/${questionId}`, payload);
    }

    public deleteClassQuestion(classId: number, questionId: number): Promise<any> {
        return request('delete', `${CLASS_BASE_URL}/${classId}/question/${questionId}`);
    }

    public makeClassQuestion(classId: number, payload: {question: string}): Promise<any> {
        return request('post', `${CLASS_BASE_URL}/${classId}/question`, payload);
    }

    /**
     * 클래스 태그 조회
     * @param classId
     */
    public getClassTags(classId: number): Promise<any> {
        return request('get', `${CLASS_BASE_URL}/${classId}/tags`);
    }

    /**
     * 클래스 태그 삭제
     * @param classId
     * @param tagId
     */
    public deleteTag(classId: number, tagId: number): Promise<any> {
        return request('delete', `${CLASS_BASE_URL}/${classId}/tags/${tagId}`);
    }

    /**
     * 태그 검색
     * @param searchText
     */
    public searchTag(searchText: string): Promise<any> {
        return request('get', `tag/search/${searchText}`);
    }

    /**
     * 클래스 태그 추가
     * @param classId
     * @param payload
     */
    public addClassTag(classId: number, payload: {keyword: string}): Promise<any> {
        return request('post', `${CLASS_BASE_URL}/${classId}/tags`, payload);
    }

    /**
     * 클래스 알림 전체 조회 (최신 위쪽에 )
     * @param classId
     * @param payload
     */
    public getPosts(classId: number, payload: {page_no: number, count: number}): Promise<any>{
        return request('get', `${CLASS_BASE_URL}/${classId}/posts`, payload );
    }

    /**
     * 클래스 교육과정
     * @param classId
     */
    public getEducationList(classId: number): Promise<any>{
        return request('get', `${CLASS_BASE_URL}/${classId}/curriculum` );
    }

    /**
     * 클래스 교육과정 생성
     * @param classId
     * @param curriculumItems
     */
    public setEducationList(classId: number, curriculumItems: IMakeEducation): Promise<any>{
        return request('post', `${CLASS_BASE_URL}/${classId}/curriculum`, curriculumItems );
    }

    /**
     * 클래스 교육과정 삭제
     * @param classId
     * @param curriculumId
     */
    public deleteEducationList(classId: number, curriculumId: number): Promise<any>{
        return request('delete', `${CLASS_BASE_URL}/${classId}/curriculum/${curriculumId}` );
    }


    /**
     * 클래스 교육과정 정보 조회
     * @param classId
     * @param curriculumId
     */
    public getEduCurrList(classId: number, curriculumId: number): Promise<any>{
        return request('get', `${CLASS_BASE_URL}/${classId}/curriculum/${curriculumId}` );
    }

    /**
     * 클래스 교육과정 개별코스 정보 조회
     * @param classId
     * @param curriculumId
     */
    public getEduCourseList(classId: number, curriculumId: number, courseId: number): Promise<any>{
        return request('get', `${CLASS_BASE_URL}/${classId}/curriculum/${curriculumId}/course/${courseId}` );
    }


    /**
     * 클래스 교육과정 개별코스 생성
     * @param classId
     * @param curriculumId
     */
    public setEduCourseList(classId: number, curriculumId: number): Promise<any>{
        return request('post', `${CLASS_BASE_URL}/${classId}/curriculum/${curriculumId}/course` );
    }

}

export default new MyClassService();
