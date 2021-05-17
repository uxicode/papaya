interface ISearchModel {
  board_id: number;
  class_id: number;
  class_tags: [];
  code: string | null;
  contents_updatedAt: Date;
  contents_updated_type: number;
  createdAt:  Date;
  deletedYN: number;
  description:  string | null;
  endday:  string | number;
  g_code:  string | null;
  g_name: string;
  g_type: number;
  id: number;
  image_url: string;
  is_private: number;
  member_count: number;
  name: string;
  owner_id: number;
  owner_member_id: number;
  question_showYN: number;
  region:  string | null;
  school_name:  string | null;
  startday: string | number;
  updatedAt:  Date;
}


export {ISearchModel };
