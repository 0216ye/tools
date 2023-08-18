<template>
  <div
    v-show="previewVisible"
    ref="previewBox"
    class="img-preview-wrap"
  >
    <div
      class="img-preview-close"
      @click="closeImgPreview"
    >
      <CloseCircleOutlined class="close-icon" />
    </div>
    <div class="img-list-wrap">
      <img
        ref="imgBox"
        :src="imagesList[imgRect.current]"
        :style="imgStyle"
      >
    </div>
    <!-- 图片预览工具 start -->
    <div class="img-tools-wrap">
      <CaretLeftFilled
        v-if="imagesList.length > 1"
        :class="['icon-btn', { disabled: imgRect.current === 0 }]"
        @click="prev"
      />
      <CaretRightFilled
        v-if="imagesList.length > 1"
        :class="['icon-btn', { disabled: imgRect.current === imagesList.length - 1 }]"
        @click="next"
      />
      <UndoOutlined
        class="icon-btn"
        @click="rotateLeft"
      />
      <RedoOutlined
        class="icon-btn"
        @click="rotateRight"
      />
      <ZoomInOutlined
        class="icon-btn"
        @click="zoomIn"
      />
      <ZoomOutOutlined
        class="icon-btn"
        @click="() => zoomOut()"
      />
    </div>
    <!-- 图片预览工具 end -->
  </div>
</template>
<script>
import {
  CloseCircleOutlined,
  CaretLeftFilled,
  CaretRightFilled,
  UndoOutlined,
  RedoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons-vue';

export default {
  components: {
    CloseCircleOutlined,
    CaretLeftFilled,
    CaretRightFilled,
    UndoOutlined,
    RedoOutlined,
    ZoomInOutlined,
    ZoomOutOutlined,
  },
  props: {
    imgs: {
      // 图片列表
      type: Array,
      default: () => [],
    },
    visible: {
      // 是否显示
      type: Boolean,
      default: false,
    },
    index: {
      type: [String, Number],
      default: 0,
    },
  },
  emits: ['update:visible'],
  data() {
    return {
      addScale: 0.2, // 单位增量
      reduceScale: 0.2, // 单位减量
      minSize: 50, // 图片宽高比它大，则还可以缩小。
      scaleRatio: 0.5, // 负值前的最后一次缩小，尺寸仍大于minSize，则单位减量*scaleRatio作为新的单位减量
      scaleMirror: [], // 缩小图片减量可能会改变，用于放大图片时镜像增量
      imgRect: {}, // 图片尺寸旋转缩放等信息
      previewVisible: false, // 控制组件是否显示
      imagesList: [], // 控制组件的预览图片
      imageIndex: 0, // 当前预览的图片是哪个

      // imgs: [
      //   'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1599894145986&di=fcd96771a5b088df1ba26ce8ad75cb3a&imgtype=0&src=http%3A%2F%2Fattach.bbs.miui.com%2Fforum%2F201312%2F06%2F211410sxjtbyaj9abo5qzh.jpg',
      //   'https://t7.baidu.com/it/u=3616242789,1098670747&fm=79&app=86&size=h300&n=0&g=4n&f=jpeg?sec=1600482662&t=c0e3b426dc8fff1368b18ac70e8d8381',
      //   'https://t8.baidu.com/it/u=3571592872,3353494284&fm=79&app=86&size=h300&n=0&g=4n&f=jpeg?sec=1600482662&t=29570fe33b04dfc4599bc7e02bea9f9e',
      // ],
    };
  },
  computed: {
    imgStyle() {
      const imgRect = this.imgRect;
      const nW = imgRect.scale * imgRect.imgW;
      const nH = imgRect.scale * imgRect.imgH;
      return {
        width: `${nW}px`,
        height: `${nH}px`,
        marginTop: `${imgRect.marginTop}px`,
        marginBottom: `${imgRect.marginBottom}px`,
        transform: `
          rotate(${imgRect.rotate}deg)
          scale3d(1, 1, 1)
        `,
      };
    },
  },
  watch: {
    visible(value) {
      this.previewVisible = value;
      document.body.style.overflow = value ? 'hidden' : 'auto';
    },
    imgs(value) {
      this.imagesList = value;
      this.initRect(this.index);
    },
    index(value) {
      this.imageIndex = value;
    },
  },
  mounted() {
    // 监听屏幕尺寸变化
    window.onresize = this.imgCenterPosition;
  },
  methods: {
    // 初始图片信息
    async initRect(index) {
      // top表示上下边界
      const { scale, verticalPadding, imgW, imgH } = await this.imgFixWindow(this.imagesList[index]);
      this.imgRect = {
        current: index,
        marginLeft: 0,
        marginTop: verticalPadding,
        marginBottom: verticalPadding,
        rotate: 0,
        scale,
        imgW,
        imgH,
      };
      this.scaleMirror = [];
    },
    imgFixWindow(src) {
      return new Promise(resolve => {
        const res = {
          scale: 1,
          verticalPadding: 60, // 默认值上下边界 60
          imgW: 300,
          imgH: 300,
        };
        const img = new Image();
        img.onload = () => {
          const winW = window.innerWidth - 60;
          const winH = window.innerHeight - 60;
          const imgW = img.width;
          const imgH = img.height;
          if (winH > imgH) {
            res.verticalPadding = (winH - imgH) / 2;
          }
          if (imgW > winW) {
            res.scale = parseFloat(winW / imgW).toFixed(2);
          }
          res.imgW = imgW;
          res.imgH = imgH;
          return resolve(res);
        };
        img.src = src;
      }).catch(() => {
        return Promise.resolve(res);
      });
    },
    open(option) {
      this.previewOption = option;
      this.previewVisible = true;
      this.imagesList = option.imgs || [];
      this.imageIndex = option.index || 0;
      this.initRect(this.imageIndex);
    },
    // 获取图片的真实渲染尺寸等信息
    getDomRect() {
      return this.$refs.imgBox.getBoundingClientRect();
    },
    // 判断当前图片尺寸是否大于屏幕, 用于是否允许图片拖动，大于允许。
    isBigThanWindow() {
      const { width, height } = this.getDomRect();
      const { innerWidth, innerHeight } = window;
      return width > innerWidth || height > innerHeight;
    },
    // 预防小数运算精度问题
    numCompute() {
      // 先放着
    },
    // 上一张
    prev() {
      const index = this.imgRect.current - 1;
      if (index < 0) return;
      this.initRect(index);
    },
    // 下一张
    next() {
      const index = this.imgRect.current + 1;
      if (index > this.imagesList.length - 1) return;
      this.initRect(index);
    },
    // 逆时针旋转
    rotateLeft() {
      this.imgRect.rotate -= 90;
      this.imgCenterPosition();
    },
    // 顺时针旋转
    rotateRight() {
      this.imgRect.rotate += 90;
      this.imgCenterPosition();
    },
    // 放大
    zoomIn() {
      const addScale = this.scaleMirror.pop() || this.addScale; // 增量先从镜像中取，没有取单位增量
      this.imgRect.scale = (this.imgRect.scale * 1000 + addScale * 1000) / 1000;
      this.imgCenterPosition();
    },
    // 缩小
    zoomOut(reduceScale) {
      const rScale = reduceScale || this.reduceScale;
      const scale = (this.imgRect.scale * 1000 - rScale * 1000) / 1000;
      if (scale <= 0) {
        const { width, height } = this.getDomRect();
        if (width > this.minSize && height > this.minSize) {
          // 负值前最后一次减小后的尺寸，仍大于50px时，改变单位缩小减量
          this.zoomOut(rScale * this.scaleRatio);
        }
      } else {
        this.imgRect.scale = scale;
        if (reduceScale) this.scaleMirror.push(reduceScale); // 存储变化的缩小减量，用于镜像放大
      }
      this.imgCenterPosition();
    },
    // 拖动图片
    imgDrag(e) {
      // 弃用
      if (!this.isBigThanWindow()) return; // 只有当图片大于窗口才有效果
      const { x, y } = e;
      const { marginLeft, marginTop } = this.imgRect;
      this.$refs.previewBox.onmousemove = event => {
        this.imgMove(event, x, y, marginLeft, marginTop);
      };
      this.$refs.previewBox.onmouseup = () => {
        this.$refs.previewBox.onmousemove = null;
        this.$refs.previewBox.onmousup = null;
      };
    },
    // 改变位置
    imgMove(e, startX, startY, marginLeft, marginTop) {
      const { x, y } = e;
      this.imgRect.marginLeft = marginLeft + x - startX;
      this.imgRect.marginTop = marginTop + y - startY;
    },
    // 图片缩放，旋转，屏幕尺寸变更，将图片重新定位于正中心
    imgCenterPosition() {
      // 等待优化
      this.$nextTick(() => {
        // if (!this.isBigThanWindow()) {
        //   this.imgRect.marginLeft = 0;
        //   this.imgRect.marginTop = 0;
        // }
      });
    },
    // 滚轮缩放图片
    wheel(e) {
      // 弃用
      (e.deltaY > 0 ? this.zoomOut : this.zoomIn)();
    },
    // 关闭预览
    closeImgPreview() {
      if (this.previewOption && typeof this.previewOption.beforeClose === 'function') {
        this.previewOption.beforeClose();
      }
      this.previewVisible = false;
      this.$emit('update:visible', false);
      this.initRect(0);
    },
  },
};
</script>
<style lang="less" scoped>
.img-preview-wrap {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  .img-preview-close {
    position: absolute;
    top: 50px;
    right: 50px;
    z-index: 1;
    color: #fff;
    font-size: 32px;
    cursor: pointer;
    .close-icon {
      padding: 4px;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 10px;
    }
  }
  .img-list-wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    img {
      display: block;
      margin: 0 auto;
      object-fit: cover;
      transition: 300ms transform ease-out;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      -khtml-user-select: none;
      user-select: none;
      pointer-events: none;
    }
  }
  .img-tools-wrap {
    position: absolute;
    bottom: 0;
    left: 50%;
    z-index: 2;
    display: flex;
    height: 50px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 10px 10px 0 0;
    transform: translateX(-50%);
    .icon-btn {
      box-sizing: border-box;
      width: 50px;
      height: 50px;
      margin: 0 10px;
      padding: 10px;
      color: #fff;
      font-size: 30px;
      cursor: pointer;
      &.disabled {
        color: #999;
        cursor: not-allowed;
      }
    }
  }
}
</style>
