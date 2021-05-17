interface IPostModel{
  attachment: [];
  class_id: number;
  count: number;
  createdAt: Date;
  endAt: Date | null;
  expiredAt:  Date;
  id: number;
  link: number | null;
  owner: {
    class_id: number,
    createdAt: Date,
    id: number,
    is_bookmarked: number,
    joinedAt: Date,
    level: number,
    nickname: string,
    onoff_comment_noti:  number,
    onoff_post_noti: number,
    onoff_push_noti: number,
    onoff_schedule_noti:  number,
    open_level_email: number,
    open_level_id:  number,
    open_level_mobileno:  number,
    profile_image: string | null,
    schedule_color:  number,
    schedule_noti_intime:  number,
    status:  number,
    updatedAt: Date,
    user_id:  number,
    visited: number,
  };
  param1: number;
  post_type: number;
  startAt:  Date;
  text: string;
  title: string;
  type: number;
  updatedAt: Date;
  user_id: number;
  user_keep_class_posts: [];
  user_member_id: number;
  vote: {
    anonymous_mode: boolean, // 익명 모드
    createdAt: Date, //"2020-03-19 10:45:40"
    finishAt: Date | null,
    id: number,
    multi_choice: boolean,
    open_progress_level: number,
    open_result_level: number,
    parent_id: number,
    title: string,
    type: number,
    updatedAt: Date,
    vote_choices: Array<{
      createdAt: Date,
      id: number,
      image_url: string | null,
      index: number,
      text: string,
      updatedAt: Date,
      user_choices: Array<{
        choice_id: number,
        createdAt: Date,
        deletedYN: boolean,
        id: number,
        member_id: number,
        updatedAt: Date,
        vote_id: number,
      }>,
      vote_id: number,
    }>
  };
}
/*acl: "public-read"
bucket: "papaya-storage/class/post"
contentDisposition: null
contentType: "image/png"
createdAt: "2021-05-03 19:33:13"
deletedYN: false
encoding: "7bit"
etag: "\"b98129a9bc93150562b81856b76e7a9f\""
fieldname: "files"
group_name: "class_post"
id: 303
key: "1620037992759_class_post_61_sstest07_100vh_problem.png"
location: "https://papaya-storage.s3.ap-northeast-2.amazonaws.com/class/post/1620037992759_class_post_61_sstest07_100vh_problem.png"
member_id: null
metadata: null
mimetype: "image/png"
originalname: "100vh_problem.png"
parent_id: 797
serverSideEncryption: null
size: 21459
storageClass: "STANDARD"
updatedAt: "2021-05-03 19:33:13"
user_id: 61*/
interface IAttachFileModel{
  acl: string;
  bucket:  string;
  contentDisposition:  string | null;
  contentType:  string;
  createdAt: Date;
  deletedYN: boolean;
  encoding: string;
  etag: string;
  fieldname:  string;
  group_name:  string;
  id: number;
  key:  string;
  location:  string;
  member_id: number | null;
  metadata:  string;
  mimetype:  string;
  originalname: string;
  parent_id: number;
  serverSideEncryption:  string | null;
  size: number;
  storageClass:  string;
  updatedAt: Date;
  user_id: number;
}

export {IPostModel, IAttachFileModel};
