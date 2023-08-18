<template>
  <div>
    <div
      v-for="(imgSrc, index) in images"
      :key="imgSrc"
      class="img-wrap"
      :style="computedWrapStyle"
      @mousedown.stop
      @mouseenter.stop="e => onMouseEnter(index, e)"
      @mouseleave.stop="e => onMouseLeave(index, e)"
    >
      <div class="loading-tips img-tips">
        正在加载
      </div>
      <div class="error-tips img-tips">
        加载失败
      </div>
      <img
        v-lazy
        :data-index="index"
        :src="imgSrc"
        :style="computedImgStyle"
      >
      <transition name="fade">
        <FullscreenOutlined
          v-show="showPreview && showPreviewIndex === index"
          class="img-preview-btn"
          @click="openPreview(imgSrc, images)"
        />
      </transition>
    </div>
  </div>
</template>
<script>
/**
 * 渲染图片显示容器，可以传入数组或者字符串，以及图片宽度
 */
import { FullscreenOutlined } from '@ant-design/icons-vue';

export default {
  components: {
    FullscreenOutlined,
  },
  props: {
    // 图片列表
    img: {
      type: [String, Array],
      default: '',
    },
    width: {
      type: [String, Number],
      default: '70',
    },
    height: {
      type: [String, Number],
      default: 'auto',
    },
    preview: {
      type: Boolean,
      default: true,
    },
    fit: {
      type: String,
      default: 'contain', // object-fit参数
    },
    wrapStyle: {
      type: Object,
      default() {
        return {};
      },
    },
    imgStyle: {
      type: Object,
      default() {
        return {};
      },
    },
    padding: {
      type: [Number, String],
      default: 8,
    },
  },
  data() {
    return {
      images: [],
      showPreview: false,
      showPreviewIndex: 0,
    };
  },
  computed: {
    computedWrapStyle() {
      const { width, height, wrapStyle, padding } = this;
      return {
        width: isNaN(width) ? '' : `${width}px`,
        height: isNaN(height) ? '' : `${height}px`,
        padding: `${padding}px`,
        ...wrapStyle,
      };
    },
    computedImgStyle() {
      const { width, height, imgStyle, padding } = this;
      return {
        width: isNaN(width) ? width : `${width - padding * 2}px`,
        height: isNaN(height) ? height : `${height - padding * 2}px`,
        objectFit: this.fit,
        ...imgStyle,
      };
    },
  },
  watch: {
    img: {
      handler(value) {
        if (!value) {
          this.images = [];
          return;
        }
        if (typeof value === 'string') {
          this.images = [value];
        } else if (Array.isArray(value)) {
          this.images = value;
        } else {
          this.images = [];
        }
      },
      immediate: true,
    },
  },
  methods: {
    onMouseEnter(...args) {
      this.showPreviewBtn(args);
    },
    onMouseLeave(...args) {
      this.hidePreviewBtn(args);
    },
    showPreviewBtn([index, event]) {
      try {
        const img = event.target.querySelector('img');
        if (img.getAttribute('data-index') === String(index)) {
          this.showPreview = img.src && this.preview;
          this.showPreviewIndex = index;
        }
      } catch (e) {}
    },
    hidePreviewBtn() {
      this.showPreview = false;
    },
    openPreview(image, images) {
      if (!this.preview) {
        return;
      }
      this.$preview.open({
        imgs: images.map(src => src.replace(/\/[s,m]\//, '/o/')),
        index: images.indexOf(image),
      });
    },
  },
};
</script>
<style lang="less" scoped>
.img-wrap {
  position: relative;
  display: inline-block;
  color: #d9d9d9;
  text-align: center;
  border-radius: 2px;
  .img-preview-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1;
    padding: 3px;
    color: rgba(0, 0, 0, 0.5);
    font-size: 18px;
    background: #fff;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.3s ease 0s;
  }
  img {
    width: 100%;
    height: 100%;
  }
  .img-tips {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgb(192, 196, 204);
    font-size: 12px;
    background: rgb(255, 255, 255);
    opacity: 0;
    transition: opacity 1s ease;
  }
}
.loading {
  .loading-tips {
    opacity: 1;
  }
}
.error {
  .error-tips {
    opacity: 1;
  }
}
</style>
