interface IMyClassList {
    id: number;
    name: string;
    me: {
        id: number;
        joinedAt: Date;
        createdAt: Date;
        updatedAt: Date;
        class_id: number;
        user_id: number;
        nickname?:  string;
        profile_image?: string;
        is_bookmarked: number | string;
        schedule_color: number | string;
        level:  number | string;
        status:  number | string;
        open_level_id: number;
        open_level_mobileno: number | string;
        open_level_email:  number | string;
        onoff_push_noti:  number | string;
        onoff_post_noti: number | string;
        onoff_comment_noti:  number | string;
        onoff_schedule_noti: number | string;
        schedule_noti_intime:  number | string;
        visited: number | string;
    };
}
/*
"myclass_list": [
    {
        "id": 734,
        "name": "클래스B",
        "class_tags": [],
        "me": {
            "joinedAt": "2021-03-09 11:20:41",
            "createdAt": "2021-03-09 02:20:41",
            "updatedAt": "2021-03-09 02:20:41",
            "id": 815,
            "class_id": 734,
            "user_id": 45,
            "nickname": "홍길동",
            "profile_image": null,
            "is_bookmarked": 0,
            "schedule_color": 0,
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
            "visited": 0,
            "class_member_auths": []
        },
        "owner": {
            "joinedAt": "2021-03-09 11:20:41",
            "createdAt": "2021-03-09 02:20:41",
            "updatedAt": "2021-03-09 02:20:41",
            "id": 815,
            "class_id": 734,
            "user_id": 45,
            "nickname": "홍길동",
            "profile_image": null,
            "is_bookmarked": 0,
            "schedule_color": 0,
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
            "visited": 0
        }
    }
}*/


interface IClassInfo{
    classinfo: {
        contents_updatedAt: Date,
        createdAt: Date,
        updatedAt: Date,
        id: number | string,
        code: string,
        name: string,
        owner_id: number | string,
        owner_member_id: number | string,
        board_id: number | string,
        is_private: boolean,
        // image_url: null,
        // description: null,
        startday: number | string,
        endday: number | string,
        g_type: number,
        g_name: string,
        // g_code: null,
        member_count: number,
        question_showYN: boolean,
        deletedYN: boolean,
        contents_updated_type: number,
        class_tags: [],
    };
    class_members: [];
    me: {
        joinedAt: Date;
        createdAt: Date;
        updatedAt: Date;
        id: number,
        class_id: number;
        user_id: number;
        nickname?:  string;
        profile_image?: string;
        is_bookmarked: number | string;
        schedule_color: number | string;
        level:  number | string;
        status:  number | string;
        open_level_id: number;
        open_level_mobileno: number | string;
        open_level_email:  number | string;
        onoff_push_noti:  number | string;
        onoff_post_noti: number | string;
        onoff_comment_noti:  number | string;
        onoff_schedule_noti: number | string;
        schedule_noti_intime:  number | string;
        visited: number | string;
    };
}

interface IClassMember{
    member_count: number;
    is_private: boolean;
    message?: string;
}
/*
/class/{class_id} 의 결과
{
    "classinfo": {
    "contents_updatedAt": "2021-03-09 02:20:41",
      "createdAt": "2021-03-09 02:20:41",
      "updatedAt": "2021-03-09 02:20:41",
      "id": 734,
      "code": "3b7711dzbkm0uov2q",
      "name": "클래스B",
      "owner_id": 45,
      "owner_member_id": 815,
      "board_id": 158,
      "is_private": false,
      "image_url": null,
      "description": null,
      "startday": "20210309",
      "endday": "99991231",
      "g_type": 1,
      "g_name": "파파야 고등학교",
      "g_code": null,
      "member_count": 1,
      "question_showYN": true,
      "deletedYN": false,
      "contents_updated_type": 0,
      "class_tags": [],
      "class_members": [
        {
            "joinedAt": "2021-03-09 11:20:41",
            "createdAt": "2021-03-09 02:20:41",
            "updatedAt": "2021-03-11 20:05:44",
            "id": 815,
            "class_id": 734,
            "user_id": 45,
            "nickname": "홍길동날다",
            "profile_image": null,
            "is_bookmarked": 0,
            "schedule_color": 0,
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
            "visited": 0
        }
    ],
      "me": {
        "joinedAt": "2021-03-09 11:20:41",
          "createdAt": "2021-03-09 02:20:41",
          "updatedAt": "2021-03-11 20:05:44",
          "id": 815,
          "class_id": 734,
          "user_id": 45,
          "nickname": "홍길동날다",
          "profile_image": null,
          "is_bookmarked": 0,
          "schedule_color": 0,
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
          "visited": 0
    },
    "owner": {
        "joinedAt": "2021-03-09 11:20:41",
          "createdAt": "2021-03-09 02:20:41",
          "updatedAt": "2021-03-11 20:05:44",
          "id": 815,
          "class_id": 734,
          "user_id": 45,
          "nickname": "홍길동날다",
          "profile_image": null,
          "is_bookmarked": 0,
          "schedule_color": 0,
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
          "visited": 0
    },
    "class_link": "https://papayaclass.com/class/3b7711dzbkm0uov2q"
},
    "posts": {
    "count": 100,
      "rows": [],
      "total": 0,
      "page_no": 1
},
    "message": "조회 성공"
}
*/
interface INotifyList {
    profile_image: () => void;
    name: string;
}

interface INotifyFeedList extends INotifyList {
    feedTit: string;
    writer: string;
    updatedDiffTime: string;
}

interface IFeedList {
    feedTit: string;
    profile_image: () => void;
    name: string;
    writer: string;
    updatedDiffTime: string;
    feedText: string[];
    feedType: string;
    feedViewer: number;
    comment: number;
}

export {IMyClassList, INotifyList, INotifyFeedList, IFeedList, IClassInfo, IClassMember};
