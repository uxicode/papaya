
interface ITimeModel{
  apm: string;
  hour: string;
  minute: string;
}

interface IScheduleTotal{
  attachment: [];
  board_id: null | number;
  class_id: number;
  count: number;
  createdAt: Date;
  deletedYN: boolean;
  endAt: Date;
  expiredAt: Date;
  id: number;
  owner: {
    class_id: number,
    createdAt: Date,
    id: number,
    is_bookmarked: number,
    joinedAt: Date,
    level: number,
    nickname: string,
    onoff_comment_noti: number,
    onoff_post_noti: number,
    onoff_push_noti: number,
    onoff_schedule_noti: number,
    open_level_email: number,
    open_level_id: number,
    open_level_mobileno: number,
    profile_image: null | string,
    schedule_color: number,
    schedule_noti_intime: number,
    status: number,
    updatedAt: Date,
    user_id: number,
    visited: number
  };
  param1: number;
  post_type: number;
  startAt: Date;
  text: string;
  title: string;
  type: number;
  updatedAt: Date;
  user_id: number;
  user_keep_class_schedules: [];
  user_member_id: number;
}

export {
  ITimeModel,
  IScheduleTotal
};
