<template>
  <a-space :size="16">
    <a-space :size="8">
      <a-button
        :disabled="pagination!.current! <= 1"
        @click="toPrev"
      >
        上一页
      </a-button>
      <a-button
        :disabled="currentLength < pagination!.pageSize!"
        @click="toNext"
      >
        下一页
      </a-button>
    </a-space>
    <a-space :size="4">
      <a-typography-text type="secondary">
        当前第 {{ pagination!.current! }} 页, 到
      </a-typography-text>
      <a-input-number
        v-model:value="page"
        :disabled="currentLength < pagination!.pageSize!"
        :min="1"
        style="width: 60px"
        @press-enter="toPage"
      />
      <a-typography-text type="secondary">
        页
      </a-typography-text>
    </a-space>
    <a-button
      :disabled="currentLength < pagination!.pageSize!"
      @click="toPage"
    >
      确定
    </a-button>
  </a-space>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue';
import type { TablePaginationConfig } from 'ant-design-vue';
import { PropType, ref } from 'vue';

const props = defineProps({
  pagination: {
    type: Object as PropType<TablePaginationConfig>,
    default: 1,
  },
  currentLength: {
    type: Number,
    default: 10,
  },
  onChange: {
    type: Function,
    default: () => ({}),
  },
});

const page = ref<number | undefined>();

const toPage = () => {
  console.log(page.value);
  if (!page.value) return message.warn('请输入对应跳转的页数');
  let res = parseInt(`${page.value}`);
  if (isNaN(res)) {
    page.value = undefined;
    return message.error('输入了非法页数，请重新输入');
  }
  props.onChange(+res);
  page.value = undefined;
};
const toPrev = () => {
  if (!props.pagination.current || props.pagination.current <= 1) {
    return message.warn('已经是第一页了，不能再往前了');
  }
  props.onChange(props.pagination.current - 1);
};
const toNext = () => {
  props.onChange(props.pagination?.current || 0 + 1);
};
</script>
