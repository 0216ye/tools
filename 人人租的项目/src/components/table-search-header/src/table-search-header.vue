<template>
  <div class="table-search-header">
    <div class="table-header-text">
      {{ column.title }}
    </div>
    <div class="field-search">
      <form-create
        v-if="column.searchConfig"
        v-model:value="searchValue"
        :form-group="column.searchConfig"
        :origin-props="{ onKeyup: trigger }"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, watch } from 'vue';
import { SearchHeaderExtra } from '@/components/form-create/src/typing';
import { ColumnProps } from 'ant-design-vue/lib/table';

export default defineComponent({
  name: 'table-search-header',
  props: {
    value: { type: [String, Number, Array], default: undefined },

    column: {
      type: Object as PropType<ColumnProps & SearchHeaderExtra>,
      required: true,
    },
  },
  emits: ['update:value', 'search'],
  setup(props, { emit }) {
    const key = (props.column.searchKey || props.column.key || props.column.dataIndex || 'value') as string;
    const searchValue = reactive({ [key]: props.value });

    watch(searchValue, val => {
      emit('update:value', val[key]);
      if (props.column.immediate) emit('search');
    });

    function trigger(e: KeyboardEvent) {
      if (e.code === 'Enter') {
        emit('search');
      }
    }

    return {
      searchValue,
      trigger,
    };
  },
});
</script>

<style lang="less" scoped>
.table-header-text {
  padding-bottom: 16px;
}
.field-search {
  height: 65px;
  margin: 0 -16px -16px;
  padding: 16px;
  background-color: #fff;
  border-top: 1px solid #f0f0f0;
}
</style>
