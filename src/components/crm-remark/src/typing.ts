export type LayoutType = 'horizontal' | 'vertical';
export type SizeType = 'default' | 'small' | 'block';
export type LogsFormatType = <T = any>(list: T[]) => RemarkItem[];

export type RemarkItem = {
  id: string;
  remark: string;
  last_remark: string;
  remark_by: string;
  created_at: string;
  remark_num: number;
  union_id: string;
};
