import { defineComponent, PropType, ref, shallowRef, watch } from 'vue';
import { Empty } from 'ant-design-vue';
import { CascaderOptionType } from 'ant-design-vue/lib/cascader';
import { SelectValue } from 'ant-design-vue/lib/select';
import { GET } from '@/services/api';
import { FormGroupItem } from './typing';

export default defineComponent({
  name: 'state-cascader',
  props: {
    value: {
      type: [String, Number, Array] as PropType<string | number | string[] | number[]>,
      default: undefined,
    },
    config: {
      type: Object as PropType<FormGroupItem>,
      default: () => ({}),
    },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const loading = ref(false);
    const currentValue = ref();
    const options = shallowRef<CascaderOptionType[]>([]);

    let firstLoad = true;
    async function onCascaderClick() {
      if ((!options.value.length || firstLoad) && props.config.url && !loading.value) {
        try {
          loading.value = true;
          const res = await GET(props.config.url, props.config.params);
          options.value = props.config.optionsFormat
            ? props.config.optionsFormat(res)
            : (res.data as CascaderOptionType[]);
          firstLoad = false;
        } finally {
          loading.value = false;
        }
      }
    }

    function onCascaderChange(value: SelectValue) {
      emit('update:value', value);
      if (props.config.changeHandler) {
        props.config.changeHandler({ value: currentValue, options, setCurrentValue });
      }
    }

    function setCurrentValue(value: SelectValue) {
      emit('update:value', value);
    }

    watch(
      () => props.value,
      val => {
        currentValue.value = val;
      },
      {
        immediate: true,
      },
    );

    if (props.value) {
      onCascaderClick();
    }

    return {
      loading,
      currentValue,
      options,
      onCascaderClick,
      onCascaderChange,
    };
  },
  render() {
    return (
      <a-cascader
        {...this.$props.config.elProps}
        options={this.options}
        vModel={[this.currentValue, 'value']}
        vSlots={{
          notFoundContent: () =>
            this.loading ? <a-spin size="small" /> : <a-empty image={Empty.PRESENTED_IMAGE_SIMPLE} />,
        }}
        onClick={this.onCascaderClick}
        onChange={this.onCascaderChange}
      />
    );
  },
});
