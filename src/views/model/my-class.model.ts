interface IMyClassList {
    id: number;
    name: string;
    me: {
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
    member_count: number;
    is_private: boolean;
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

interface IPostList {
    startAt: string;
    endAt: string;
    expiredAt: string;
    createdAt: string;
    updatedAt: string;
    id: number;
    class_id: number;
    post_type: number;
    type: number;
    user_id: number;
    user_member_id: number;
    title: string;
    text: string;
    count: number;
    param1: number;
    deletedYN: boolean;
    class: {
        contents_updatedAt: string;
        createdAt: string;
        updatedAt: string;
        id: number;
        code: string;
        name: string;
        owner_id: number;
        owner_member_id: number;
        board_id: number;
        is_private: boolean;
        image_url: string;
        description: string;
        startday: string;
        endday: string;
        g_type: number;
        g_name: string;
        g_code: number;
        member_count: number;
        question_showYN: boolean;
        deletedYN: boolean;
        contents_updated_type: number;
    };
    owner: {
        joinedAt: string;
        createdAt: string;
        updatedAt: string;
        id: number;
        class_id: number;
        user_id: number;
        nickname: string;
        profile_image: string;
        is_bookmarked: number;
        schedule_color: number;
        level: number;
        status: number;
        open_level_id: number;
        open_level_mobileno: number;
        open_level_email: number;
        onoff_push_noti: number;
        onoff_post_noti: number;
        onoff_comment_noti: number;
        onoff_schedule_noti: number;
        schedule_noti_intime: number;
        visited: number;
    };
    user_keep_class_posts: [
        {
            createdAt: string;
            id: number;
            post_id: number;
            user_id: number;
            class_id: number;
        }
    ];
}

export {IMyClassList, INotifyList, INotifyFeedList, IFeedList, IPostList, IClassInfo};