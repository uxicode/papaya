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
    owner: {
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

// 가입클래스에서 상세 클릭시> 클래스 홈 정보 - 사용된 카테고리 ( / sidemenu / 일정  / 클래스 멤버 / 클래스 설정 / 클래스 교육과정 )
interface IClassInfo{
    contents_updatedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    id: string | number;
    code: string;
    name: string;
    owner_id: string | number;
    owner_member_id: string | number;
    board_id: string | number;
    is_private: string | boolean;
    image_url: string;
    description: string;
    startday: string | number;
    endday: string | number;
    g_type: string | number;
    g_name: string;
    g_code: string;
    member_count: string | number;
    question_showYN: string | boolean;
    deletedYN: string | boolean;
    contents_updated_type: string | number;
    class_tags: Array< { id: string | number, keyword: string } >;
    class_link: string;
    me: {
        class_id: number;
        createdAt: Date
        id: number;
        is_bookmarked: number;
        joinedAt: Date;
        level: number;
        nickname: string;
        onoff_comment_noti: number;
        onoff_post_noti: number;
        onoff_push_noti: number;
        onoff_schedule_noti: number;
        open_level_email: number;
        open_level_id: number;
        open_level_mobileno: number;
        profile_image: null;
        schedule_color: number;
        schedule_noti_intime: number;
        status: number;
        updatedAt: Date;
        user_id: number;
        visited: number;
    };
    owner: {
        class_id: number;
        createdAt: string;
        id: number
        is_bookmarked: number
        joinedAt: string;
        level: 1
        nickname: string
        onoff_comment_noti: number;
        onoff_post_noti: number;
        onoff_push_noti: number;
        onoff_schedule_noti: number;
        open_level_email: number;
        open_level_id: number;
        open_level_mobileno: number;
        profile_image: null | string;
        schedule_color: number;
        schedule_noti_intime:  number;
        status:  number;
        updatedAt: string;
        user_id:  number;
        visited:  number;
    };
}
// 가입 클래스 - 멤버수 / 비공개-공개 / 클래스 이미지 / 클래스 이름
type ClassEachInfo = Pick<IClassInfo, 'member_count' | 'is_private' | 'image_url' | 'g_name' | 'me' >;

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
//보관함
interface IKeepPostList {
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

interface ISearchSchool{
    createdAt: Date;
    updatedAt: Date;
    id: number | string;
    code: string;
    name: string;
    stage: string;
    anniversary: string | number;
    region:  string;
    jb_addr:  string;
    jb_addr_detail:  string;
    jb_zip:  string | number;
    rd_addr: string;
    rd_addr_detail: string;
    rd_zip:  string | number;
    tel: string;
    fax: string;
    website: string;
}
/*
{
   "total": 3,
  "result_count": 3,
  "results": [
    {
        "createdAt": "2019-10-21 16:34:35",
        "updatedAt": "Invalid date",
        "id": 1050,
        "code": "S010000429",
        "name": "마포고등학교",
        "stage": "04",
        "anniversary": "19530601",
        "region": "서울특별시 강서구",
        "jb_addr": "서울특별시 강서구 등촌동 ",
        "jb_addr_detail": "82-1번지",
        "jb_zip": "157033",
        "rd_addr": "서울특별시 강서구 화곡로 403",
        "rd_addr_detail": "(등촌동,마포고등학교)",
        "rd_zip": "07576",
        "tel": "02-3663-2583",
        "fax": "02-3663-2590",
        "website": "http://mapo.sen.hs.kr"
    }
   ],
  "message": "리스트 .....",
  "count_per_page": 10
}
*/
interface IMakeClassInfoBase{
    name?: string;
    is_private?: boolean;
    image_url?: string;
    startday?: Date | number | string;
}
interface IMakeClassInfo extends IMakeClassInfoBase{
    g_type: number | string;
    g_name: string;
}

/*{
    "classinfo": {
      "contents_updatedAt": "2020-01-20 14:18:37",
      "createdAt": "2020-01-20 14:17:24",
      "updatedAt": "2020-01-20 14:17:24",
      "id": 710,
      "code": "3b7711e1xk5lzzw21",
      "name": "색다른 모임",
      "owner_id": 81,
      "owner_member_id": 732,
      "board_id": 134,
      "is_private": false,
      "image_url": null,
      "description": null,
      "startday": "2020",
      "endday": "99991231",
      "g_type": 3,
      "g_name": "소모임",
      "g_code": null,
      "member_count": 1,
      "question_showYN": true,
      "deletedYN": false,
      "contents_updated_type": 1,
      "class_tags": [],
      "class_members": [
        {
            "joinedAt": "2020-01-20 14:17:24",
            "createdAt": "2020-01-20 14:17:24",
            "updatedAt": "2020-01-20 14:17:27",
            "id": 732,
            "class_id": 710,
            "user_id": 81,
            "nickname": "선생님1",
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
      "me": null,
      "owner": {
        "joinedAt": "2020-01-20 14:17:24",
          "createdAt": "2020-01-20 14:17:24",
          "updatedAt": "2020-01-20 14:17:27",
          "id": 732,
          "class_id": 710,
          "user_id": 81,
          "nickname": "선생님1",
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
      "class_link": "https://papayaclass.com/class/3b7711e1xk5lzzw21"
     },
    "posts": {
    "count": 100,
      "rows": [
        {
            "startAt": "2020-01-20 05:18:00",
            "endAt": null,
            "expiredAt": null,
            "createdAt": "2020-01-20 14:18:37",
            "updatedAt": "2020-01-20 14:18:37",
            "id": 167,
            "class_id": 710,
            "board_id": 710,
            "post_type": 0,
            "type": 0,
            "user_id": 81,
            "user_member_id": 732,
            "title": "테스트",
            "text": "..."
            "count": 1,
            "param1": null,
            "deletedYN": false,
            "owner": {
                "joinedAt": "2020-01-20 14:17:24",
                "createdAt": "2020-01-20 14:17:24",
                "updatedAt": "2020-01-20 14:17:27",
                "id": 732,
                "class_id": 710,
                "user_id": 81,
                "nickname": "선생님1",
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
            "user_keep_class_schedules": [],
            "user_keep_class_posts": [],
            "vote": null,
            "link": null,
            "attachment": []
        }
    ],
      "total": 1,
      "page_no": 1
},
    "message": "조회 성공"
}*/

interface IClassMemberInfo {
    joinedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    id: number;
    class_id: number;
    user_id: number;
    nickname: string;
    profile_image?: string;
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
    class_member_auths: [];
}

interface IQuestionInfo {
    createdAt?: Date;
    id: number;
    class_id: number;
    question: string;
}

interface IQnaInfo {
    createdAt: Date;
    updatedAt: Date;
    id: number;
    member_id: number;
    class_id: number;
    index: number;
    question: string;
    answer: string;
}

interface IMakeEducation {
    title: string;
    goal: string;
    course_list: Array<{
        index?: number;
        id?: number;
        startDay?: Date | string;
        startTime?: Date | string;
        endTime?: Date | string;
        title?: string;
        contents?: string;
    }>;
}

interface ICurriculumList {
    total: number;
    page_no: null | number;
    pages: null | number;
    item_count: number;
    curriculum_list: Array<{
        startAt: Date | string;
        endAt: Date | string;
        expiredAt: Date | string;
        createdAt: Date | string;
        updatedAt: Date | string;
        id: number;
        class_id: number;
        board_id: null,
        post_type: number;
        type: number;
        user_id: number;
        user_member_id: number;
        title: string;
        text: string;
        count: number;
        param1: number;
        deletedYN: boolean;
        owner: {
            joinedAt: Date | string;
            createdAt: Date | string;
            updatedAt: Date | string;
            id: number;
            class_id: number;
            user_id: number;
            nickname: string;
            profile_image: null | string,
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
        },
        course_list: [
            {
                startDay: Date | string;
                createdAt: Date | string;
                updatedAt: Date | string;
                id: number;
                curriculum_id: number;
                class_id: number;
                index: number;
                title: string;
                contents: string;
                startTime: Date | string;
                endTime: Date | string;
                deletedYN: boolean;
            }
        ]
    }>;
    message: string;
}

/*
interface ICurriculumDetailList {
    curriculum: {
        startAt: Date;
        endAt: Date;
        expiredAt: Date;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        class_id: number;
        board_id: null | number;
        post_type: number;
        type: number;
        user_id: number;
        user_member_id: number;
        title: string;
        text: string;
        count: number;
        param1: number;
        deletedYN: boolean;
        owner?: {
            joinedAt: Date;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            class_id: number;
            user_id: number;
            nickname: string;
            profile_image: null | string;
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
        },
        course_list?: Array<{
            startDay: Date;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            curriculum_id: number;
            class_id: number;
            index: number;
            title?: string | undefined;
            contents: string;
            startTime: Date;
            endTime: Date;
            deletedYN: boolean;
            attachment: Array<{
                createdAt: Date;
                updatedAt: Date;
                id: number;
                user_id: number;
                member_id: null | number;
                parent_id: number;
                group_name: string;
                fieldname: string;
                originalname: string;
                encoding: string;
                mimetype: string;
                size: number;
                bucket: string;
                key: string;
                acl: string;
                contentType: string;
                contentDisposition: null;
                storageClass: string;
                serverSideEncryption: null;
                metadata: null;
                location: string;
                etag: string;
                deletedYN: boolean;
            }>;
        }>;
    };
    message?: string;
}
*/

interface ICurriculumDetailList {
    startAt: Date | string;
    endAt: Date | string;
    expiredAt: Date | string;
    createdAt: Date | string;
    updatedAt: Date | string;
    id: number;
    class_id: number;
    board_id: null | number;
    post_type: number;
    type: number;
    user_id: number;
    user_member_id: number;
    title: string;
    text: string;
    count: number;
    param1: number;
    deletedYN: boolean;
    owner: {
        id?: number;
        class_id?: number;
        user_id?: number;
        nickname: string;
        profile_image?: null | string;
        level: number;
        status?: number;
    };
    course_list?: Array<{
        startDay: Date | string;
        createdAt: Date | string;
        updatedAt: Date | string;
        id: number;
        curriculum_id: number;
        class_id: number;
        index: number;
        title: string;
        contents: string;
        startTime: Date | string;
        endTime: Date | string;
        deletedYN: boolean;
        attachment?: [];
    }>;
}

interface ICurriculumCourseData {
    startDay: Date | string;
    createdAt: Date | string;
    updatedAt: Date | string;
    id: number;
    curriculum_id: number;
    class_id: number;
    index: number;
    title: string;
    contents: string;
    startTime: Date | string;
    endTime: Date | string;
}

interface IModifyCurriculum {
    title: string;
    goal: string;
    course_list?: Array<{
        id: number;
        index: number;
        title: string;
        startDay: Date | string;
        startTime: Date | string;
        endTime: Date | string;
        contents: string;
    }>;
    deleted_course_list?: Array<{
        id: number;
    }>;
}

interface IModifyCourse {
    id: number;
    index: number;
    title: string;
    contents: string;
    startDay: Date | string;
    startTime: Date | string;
    endTime: Date | string;
}

interface IClassTag {
    id: number;
    class_id: number;
    keyword: string;
    updatedAt?: Date;
    createdAt?: Date;
}

interface IClassAuth {
    id?: number;
    auth_type: number;
    be_authorized: boolean;
}

export {
    IMyClassList,
    INotifyList,
    INotifyFeedList,
    IFeedList,
    IClassInfo,
    ClassEachInfo,
    IKeepPostList,
    ISearchSchool,
    IMakeClassInfo,
    IMakeClassInfoBase,
    IClassMemberInfo,
    IQuestionInfo,
    IQnaInfo,
    IMakeEducation,
    ICurriculumList,
    ICurriculumDetailList,
    ICurriculumCourseData,
    IModifyCurriculum,
    IModifyCourse,
    IClassTag,
    IClassAuth
};
