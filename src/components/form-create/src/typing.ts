import { FormItemProps } from 'ant-design-vue';
import { CSSProperties } from 'vue';
import * as formFragment from './form-fragment';
import { IAxiosResponse } from '@/services/api';

export type Option = {
  label: string;
  value: string | number;
  disabled?: boolean;
};

export type fragmentKey = keyof typeof formFragment;

export interface FormGroupItem<T = any> {
  key: T;
  fragmentKey: fragmentKey;
  originProps?: FormItemProps;
  options?: Option[];
  optionsFormat?: (res: IAxiosResponse<Option[]>, value: string[]) => Option[];
  url?: string;
  style?: CSSProperties;
  elProps?: T;
  changeHandler?: (params: any) => void;
  params?: Record<string, unknown>;
  colspan?: Record<string, number>;

  // 每次点击都请求url
  everyTimeLoad?: boolean;
  // 组合查询时，下拉框的配置项
  selectConfig?: FormGroupItem;
}

export interface SearchHeaderExtra {
  searchKey?: string;
  searchConfig?: FormGroupItem[];
  immediate?: boolean;
}
