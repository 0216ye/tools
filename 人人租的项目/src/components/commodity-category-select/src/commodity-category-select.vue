<template>
  <a-select
    v-if="!cascader"
    v-model:value="selectedValue"
    allow-clear
    :disabled="disabled"
    :loading="loading"
    :mode="multiple ? 'multiple' : undefined"
    option-filter-prop="label"
    :options="options"
    :placeholder="placeholder"
    show-search
    :size="size"
    @change="handleChange"
  />
  <a-cascader
    v-else
    v-model:value="selectedValue"
    allow-clear
    :change-on-select="changeOnSelect"
    :disabled="disabled"
    :loading="loading"
    :multiple="multiple"
    :options="options"
    :placeholder="placeholder"
    show-search
    :size="size"
    @change="handleChange"
  />
</template>

<script setup lang="ts" generic="V extends number | number[]">
import { IOption, useCommodityCategory } from '@/composables/use-commodity-category';
import { useVModel } from '@/utils/hooks';

const props = defineProps<{
  /** 绑定值 */
  value?: V;
  /** 禁用项的特殊处理，'hide':隐藏；'enable':启用 */
  disabledType?: 'hide' | 'enable';
  /** 可获取到的分类级别：1 一级| 2 二级| 3 品牌| 4 模型, 不填默认取到第4级模型层 */
  level?: 1 | 2 | 3 | 4;
  /** 是否为联级选择 */
  cascader?: boolean;
  /** 禁用状态 */
  disabled?: boolean;
  /** 选择框默认文字 */
  placeholder?: string;
  /** 是否多选 */
  multiple?: boolean;
  /** 联级选择下，是否点选每级菜单选项值都发生变化 */
  changeOnSelect?: boolean;
  /** 大小 */
  size?: 'large' | 'default' | 'small';
}>();

const emit = defineEmits<{
  (e: 'update:value', value?: V): void;
  (e: 'change', value?: V, selectedOptions?: V extends number[] ? IOption[] : IOption): void;
}>();

const selectedValue = useVModel(props, 'value', emit);

const { loading, getLevelOptions } = useCommodityCategory();

const options = getLevelOptions({
  disabledType: props.disabledType,
  level: props.level,
  cascader: props.cascader,
});

function handleChange(value?: V, selectedOptions?: V extends number[] ? IOption[] : IOption) {
  emit('change', value, selectedOptions);
}
</script>
