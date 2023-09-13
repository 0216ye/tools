<template>
  <div class="group-select">
    <ListSelect
      v-for="i in groupLength"
      :key="i"
      class="group-list"
      :disabled="disabled"
      :disabled-key="fieldNamesObj.disabled"
      :label-key="fieldNamesObj.label"
      :options="selectGroup[i - 1]"
      :value="value?.[i - 1]"
      :value-key="fieldNamesObj.value"
      @change="option => handleChange(option, i - 1)"
    >
      <template #footer>
        <slot
          :level="i"
          name="footer"
          :options="selectGroup[i - 1]"
          :value="value[i - 1]"
        />
      </template>
    </ListSelect>
  </div>
</template>

<script setup lang="ts" generic="T, V extends string | number">
import { Ref, computed, ref, watch } from 'vue';
import ListSelect from './list-select.vue';

type TKey = keyof T;

interface IFieldNames {
  label?: TKey;
  value?: TKey;
  disabled?: TKey;
  children?: TKey;
}

const props = defineProps<{
  /** 值 */
  value: V[];
  /** 选择项 */
  options: T[];
  /** 自定义关联字段名 */
  fieldNames?: IFieldNames;
  /** 分组数 */
  groupLength: number;
  /** 禁用状态 */
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:value', value: V[]): void;
  (e: 'change', value: V[], label: string[], options: T[]): void;
}>();

const fieldNamesObj = computed(() => {
  return {
    label: props.fieldNames?.label || ('label' as TKey),
    value: props.fieldNames?.value || ('value' as TKey),
    disabled: props.fieldNames?.disabled || ('disabled' as TKey),
    children: props.fieldNames?.children || ('children' as TKey),
  };
});

const selectGroup: Ref<T[][]> = ref([]);
const selectLabels: Ref<string[]> = ref([]);
const selectValues: Ref<V[]> = ref([]);
const selectOptions: Ref<T[]> = ref([]);

// 根据选择的值，设置各个组别的列表内容
watch(
  [() => props.value, () => props.options],
  () => {
    selectGroup.value = [];
    selectLabels.value = [];
    selectValues.value = [];
    selectOptions.value = [];
    let list = props.options;
    for (let i = 0; i < props.groupLength; i++) {
      const data = list.find(item => item[fieldNamesObj.value.value] === props.value[i]);
      selectGroup.value.push(list);
      selectOptions.value.push(data as T);
      selectValues.value.push(data?.[fieldNamesObj.value.value] as V);
      selectLabels.value.push(data?.[fieldNamesObj.value.label] as string);
      list = (data?.[fieldNamesObj.value.children] as T[]) ?? [];
    }
  },
  {
    immediate: true,
    deep: true,
  },
);

/** 选择 */
function handleChange(option: T, index: number) {
  const labels = selectLabels.value.slice(0, index);
  const values = selectValues.value.slice(0, index);
  const options = selectOptions.value.slice(0, index);
  labels[index] = option[fieldNamesObj.value.label] as string;
  values[index] = option[fieldNamesObj.value.value] as V;
  options[index] = option;
  emit('change', values, labels, options);
  emit('update:value', values);
}

const widthRatio = computed(() => (1 / props.groupLength) * 100 + '%');
</script>

<style lang="less" scoped>
.group-select {
  display: flex;
  .group-list {
    width: v-bind('widthRatio');
  }
}
</style>
