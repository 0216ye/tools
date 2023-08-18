<template>
  <div class="ratio-card">
    <div class="card-title">
      {{ props.value.title }}
      <template v-if="props.value.desc">
        <a-tooltip :title="props.value.desc">
          <question-circle-outlined />
        </a-tooltip>
      </template>
    </div>
    <div class="card-value">
      <slot name="prevIcon">
        {{ props.value.prevIcon }}
      </slot>
      <span>
        {{ props.value.value }}
      </span>
      <slot name="nextIcon">
        <span class="next-icon">{{ props.value.nextIcon }}</span>
      </slot>
    </div>
    <div class="card-ratio">
      日环比
      <span :class="props.value.trend === 'up' ? 'ratio-up' : 'ratio-down'">{{ props.value.ratio }}%
        <template v-if="props.value.trend === 'up'">
          <caret-up-outlined />
        </template>
        <template v-else>
          <caret-down-outlined />
        </template>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, watch } from 'vue';
import { CaretUpOutlined, CaretDownOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue';

import { IRatioValue } from './data';

const props = defineProps({
  value: {
    type: Object as PropType<IRatioValue>,
    required: true,
  },
});
watch(
  () => props.value,
  (value, oldValue) => {
    console.log({
      value,
      oldValue,
    });
  },
  {
    deep: true,
  },
);
</script>
<style lang="less" scoped>
.card-title {
  display: flex;
  align-items: center;
  color: rgba(6, 21, 51, 0.65);
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  &::before {
    display: inline-block;
    width: 4px;
    height: 14px;
    margin-right: 4px;
    line-height: 22px;
    background: #3777ff;
    border-radius: 2px;
    content: '';
  }
}
.card-value {
  margin: 4px 0 8px;
  color: rgba(6, 21, 51, 0.85);
  font-weight: 500;
  font-size: 32px;
  line-height: 40px;
}
.card-ratio {
  color: rgba(6, 21, 51, 0.45);
  font-size: 14px;
  line-height: 22px;
}
.ratio-up {
  color: #ff4a57;
}
.ratio-down {
  color: #23d194;
}
.next-icon {
  margin-left: 4px;
  color: rgba(6, 21, 51, 0.45);
  font-size: 14px;
  line-height: 22px;
}
.anticon-question-circle {
  margin-left: 4px;
}
</style>
