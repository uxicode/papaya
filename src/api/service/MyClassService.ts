import {request} from '@/api/service/AxiosService';
import {CLASS_BASE_URL, SCHOOL_URL} from '@/api/base';
import {
    IMyClassList,
    IMakeClassInfo,
    ClassEachInfo,
    IMakeEducation
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
     * 모든 커리큘럼
     * @param classId
     * @param paging
     */
    public getAllCurriculumByClassId(classId: string | number,  paging: {page_no: number, count: number}={page_no:1, count:10}): Promise<any>{
        return request('get', `${CLASS_BASE_URL}/${classId}/curriculum`, paging );
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
     * @param keyword
     * @param paging
     */
    public searchTag(keyword: string, paging: {page_no: number, count: number}): Promise<any> {
        return request('get', `tag/search/${keyword}`, paging);
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
    public getEduCurList(classId: number, curriculumId: number): Promise<any>{
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
