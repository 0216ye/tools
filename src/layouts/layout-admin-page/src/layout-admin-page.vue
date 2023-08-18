<template>
  <div class="layout-admin-page">
    <div
      :class="['page-top', topFixed ? 'page-top-fixed' : '']"
      :style="topStyle"
    >
      <slot name="breadcrumb">
        <page-breadcrumb :items="navs" />
      </slot>
      <div class="page-title-box flex-wrap flex-y-center flex-x-justify">
        <div class="title-text-box flex-wrap flex-y-center flex-x-justify">
          <slot name="title-prefix" />
          <h1 class="page-title-text">
            {{ title }}
          </h1>
          <slot name="title-suffix" />
        </div>
        <slot name="other-box" />
        <div class="extra-box">
          <slot name="extra" />
        </div>
      </div>
    </div>

    <div
      class="page-content"
      :style="contentStyle"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  navs: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: '',
  },
  contentStyle: {
    type: Object,
    default: undefined,
  },
  topStyle: {
    type: Object,
    default: undefined,
  },
  topFixed: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped lang="less">
.layout-admin-page {
  min-height: calc(100vh - 33px);
  margin: 16px;
  background-color: #fff;
  .page-top {
    margin-bottom: 24px;
    // padding: 24px;
    background-color: #fff;
    border-bottom: 1px solid #e9e9e9;
    &.page-top-fixed {
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    .page-title-box {
      padding: 24px;
    }
    .page-title-text {
      margin: 0;
      color: rgba(6, 21, 51, 0.85);
      font-weight: 500;
      font-size: 20px;
      /* stylelint-disable-next-line font-family-no-missing-generic-family-keyword */
      font-family: PingFangSC-Medium, PingFang SC;
      line-height: 32px;
    }
  }
}
</style>
