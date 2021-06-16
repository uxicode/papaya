import {request} from '@/api/service/AxiosService';
import {CLASS_BASE_URL} from '@/api/base';

export class ScheduleService{

  /**
   * 클래스 일정 정보 조회
   * @param classId
   * @param scheduleId
   */
  public static getScheduleById(classId: number, scheduleId: number): Promise<any> {
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
  /**
   * 내가 가입한 클래스 북마크한 일정 글조회
   */
  public static getMyKeepSchedules(): Promise<any> {
    return request('get', `${CLASS_BASE_URL}/me/keep/schedules`);
  }

  /**
   * classId 값을 갖는 해당 클래스 일정 전체 조회
   * @param classId
   * @param paging
   */
  public static getAllScheduleByClassId(classId: string | number, paging: {page_no: number, count: number}={page_no:1, count:10} ): Promise<any>{
    return request('get', `${CLASS_BASE_URL}/${classId}/schedule`, paging );
  }



}
