<template>
  <div class="list-selection">
    <div class="search-input">
      <a-input
        v-model:value="filterText"
        placeholder="请输入搜索关键字"
      >
        <template #addonAfter>
          <SearchOutlined />
        </template>
      </a-input>
    </div>
    <ul
      ref="listContentRef"
      class="list-content"
    >
      <li
        v-for="(item, index) in filterData"
        :key="item[valueKey]"
        :class="{ 'item-selected': value === item[valueKey], 'item-disabled': disabled || Boolean(item[disabledKey]) }"
        @click="onSelectOption(item, index)"
      >
        {{ item[labelKey] }}
      </li>
    </ul>
    <div
      v-if="filterText && !filterData.length"
      class="list-empty"
    >
      暂无符合数据
    </div>
    <slot name="footer" />
  </div>
</template>

<script setup lang="ts" generic="T">
import { computed, nextTick, ref, watch } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';

interface Props {
  options: T[];
  value?: string | number;
  valueKey?: string | number | symbol;
  labelKey?: string | number | symbol;
  disabledKey?: string | number | symbol;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  value: undefined,
  valueKey: 'value',
  labelKey: 'label',
  disabledKey: 'disabled',
});

const emit = defineEmits<{
  (e: 'change', option: T, index: number): void;
}>();

const filterText = ref<string>('');
/** 筛选后的数据 */
const filterData = computed(() => {
  if (!filterText.value) {
    return props.options;
  }
  return props.options.filter(item => {
    const labelText = item[props.labelKey].toString().toLowerCase();
    return labelText.indexOf(filterText.value.toLowerCase()) > -1;
  });
});

let isAutoScroll = true;

function onSelectOption(option: T, index: number) {
  if (props.disabled || Boolean(option[props.disabledKey])) {
    return;
  }
  isAutoScroll = false;
  emit('change', option, index);
}

const optionHeight = 32;
const listContentRef = ref<HTMLElement>();
/** 滚动到选择点 */
function scrollToSelectedPosition() {
  // 手动选择时不需要滚动
  if (!isAutoScroll) {
    isAutoScroll = true;
    return;
  }
  if (!props.value || !filterData.value.length) {
    return;
  }
  const index = filterData.value.findIndex(item => item[props.valueKey] === props.value);
  if (listContentRef.value) {
    listContentRef.value.scrollTop = optionHeight * index - optionHeight / 2;
  }
}

watch(
  () => props.value,
  () => {
    nextTick(() => {
      scrollToSelectedPosition();
    });
  },
);
</script>

<style lang="less" scoped>
.list-selection {
  display: flex;
  flex-direction: column;
  height: 288px;
  color: rgba(0, 0, 0, 0.85);
  border: 1px solid rgba(0, 0, 0, 0.09);
}
.list-selection:nth-child(n + 2) {
  border-left: none;
}
.search-input {
  width: 100%;
  padding: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.18);
}
.list-content {
  flex: 1;
  margin: 0;
  padding: 0;
  overflow-y: scroll;
  list-style: none;
  li {
    display: inline-block;
    width: 100%;
    height: v-bind("optionHeight + 'px'");
    padding: 0 12px;
    overflow: hidden;
    line-height: v-bind("optionHeight + 'px'");
    white-space: nowrap;
    text-overflow: ellipsis;
    vertical-align: bottom;
    word-wrap: break-word;
    cursor: pointer;
  }
  li:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }
  .item-selected {
    font-weight: bold;
    background-color: rgba(0, 0, 0, 0.06);
  }
  .item-disabled {
    color: #999;
    cursor: not-allowed;
  }
}
.list-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgba(0, 0, 0, 0.45);
  font-size: 19px;
}
</style>
