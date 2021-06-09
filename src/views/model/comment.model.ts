interface ICommentModel{
    createdAt: Date | string | null;
    updatedAt: Date | string | null;
    id: number;
    parent_id: number;
    parent_type: number;
    member_id: number;
    reply_count: number;
    comment: string;
    deletedYN: boolean;
    owner: {
        joinedAt: Date | string | null;
        createdAt: Date | string | null;
        updatedAt: Date | string | null;
        id: number;
        class_id: number;
        user_id: number;
        nickname: string;
        profile_image: string | null;
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
}

interface IReplyModel{
    createdAt: Date | string | null;
    updatedAt: Date | string | null;
    id: number;
    comment_id: number;
    member_id: number;
    comment: string;
    deletedYN: boolean;
    owner: {
        joinedAt: Date | string | null;
        createdAt: Date | string | null;
        updatedAt: Date | string | null;
        id: number;
        class_id: number;
        user_id: number;
        nickname: number;
        profile_image: string | null;
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
}

export {ICommentModel, IReplyModel};