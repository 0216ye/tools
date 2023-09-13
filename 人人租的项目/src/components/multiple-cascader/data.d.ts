export interface MultipleCascaderItemType {
  value: number;
  level: number;
  renderIds: string[];
}

/**
 * 选项
 */
export interface Option {
  label: string;
  value: string | number;
  descript?: string;
  key?: string | number;
  children?: Option[];
  isLeaf?: boolean;
}
