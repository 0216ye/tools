<template>
  <div class="multiple-cascader">
    <a-cascader
      v-model:value="value"
      :dropdown-class-name="searchValue ? 'multiple-cascader-search' : ''"
      :field-names="{
        children: 'children',
        label: 'label',
        value: 'renderValue',
      }"
      max-tag-count="responsive"
      :max-tag-text-length="6"
      multiple
      :options="renderOptions"
      :placeholder="placeholder"
      :show-search="showSearch"
      style="width: 100%"
      @search="searchHandle"
    >
      <template
        v-if="loading"
        #notFoundContent
      >
        <a-spin size="small" />
      </template>
    </a-cascader>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { MultipleCascaderItemType, Option } from './data';

import { computed, ref } from 'vue';

export interface RenderOption extends Option {
  renderValue: string;
  children: RenderOption[];
}

const props = defineProps({
  modelValue: {
    type: Array as PropType<MultipleCascaderItemType[]>,
    default() {
      return [];
    },
  },
  options: {
    type: Array as PropType<Option[]>,
    default() {
      return [];
    },
  },
  placeholder: {
    type: String,
    default: '请选择',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  showSearch: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['update:modelValue', 'change']);
// 选项
const renderOptions = computed<RenderOption[]>(() => {
  return formatGoodsTypeOptions(props.options);
});
const value = computed<any>({
  get() {
    return props.modelValue.map(item => item.renderIds);
  },
  set(list: string[][]) {
    const value =
      list && list.length
        ? list.map(arr => getValue(arr, renderOptions.value, arr)).reduce((v1, v2) => v1.concat(v2))
        : [];
    emit('update:modelValue', value);
    emit('change', value);
  },
});
// 搜索的值
const searchValue = ref('');

/**
 * 获取子属性值
 */
function getChildren(options: RenderOption[], ids: string[]): MultipleCascaderItemType[] {
  let list: MultipleCascaderItemType[] = [];
  options.forEach(item => {
    const itemIds = [...ids].concat([item.renderValue]);
    list.push(formatValueType(itemIds));
    item.children && (list = list.concat(getChildren(item.children, itemIds)));
  });
  return list;
}

/**
 * 获取属性值
 */
function getValue(array: string[], options: RenderOption[], ids: string[]) {
  let list: MultipleCascaderItemType[] = [];
  if (array.length === 1) {
    list.push(formatValueType(ids));
    const item = options.find(item => item.renderValue === array[0]);
    item && (list = list.concat(getChildren(item.children as RenderOption[], ids)));
  } else {
    const arr = array[0].split('-');
    list.push({
      level: Number(arr[0]),
      value: Number(arr[2]),
      renderIds: [],
    });
    const item = options.find(item => item.renderValue === array[0]);
    item && (list = list.concat(getValue([...array].slice(1), item.children as RenderOption[], ids)));
  }
  return list;
}

/**
 * 格式化类目品牌型号选项
 * @param list 选项
 * @param level 层数
 * @param pid 父id
 * 层数-父id-值
 */
function formatGoodsTypeOptions(list: Option[], level = 0, pid = 0): RenderOption[] {
  Array.isArray(list) &&
    list.forEach((item: any) => {
      item.renderValue = `${level}-${pid}-${item.value}`;
      item.children && formatGoodsTypeOptions(item.children, level + 1, item.value);
    });
  return list as any;
}

// 格式化成值类型
function formatValueType(renderIds: string[]): MultipleCascaderItemType {
  const arr = renderIds[renderIds.length - 1].split('-');
  return {
    level: Number(arr[0]),
    value: Number(arr[2]),
    renderIds,
  };
}

/**
 * @description: 记录搜索词
 * @param {*} text
 * @return {*}
 */
function searchHandle(text: string) {
  searchValue.value = text;
}
</script>

<style lang="less">
.multiple-cascader-search {
  .ant-cascader-menu {
    width: 100%;
  }
}
</style>
