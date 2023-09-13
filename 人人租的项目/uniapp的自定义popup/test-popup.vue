<script lang="ts" setup>
import Popup from '@/components/popup-v2.vue';
import { ref } from 'vue';

const show = ref(false);
const type = ref();
const popupRef = ref();

function openPopup(openType: string) {
  type.value = openType;
  show.value = true;
}

function close() {
  show.value = false;
}
</script>
<template>
  <Popup
    ref="popupRef"
    v-model:show="show"
    :type="type"
  >
    <!-- footer-safe 的第一种用法，放置在父容器上 -->
    <view
      class="footer-safe"
      :style="{
        width: type === 'top' || type === 'bottom' ? '100%' : '500rpx',
        height: type === 'left' || type === 'right' ? '100%' : '800rpx',
        overflow: 'auto',
        background: '#fff',
        borderRadius: type === 'center' ? '10rpx' : '',
      }"
    >
      <view
        v-if="type === 'bottom'"
        class="common-popup-close-icon"
        @tap="close"
      />
      <view
        v-for="item in 88"
        :key="item"
        class="list-item"
        @tap="close"
      >
        {{ item }}列表项目 {{ show }}
      </view>
      <!-- footer-safe 的第二种用法，插入一个占位节点内 -->
      <view class="footer-safe" />
    </view>
  </Popup>
  <view>
    <view class="title">
      popup 测试
    </view>
    <view
      class="btn"
      @tap="openPopup('center')"
    >
      popup center
    </view>
    <view
      class="btn"
      @tap="openPopup('top')"
    >
      popup top
    </view>
    <view
      class="btn"
      @tap="openPopup('bottom')"
    >
      popup bottom
    </view>
    <view
      class="btn"
      @tap="openPopup('left')"
    >
      popup left
    </view>
    <view
      class="btn"
      @tap="openPopup('right')"
    >
      popup right
    </view>
  </view>
</template>
<style lang="scss" scoped>
.btn,
.title {
  width: 400rpx;
  height: 100rpx;
  margin: 0 auto 50rpx;
  padding: 0 20rpx;
  line-height: 100rpx;
  text-align: center;
  background-color: #fff;
  border-radius: 30rpx;
}

.title {
  background-color: transparent;
}

.list-item {
  padding: 16rpx;
  line-height: 50rpx;
  text-align: center;
}
</style>
