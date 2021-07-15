import {PartialExcept} from '@/types/types';

interface ITimeModel{
  apm: string;
  hour: string | number;
  minute: string | number;
}

interface IScheduleTotal{
  attachment: [];
  board_id: null | number;
  class_id: number;
  count: number;
  createdAt: Date | string;
  deletedYN: boolean;
  endAt: Date | string;
  expiredAt: Date | string;
  id: number;
  owner: {
    class_id: number,
    createdAt: Date | string;
    id: number,
    is_bookmarked: number,
    joinedAt: Date | string;
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
    updatedAt: Date | string;
    user_id: number,
    visited: number
  };
  param1: number;
  post_type: number;
  startAt: Date | string;
  text: string;
  title: string;
  type: number;
  updatedAt: Date | string;
  user_id: number;
  user_keep_class_schedules: [];
  user_member_id: number;
}

interface IScheduleDetail{
  attachment: [];
  board_id: null | number;
  class_id: number;
  count: number;
  createdAt: Date | string;
  deletedYN: boolean;
  endAt: string;
  expiredAt: Date | string;
  id: number;
  owner: {
    class_id: number,
    createdAt: Date | string;
    id: number,
    is_bookmarked: number,
    joinedAt: Date | string;
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
    updatedAt: Date | string;
    user_id: number,
    visited: number
  };
  param1: number;
  post_type: number;
  startAt: string;
  text: string;
  title: string;
  type: number;
  updatedAt: Date | string;
  user_id: number;
  user_keep_class_schedules: [];
  user_member_id: number;
  me: {
    joinedAt: string,
    createdAt: string,
    updatedAt: string,
    id: number,
    class_id: number,
    user_id: number,
    nickname: string,
    profile_image: string | null,
    is_bookmarked: number | boolean,
    schedule_color: number,
    level: number,
    status: number,
    open_level_id: number,
    open_level_mobileno: number,
    open_level_email: number,
    onoff_push_noti: number,
    onoff_post_noti: number,
    onoff_comment_noti: number,
    onoff_schedule_noti: number,
    schedule_noti_intime: number,
    visited:  number,
  };
}

interface IAddSchedule{
  repeat_type: number;
  repeat_count: number;
  fullday: number | boolean;
  title: string;
  body: string;
  evt_startAt: string;  //2021-05-04 18:27:00
  evt_endAt: string;
}

type NoticeScheduleModel = Pick<IScheduleTotal, 'title' | 'text' | 'updatedAt' | 'owner' | 'user_id'>;
interface IScheduleOwner{
  class_id: number;
  createdAt: Date | string;
  id: number;
  is_bookmarked: number;
  joinedAt: Date | string;
  level: number;
  nickname: string;
  onoff_comment_noti: number;
  onoff_post_noti: number;
  onoff_push_noti: number;
  onoff_schedule_noti: number;
  open_level_email: number;
  open_level_id: number;
  open_level_mobileno: number;
  profile_image: null | string;
  schedule_color: number;
  schedule_noti_intime: number;
  status: number;
  updatedAt: Date | string;
  user_id: number;
  visited: number;
}

export {
  ITimeModel,
  IScheduleTotal,
  NoticeScheduleModel,
  IAddSchedule,
  IScheduleOwner,
  IScheduleDetail
};
