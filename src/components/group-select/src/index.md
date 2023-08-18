# GroupSelect 分组选择

将多级结构的数据，通过分成列表组的方式进行选择

```vue
<template>
  <GroupSelect
    :group-length="4"
    :options="categoryList"
    :value="categoryValue"
    @change="handleChange"
  >
    <template #footer="{ level }">
      <div
        v-if="[3, 4].includes(level)"
        class="search-item-help"
      >
        底部插槽
      </div>
    </template>
  </GroupSelect>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import GroupSelect from '@/components/group-select';
import { useCommodityCategory } from '@/composables/use-commodity-category';

const props = defineProps<{
  categoryValue: number[];
}>();

const emit = defineEmits<{
  (e: 'change', value: number[]): void;
}>();

const { getLevelOptions } = useCommodityCategory();
const categoryList = getLevelOptions({ disabledType: 'hide', cascader: true });

/** 选择分类 */
function handleChange(values: number[], titles: string[]) {
  emit('change', { values, titles });
}
</script>

<style lang="less" scoped>
.search-item-help {
  height: 33px;
  line-height: 33px;
  text-align: center;
  border-top: 1px solid rgba(0, 0, 0, 0.18);
}
</style>

```

:::

### 属性

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value(v-model) | 指定选中项 | string[]\|number[] | -- |
| options | 可选项数据源 | object[]           | --       |
| groupLength | 分组数量 | number | -- |
| disabled | 禁用状态 | boolean | -- |
| fieldNames | 自定义 options 中 label、name等字段 | object | -- |
| fieldNames.label | options 中 label字段 | string | label |
| fieldNames.value | options 中 value字段                | string | value    |
| fieldNames.disabled | options 中 disabled字段 | string | disabled |
| fieldNames.children | options 中 children字段 | string | children |

### 事件

| 事件名称 | 说明         | 回调参数              |
| -------- | ------------ | --------------------- |
| change   | 手动更改选择 | (value,label,options) |
