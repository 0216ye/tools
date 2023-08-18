<template>
  <div class="card">
    <div class="title">
      <span>{{ title }}</span>
      <a-tooltip class="description-icon">
        <template #title>
          {{ description }}
        </template>
        <info-circle-outlined :style="{ color: 'rgba(6, 21, 55, 0.25)' }" />
      </a-tooltip>
      <slot name="desc" />
    </div>
    <div class="time">
      <a-tooltip class="description-icon">
        <template #title>
          {{ time }}
        </template>
        {{ time }}
      </a-tooltip>
    </div>
    <div class="number-value">
      <span class="value">{{ formatValue(renderValue) }}</span>
      <span class="unit">{{ props.unit }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import gsap from 'gsap';

import { InfoCircleOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  time: {
    type: String,
    default: '',
  },
  value: {
    type: Number,
    default: 0,
  },
  unit: {
    type: String,
    default: '个',
  },
  remain: {
    type: Number,
    default: 2,
  },
});

const renderValue = ref<any>(0);

watch(
  () => props.value,
  value => {
    gsap.to(renderValue, { duration: 0.5, value });
  },
);

function formatValue(value: number) {
  if (!value) return value;
  if (/^\d{9,}/.test(String(value))) return (value / 10000).toFixed(2) + '万';
  if (/^\d{7,}/.test(String(value))) return value.toFixed(0);
  return /\d+\.\d+/.test(String(value)) ? value.toFixed(props.remain) : value.toFixed(0);
}
</script>

<style scoped lang="less">
@import '@/style/variables.less';
.card {
  padding: 20px 24px 24px;
  font-size: 11px;
  background-color: #fff;
  border-radius: 4px;
}
.title {
  color: @font-black-65;
  font-weight: bold;
  white-space: nowrap;
  .description-icon {
    margin-left: 6px;
  }
}
.time {
  margin-top: 4px;
  overflow: hidden;
  color: @font-black-45;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.number-value {
  margin-top: 8px;
  white-space: nowrap;
  .value {
    font-weight: bold;
    font-size: 40px;
    line-height: 48px;
  }
  .unit {
    margin-left: 4px;
    color: @font-black-45;
  }
}
</style>
