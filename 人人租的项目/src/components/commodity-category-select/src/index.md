# CommodityCategorySelect 商品分类选择

针对商品分类的中各个场景下封装的分类下拉选择

```vue
<template>
  <CommodityCategorySelect
    cascader
    change-on-select
    disabled-type="hide"
    placeholder="请选择发布类目"
    size="large"
    :value="categoryValue"
    @change="onSelectCategory"
  />
</template>

<script setup lang="ts">
import CommodityCategorySelect from '@/components/commodity-category-select';
import { IOption } from '@/composables/use-commodity-category';

defineProps<{
  categoryValue: number[];
}>();

const emit = defineEmits<{
  (e: 'change', value: number[]): void;
}>();

/** 选择分类 */
function onSelectCategory(values?: number[], selectedData?: IOption[]) {
  const titles = selectedData?.map(item => item.label);
  console.log(titles);
  emit('change', values ?? []);
}
</script>
```

:::

### 属性

| 参数           | 说明                                                | 类型                               | 默认值  |
| -------------- | --------------------------------------------------- | ---------------------------------- | ------- |
| value(v-model) | 指定选中项                                          | string\|string[]\|number\|number[] | --      |
| disabledType   | 禁用项的特殊处理，'hide':隐藏；'enable':启用        | 'hide'\|'enable'                   | --      |
| level          | 获取到的分类级别：1 一级\| 2 二级\| 3 品牌\| 4 模型 | 1 \| 2 \| 3 \| 4                   | 4       |
| disabled       | 禁用状态                                            | boolean                            | false   |
| cascader       | 是否为联级选择                                      | boolean                            | false   |
| multiple       | 是否多选                                            | boolean                            | false   |
| changeOnSelect | 联级选择下，是否点选每级菜单选项值都发生变化        | boolean                            | false   |
| size           | 大小                                                | 'large' \| 'default' \| 'small'    | default |

### 事件

| 事件名称 | 说明         | 回调参数        |
| -------- | ------------ | --------------- |
| change   | 手动更改选择 | (value,options) |
