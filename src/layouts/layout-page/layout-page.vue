<template>
  <div
    ref="page"
    class="page"
  >
    <div :class="['header', 'flex-wrap', 'flex-y-center', ...headerClass]">
      <slot name="title">
        <a-breadcrumb class="header-title">
          <a-breadcrumb-item>
            {{ title }}
          </a-breadcrumb-item>
        </a-breadcrumb>
      </slot>
      <slot name="extra" />
    </div>
    <div :class="['container', isWindowScroll ? 'wscroll' : '']">
      <slot name="container" />
    </div>
    <a-back-top
      v-if="showBackTop"
      :target="() => backTopTarget"
    />
  </div>
</template>
<script>
/**
 * 通用的框架页，包含头部，区域滚动内容区。
 */

export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    headerClass: {
      type: Array,
      default() {
        return [];
      },
    },
    // 是否使用窗口滚动
    isWindowScroll: {
      type: Boolean,
      default: false,
    },
    showBackTop: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      backTopTarget: window,
    };
  },
  watch: {
    isWindowScroll: {
      handler(value) {
        if (value) {
          this.backTopTarget = window;
        } else {
          this.$nextTick(() => {
            this.backTopTarget = this.$refs.page;
          });
        }
      },
      immediate: true,
    },
  },
  methods: {
    scrollTop() {
      if (this.isWindowScroll) {
        window.scrollTop = '0';
      } else {
        this.$refs.page.scrollTop = '0';
      }
    },
  },
};
</script>
<style lang="less" scoped>
.wscroll {
  height: auto;
}
.header {
  right: 0;
  width: auto;
  min-width: 800px;
  margin: 0 16px;
}
.container {
  min-width: 1000px;
}
</style>
