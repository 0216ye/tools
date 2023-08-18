<template>
  <div
    class="fold-collapse"
    :class="value ? 'show' : 'hide'"
  >
    <div
      v-if="isSwitch"
      class="collapse-header"
      @click="expandChange"
    >
      <slot name="button">
        <svg
          class="icon"
          fill="currentColor"
          height="1em"
          p-id="10719"
          t="1642833585126"
          version="1.1"
          viewBox="0 0 1024 1024"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M512 737c-6.106 0-11.894-2.731-15.781-7.446l-337.5-409.081c-5.042-6.116-6.096-14.584-2.721-21.754 3.375-7.149 10.585-11.721 18.501-11.721h675c7.916 0 15.126 4.571 18.501 11.721 3.385 7.169 2.321 15.638-2.721 21.754l-84.375 102.273c-7.19 8.713-20.087 9.941-28.79 2.762-8.724-7.19-9.962-20.087-2.771-28.8l56.762-68.799h-588.212l294.106 356.492 110.782-134.284c7.2-8.724 20.107-9.951 28.79-2.771 8.724 7.19 9.962 20.087 2.771 28.79l-126.563 153.409c-3.887 4.725-9.675 7.456-15.781 7.456z"
            p-id="10720"
          />
        </svg>
      </slot>
    </div>
    <div class="content">
      <transition
        :duration="550"
        name="collapse-content"
        @after-leave="onAfterLeave"
        @before-leave="onBeforeLeave"
        @leave="onLeave"
      >
        <div
          v-show="value"
          ref="CollapseContent"
          class="collapse-content"
        >
          <slot />
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  value: {
    type: Boolean,
    default: true,
  },
  isSwitch: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:value']);

/**
 * @description: 展开关闭变化
 * @return {*}
 */
function expandChange() {
  emit('update:value', !props.value);
}

/**
 * @description: 在 leave 钩子之前调用
 * @param {*} el
 * @return {*}
 */
function onBeforeLeave(el: HTMLElement) {
  el.style.height = el.clientHeight + 'px';
}

/**
 * @description: 在离开过渡开始时调用
 * @param {*} el
 * @return {*}
 */
function onLeave(el: HTMLElement) {
  el.style.height = 0 + 'px';
}

/**
 * @description: 在离开过渡完成
 * @param {*} el
 * @return {*}
 */
function onAfterLeave(el: HTMLElement) {
  el.style.height = 'auto';
}
</script>

<style scoped lang="less">
.fold-collapse {
  width: 100%;
  .collapse-header {
    display: flex;
    justify-content: center;
    background: #fff;
    cursor: pointer;
    .icon {
      font-size: 16px;
      transform: rotate(180deg);
    }
  }
  .collapse-header:hover {
    .icon {
      color: var(--ant-primary-color);
    }
  }
  .content {
    overflow: hidden;
  }
}
.fold-collapse.show {
  .collapse-header {
    .icon {
      transform: rotate(0);
    }
  }
  .content {
    .collapse-content {
      transition: all 0.5s ease-in-out;
    }
  }
}

.collapse-content-enter-active {
  transition: all 0.5s ease-in-out;
}
.collapse-content-leave-active {
	transition: all 0.3s ease-in-out;
}

.collapse-content-enter-from,
.collapse-content-leave-to {
  opacity: 0;
}
</style>
