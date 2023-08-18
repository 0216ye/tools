<template>
  <div class="cascade-date-picker">
    <a-radio-group
      v-model:value="previewValue"
      @change="changePreview"
    >
      <a-radio-button
        v-for="item in props.config"
        :key="item"
        :value="item"
      >
        <template v-if="item === 1">
          昨天
        </template>
        <template v-else>
          近{{ item }}天
        </template>
      </a-radio-button>
    </a-radio-group>
    <a-range-picker
      v-model:value="dateValue"
      format="YYYY-MM-DD"
      value-format="YYYY-MM-DD"
      @change="changeDateValue"
    />
  </div>
</template>
<script setup lang="ts">
import dayjs from 'dayjs';
import { onMounted, PropType, ref, watch } from 'vue';
// 需要的配置
const props = defineProps({
  value: {
    type: Array as PropType<string[]>,
    default: [],
  },
  config: {
    type: Array as PropType<number[]>,
    default: [1, 7, 30, 365],
  },
});
const emit = defineEmits<{
  (event: 'update:value', value: [] | [string, string]): void;
}>();

const previewDate: any = {};
const previewValue = ref(0);
const dateValue = ref<[string, string] | []>([]);

function changePreview() {
  dateValue.value = previewDate[previewValue.value].split(',');
}
function changeDateValue(value: [string, string] | null) {
  if (value == null) {
    // 避免日历弹窗
    return setTimeout(() => {
      previewValue.value = props.config[0];
      dateValue.value = previewDate[previewValue.value].split(',');
    }, 300);
  }
  const strValue = value.join(',');
  let key = 0;
  Object.keys(previewDate).forEach(date => {
    if (previewDate[date] === strValue) {
      key = Number(date);
    }
  });
  previewValue.value = key;
}

onMounted(() => {
  previewValue.value = props.config[0];
  props.config.forEach(num => {
    const startTime = dayjs().subtract(num, 'day').format('YYYY-MM-DD');
    const endTime = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
    previewDate[num] = `${startTime},${endTime}`;
  });

  dateValue.value = previewDate[previewValue.value].split(',');
  console.log(0);
});
watch(
  () => dateValue.value,
  (val: [string, string] | []) => {
    emit('update:value', val);
  },
  {
    deep: true,
  },
);
</script>
<style lang="less" scoped>
.ant-radio-group {
  margin-right: 8px;
}
</style>
