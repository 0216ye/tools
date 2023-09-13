<template>
  <div
    v-show="show"
    class="loading-wrap"
  >
    <a-spin size="large" />
  </div>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style lang='less' scoped>
  .loading-wrap {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
