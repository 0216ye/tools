import { PropType } from 'vue';
import type { LayoutType, SizeType, RemarkItem, LogsFormatType } from './typing';

export const remarkProps = {
  layout: {
    type: String as PropType<LayoutType>,
    default: 'vertical',
  },

  size: {
    type: String as PropType<SizeType>,
    default: 'default',
  },

  item: Object as PropType<RemarkItem>,

  id: { type: String, default: '' },

  pushLink: { type: String, default: '/crm/push' },

  logLink: { type: String, default: '/crm/log' },

  formatLogs: { type: Function as PropType<LogsFormatType> },

  staticLogs: { type: Array as PropType<RemarkItem[]> },

  idKey: { type: String, default: 'unionId' },

  extraParams: { type: Object as PropType<unknown>, default: () => ({}) },

  prefixText: { type: String, default: '' },

  title: { type: String, default: '添加备注' },

  blockFlex: { type: Boolean, default: true },
};
