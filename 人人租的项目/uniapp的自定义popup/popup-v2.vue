<script lang="ts" setup>
import { watch, ref, onUnmounted } from 'vue';
import config from '@/config';

/**
 * 弹窗组件，合并了之前的 popup 和 alert-slot 组件，prop.type=center 就是 alert-slot 的效果
 * 示例：src/pages-test/test/test-popup.vue
 *
 * 这个组件需要尽量保持精简，不要像之前 popup alert alert-slot 那样加一大堆东西
 *
 * 提示：
 * 如果同一父容器内的 popupA 需要覆盖在 popupB 上面，那么在页面代码中的节点顺序 popupA 要在 popupB 的后面。
 * 或者通过 props.zIndex 手动设定他们的层级。
 *
 * popup 为bottom类型时，
 * 使用 <view class="common-popup-close-icon" /> 来做关闭按钮。使用 <view class="footer-safe"/> 来适配底部安全区域。
 *
 * @property props.type 弹出类型 center | top | bottom | left | right
 * @property props.show 组件开关状态
 * @property props.showMask 是否显示背景
 * @property props.maskClosable 是否可以点击遮罩关闭组件
 * @property props.maskBackgroundColor 遮罩层的背景
 * @property props.enterDuration 进入动画时长，进入动画比离开动画时长长一些，动画效果更丝滑
 * @property props.outDuration 离开动画时长（微信/app不支持，h5/字节小程序支持）
 * @property props.zIndex 层叠级别
 *
 * @todo
 * 解决 h5 环境下 <popup type="center" :show="A"></popup> <custom-service :show="A" />
 * 先触发 A，再触发 B，产生的异常。似乎是uniapp框架的bug，有空再看看。
 */
const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  show: {
    type: Boolean,
    default: false,
  },
  showMask: {
    type: Boolean,
    default: true,
  },
  maskClosable: {
    type: Boolean,
    default: true,
  },
  maskBackgroundColor: {
    type: String,
    default: 'rgba(0, 0, 0, 0.4)',
  },
  enterDuration: {
    type: Number,
    default: config.isBrand ? 300 : 450,
  },
  outDuration: {
    type: Number,
    default: config.isBrand ? 300 : 200,
  },
  zIndex: {
    type: Number,
    default: 99,
  },
});

const emit = defineEmits(['change', 'update:show']);

// 过渡容器的动画类名
let animationModeClass = ref<string[]>([]);
// 过渡容器的样式
let animationStyles = ref<Record<string, number | string>>({});
// 过渡遮罩的样式
// eslint-disable-next-line vue/no-setup-props-destructure
const maskAnimationStyle: Record<string, number | string> = {
  position: 'fixed',
  bottom: 0,
  top: 0,
  left: 0,
  right: 0,
  backgroundColor: props.maskBackgroundColor || 'rgba(0, 0, 0, 0.4)',
};
watch(
  () => props.type,
  type => {
    switch (type) {
      // 居中弹窗的容器为 flex column 布局，并且水平居中垂直居中
      case 'center':
        animationModeClass.value = ['zoom-in', 'fade'];
        animationStyles.value = {
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        };
        break;
      // 左弹窗的容器为 flex column 布局
      case 'left':
        animationModeClass.value = ['slide-left'];
        animationStyles.value = {
          position: 'fixed',
          bottom: 0,
          left: 0,
          top: 0,
          display: 'flex',
          flexDirection: 'column',
        };
        break;
      // 右弹窗的容器为 flex column 布局
      case 'right':
        animationModeClass.value = ['slide-right'];
        animationStyles.value = {
          position: 'fixed',
          bottom: 0,
          right: 0,
          top: 0,
          display: 'flex',
          flexDirection: 'column',
        };
        break;
      case 'bottom':
        animationModeClass.value = ['slide-bottom'];
        animationStyles.value = {
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
        };
        break;
      case 'top':
        animationModeClass.value = ['slide-top'];
        animationStyles.value = {
          position: 'fixed',
          left: 0,
          right: 0,
        };
        break;
    }
  },
  {
    immediate: true,
  },
);

const showAnimation = ref(false);
const showPopup = ref(false);
let timer: unknown = 0;

const open = () => {
  if (!['center', 'top', 'bottom', 'left', 'right'].includes(props.type)) {
    console.warn('popup 无法打开，type 非 center, top, bottom, left, right 其中的任何一个');
    return;
  }
  clearTimeout(timer as number);

  showAnimation.value = true;
  showPopup.value = true;
  emit('change', true);
  emit('update:show', true);
};

const close = () => {
  showAnimation.value = false;
  let duration = props.enterDuration;
  // #ifdef H5 || MP-TOUTIAO
  duration = props.outDuration;
  // #endif
  timer = setTimeout(() => {
    emit('change', false);
    emit('update:show', false);
    showPopup.value = false;
  }, duration);
};

const onMaskTap = () => {
  if (props.maskClosable && showPopup.value && showAnimation.value) {
    close();
  }
};

watch(
  () => props.show,
  show => {
    if (show && !showPopup.value && !showAnimation.value) {
      open();
    }
    if (!show && showPopup.value && showAnimation.value) {
      close();
    }
    // #ifdef H5
    (document.querySelector('body') as HTMLElement).style.overflow = show ? 'hidden' : 'visible';
    // #endif
  },
  {
    immediate: true,
  },
);

onUnmounted(() => {
  // #ifdef H5
  (document.querySelector('body') as HTMLElement).style.overflow = 'visible';
  // #endif
});
</script>
<template>
  <view
    v-if="showPopup || showAnimation"
    class="popup"
    :class="[type]"
    :style="{
      zIndex,
    }"
  >
    <uni-transition
      v-if="showMask"
      :duration="showAnimation ? enterDuration : outDuration"
      mode-class="fade"
      :show="showAnimation"
      :styles="maskAnimationStyle"
      @click="onMaskTap"
    />
    <uni-transition
      :duration="showAnimation ? enterDuration : outDuration"
      :mode-class="animationModeClass"
      :show="showAnimation"
      :styles="animationStyles"
      @click="onMaskTap"
    >
      <view
        class="popup-wrap"
        :class="[type]"
        @tap.stop
      >
        <slot />
      </view>
    </uni-transition>
  </view>
</template>
<style lang="scss" scoped>
.popup {
  position: fixed;

  /* 1010 */
  z-index: 99;

  &.top,
  &.left,
  &.right {
    /* #ifdef H5 */
    top: var(--window-top);

    /* #endif */

    /* #ifndef H5 */
    top: 0;

    /* #endif */
  }

  .popup-wrap {
    position: relative;
    display: block;

    &.left,
    &.right {
      flex: 1;

      /** 方便子容器继承高度处理滚动 */
      height: 100vh;

      /* #ifdef H5 */
      padding-top: var(--window-top);

      /* #endif */

      /* #ifndef H5 */
      padding-top: 0;

      /* #endif */
    }
  }
}
</style>
