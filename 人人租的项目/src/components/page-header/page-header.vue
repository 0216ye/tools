<template>
  <header class="page-header">
    <a-breadcrumb>
      <a-breadcrumb-item
        v-for="(item, index) in breadcrumbList"
        :key="index"
      >
        {{ item }}
      </a-breadcrumb-item>
    </a-breadcrumb>
    <div class="page-title">
      <div class="t1">
        {{ title }}
        <span class="descript">
          <slot name="descript" />
        </span>
      </div>
      <div class="right">
        <slot />
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    breadcrumbList: {
      type: Array,
      default() {
        return [];
      },
    },
    title: {
      type: String,
      default: '',
    },
  },
});
</script>

<style scoped lang="less">
.page-header {
  padding: 16px 24px 0;
  background: #fff;
  border-radius: 2px 0 0 2px;
  ::v-deep(.ant-breadcrumb-link) {
    font-size: 12px;
  }
  ::v-deep(.ant-breadcrumb-link:last-child) {
    color: #000;
    font-size: 12px;
  }
  .funnel-model-add {
    box-sizing: border-box;
    padding: 16px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
  }
  .t1 {
    font-weight: bold;
    font-size: 16px;
  }
}
.page-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 56px;
  padding: 12px 0;
  background: #fff;
  ::v-deep(.ant-btn > .anticon + span) {
    margin-left: 4px;
  }
  .descript {
    margin-left: 8px;
    color: rgba(0, 0, 0, 0.45);
    font-weight: normal;
    font-size: 14px;
  }
}
</style>
