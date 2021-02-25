interface IClassInfo {
    classThumb: () => void;
    className: string;
    classOwner: string;
    createdYear: number;
    classType: string;
    memberNum: number;
    isUpdated: boolean;
    updatedDiffTime: string;
    isFavorite: boolean;
}

interface INotifyList {
    classThumb: () => void;
    className: string;
}

interface INotifyFeedList extends INotifyList {
    feedTit: string;
    writer: string;
    updatedDiffTime: string;
}

interface IFeedList {
    feedTit: string;
    classThumb: () => void;
    className: string;
    writer: string;
    updatedDiffTime: string;
    feedText: string[];
    feedType: string;
    feedViewer: number;
    comment: number;
}

export interface IMe {
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
    onooff_comment_noti: number;
    onoff_schedule_noti: number;
    schedule_noti_intime: number;
    visited: 1;
    class_member_auths: [];
}

export interface IOwner {
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
    onooff_comment_noti: number;
    onoff_schedule_noti: number;
    schedule_noti_intime: number;
    visited: 1;
}

interface IMyClassList {
    name: string;
    class_tags: [];
    me: IMe;
    owner: IOwner;
}

export {IClassInfo, INotifyList, INotifyFeedList, IFeedList, IMyClassList};