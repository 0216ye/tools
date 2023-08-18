<template>
  <div
    class="picture-overlay"
    :style="{
      width: (!Array.isArray(size) ? size : size[0]) + 'px',
      height: (!Array.isArray(size) ? size : size[1]) + 'px',
    }"
  >
    <template v-if="url[0] ?? '' != ''">
      <img
        alt="商品图片"
        class="picture-overlay__main"
        :src="url[0]"
      >
      <img
        class="picture-overlay__background"
        :src="url[1]"
      >
    </template>
    <template v-else>
      <img
        alt="商品图片"
        class="picture-overlay__origin"
        :src="origin"
      >
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';

export default defineComponent({
  props: {
    url: {
      type: Object as PropType<[string, string]>,
      default: () => ['', ''],
    },
    size: {
      type: String as PropType<[string, string] | string>,
      default: '50',
    },
    origin: {
      type: String,
      default: '',
    },
  },
});
</script>

<style lang="less">
.picture-overlay {
  position: relative;
  display: inline-block;
  &__origin,
  &__main {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  &__background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
