<template>
  <div class="multiple-select">
    <a-form-item-rest>
      <a-radio-group
        v-model:value="type"
        class="search-label"
      >
        <a-radio-button
          v-for="item in labelList"
          :key="item.value"
          :value="item.value"
        >
          {{ item.name }}
        </a-radio-button>
      </a-radio-group>
    </a-form-item-rest>
    <slot name="radio-after" />
    <a-select
      v-model:value="bindValue"
      allow-clear
      class="search-value"
      :default-active-first-option="false"
      :field-names="fieldNames"
      :filter-option="false"
      :max-tag-count="maxTagCount"
      :max-tag-text-length="maxTagTextLength"
      mode="multiple"
      :not-found-content="null"
      :options="options"
      :placeholder="placeholder"
      :show-arrow="false"
      show-search
      @change="changeHandle"
      @search="debounceSearch"
    >
      <template #notFoundContent>
        <a-spin
          v-show="loading"
          size="small"
        />
      </template>
    </a-select>
  </div>
</template>

<script setup lang="ts">
import { getBusinessOptionsByName, getBusinessOptionsById } from './server';

import { ref, PropType, computed } from 'vue';
import { debounce } from '@/utils/base';

type Option = Record<string, string | number>;

interface Label {
  name: string;
  value: number;
  callback: (searchText: string) => Promise<Option[]>;
}

const props = defineProps({
  labelList: {
    type: Array as PropType<Label[]>,
    default() {
      return [
        {
          name: '商家名',
          value: 1,
          async callback(searchText: string) {
            const res = await getBusinessOptionsByName({ company: searchText });
            return res.data;
          }
        },
        {
          name: '商家id',
          value: 2,
          async callback(searchText: string) {
            const res = await getBusinessOptionsById({ server_id: searchText });
            res.data.map((item: any) => {
              item.server_id = Number(item.server_id);
              return item;
            });
            return res.data;
          }
        }
      ]
    }
  },
  fieldNames: {
    type: Object as PropType<{
      label: string;
      value: string;
    }>,
    default() {
      return {
        label: 'company',
        value: 'server_id'
      }
    }
  },
  value: {
    type: Array as PropType<number[]>,
    default() {
      return [];
    }
  },
  placeholder: {
    type: String,
    default: '搜索商家名/商家id'
  },
  maxTagCount: {
    type: Number,
    default: 2
  },
  maxTagTextLength: {
    type: Number,
    default: 6
  }
});
const emit = defineEmits(['update:value', 'change']);
const type = ref<number>(props.labelList[0].value);
const bindValue = computed({
  get() {
    return props.value;
  },
  set(value) {
    emit('update:value', value);
  }
});
const options = ref<Option[]>([]);
const loading = ref(false);
// 商家名或者id搜索栏-搜索事件
const debounceSearch = debounce(search, 200);
async function search(searchText: string) {
  if (!searchText) return;
  loading.value = true;
  const labelItem = props.labelList.find(item => item.value === type.value) as Label;
  options.value = await labelItem.callback(searchText).finally(() => loading.value = false);
}

/**
 * @description: 切换
 * @param {*} e
 * @return {*}
 */
function changeHandle(e: any) {
  emit('change', e);
}
</script>

<style scoped lang="less">
.multiple-select {
  display: flex;
  align-items: center;
}
.search-label {
  flex: 0 0 auto;
  ::v-deep(> label:last-child) {
    border-radius: 0;
  }
}
.search-value {
  flex: 1 1 auto;
  ::v-deep(.ant-select-selector) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}
</style>