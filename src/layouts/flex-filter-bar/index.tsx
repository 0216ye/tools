import { defineComponent, PropType } from 'vue';
import './style.less';

export default defineComponent({
  props: {
    filterName: {
      type: Array as PropType<string[]>,
      default: [],
      required: true,
    },
    gutter: {
      type: [Number, Array] as PropType<number[] | number>,
      default: 16,
    },
  },
  setup(props) {
    // 处理布局
    const gutter = [16, 16];
    if (props.gutter instanceof Array && props.gutter.length >= 1) {
      gutter[0] = +props.gutter[0];
      gutter[1] = props.gutter.length === 2 ? +props.gutter[1] : +props.gutter[0];
    } else if (typeof props.gutter === 'number') {
      gutter[0] = gutter[1] = +(props.gutter || 0);
    }

    // 计算一段文本包括特殊字符的长度
    const getCharLength = (str: string) => {
      return str.replace(/[^\x00-\xff]/g, 'xx').length;
    };

    return {
      gap: gutter,
      getCharLength,
    };
  },
  render() {
    const filter = this.$slots.default?.() || [];
    if (filter.length !== this.filterName.length) {
      throw new Error('传入筛选字段名称数量和表单类型不一样');
    }
    const buttonGroup = this.$slots.buttonGroup?.();
    const extra = this.$slots.extra?.();
    return (
      <div class="filter-bar" style={{ columnGap: this.gap[1] + 'px', rowGap: this.gap[0] + 'px' }}>
        {filter.map((filterItem, filterIdx) => (
          <div class="filter-bar__item">
            <div class="filter-bar__item--title">{this.filterName[filterIdx]}:</div>
            <div
              class="filter-bar__item--slot"
              style={{ width: `calc(100% - ${(this.getCharLength(this.filterName[filterIdx]) + 2) * 7}px)` }}
            >
              {filterItem}
            </div>
          </div>
        ))}
        {buttonGroup ?? <div class="filter-bar__button-group">{this.$slots.buttonGroup}</div>}
        {extra ?? <div class="filter-bar__extra">{this.$slots.extra}</div>}
      </div>
    );
  },
});
