export type TRenderType = 'input' | 'select' | 'datePicker' | 'date';
export interface IOptions {
  label: string;
  value: string | number;
}
export interface ISearchConfigItem {
  label: string;
  key: string;
  renderType: TRenderType;
  placeholder?: string;
  default?: unknown;
  options?: IOptions[];
  renderProps?: { [key: string]: unknown };
}
export interface ISearchValue {
  [key: string]: unknown;
}

export interface ITableColumnsItem {
  title: string;
  dataIndex?: string;
  key?: string;
  width?: number | string;
  fixed?: 'left' | 'right';
  align?: 'center';
  slots?: unknown;
  children?: ITableColumnsItem[];
}
