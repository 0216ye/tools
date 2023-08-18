<template>
  <div
    ref="wrap"
    class="wrap"
  >
    <div :style="wrap.style">
      <canvas
        ref="canvas"
        :height="canvas.height"
        :style="canvas.style"
        :width="canvas.width"
      />
    </div>
    <div :style="wrap.style">
      <canvas
        ref="canvasClip"
        :height="canvasClip.height"
        :style="canvasClip.style"
        :width="canvasClip.width"
      />
    </div>
  </div>
</template>
<script>
import { dragger, throttle, defaultOptions, toBlob } from './clip/clip';

export default {
  props: {
    // 图片源，url或这base64
    url: {
      type: String,
      default: '',
    },
    selfOptions: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  emits: ['clip-wrap-change'],
  data() {
    return {
      img: {
        src: '',
        width: 0,
        height: 0,
        loaded: false,
        error: false,
        style: {},
        get: () => null,
      },
      // 承载图片的画布
      canvas: {
        // 等于图片的宽高
        width: 0,
        height: 0,
        // 缩放比例，画布大小与父容器的比值
        scale: 1,
        style: {
          transformOrigin: 'left top',
          backfaceVisibility: 'hidden',
          position: 'absolute',
        },
        // 图片放置的初始位置
        startX: 0,
        startY: 0,
      },
      // 两个画布的父容器
      wrap: {
        style: {
          position: 'absolute',
        },
        offsetWidth: 0,
        offsetHeight: 0,
        offsetTop: 0,
        offsetLeft: 0,
      },
      // 切片画布
      canvasClip: {
        // 宽高
        width: 0,
        height: 0,
        // 切片区域的宽高,和位置
        clipX: 0,
        clipY: 0,
        clipWidth: 0,
        clipHeight: 0,
        style: {
          position: 'absolute',
          top: '0',
          left: '0',
          zIndex: '3',
        },
      },
    };
  },
  watch: {
    url: {
      handler(url) {
        if (!url) {
          return;
        }
        this.loadImage(url).then(this.drawImage);
      },
      immediate: true,
    },
  },
  mounted() {
    this.addListener();
  },
  beforeUnmount() {
    this.removeListener();
  },
  methods: {
    initOptions() {
      this.options = { ...defaultOptions, ...this.selfOptions };
    },
    loadImage(src) {
      this.initOptions();
      return new Promise((resolve, reject) => {
        this.loaded = false;
        this.error = false;
        const img = new Image();
        img.crossOrigin = this.options.imgCrossOrigin ? 'anonymous' : '';
        img.onload = () => {
          this.img.loaded = true;
          this.img.src = src;
          this.img.width = img.width;
          this.img.height = img.height;
          this.img.get = () => img;
          return resolve({
            img,
            src,
          });
        };
        img.onerror = () => {
          this.img.error = true;
          return reject();
        };
        // 加时间戳可以避免，跨域加载图片的时候，使用了非跨域模式加载的图片缓存
        img.src = `${src}${this.options.imgCrossOrigin ? `t=${new Date().getTime()}${Math.random() * 32}` : ''}?`;
      }).catch(e => {
        console.error(new Error(e), '图片加载失败');
      });
    },
    drawImage() {
      // 初始将图片绘制到画布上
      if (!this.img.loaded) {
        return;
      }
      this.clearCanvas();
      const ctx = this.$refs.canvas.getContext('2d');
      const img = this.img;

      this.canvas.width = img.width;
      this.canvas.height = img.height;

      this.canvas.startX = 0;
      this.canvas.startY = 0;
      this.$nextTick(() => {
        ctx.drawImage(img.get(), 0, 0);
      });
      // 准备进行绘制图片到画布。初始化绘制状态
      this.canvas.clipRectReady = false;
      // 第一次运行一次，或者屏幕变化时运行
      this.setCanvasContainInRect();
    },
    // 使画布显示在容器内
    setCanvasContainInRect() {
      // 最外层边框的大小
      const box = this.$refs.wrap;
      const padding = this.options.padding;
      // 期望距离容器外部有一些间距，所以实际显示的区域会更小
      const boxWidth = box.offsetWidth - 2 * padding;
      const boxHeight = box.offsetHeight - 2 * padding;

      this.canvas.boxWidth = boxWidth;
      this.canvas.boxHeight = boxHeight;

      // 获取图片实际大小，图片大小就是画布实际大小
      const imgWidth = this.img.width;
      const imgHeight = this.img.height;

      // 根据外层容器大小，使画布缩放适应屏幕
      let canvasScale = 1;
      if (imgWidth < boxWidth && imgHeight < boxHeight) {
        // 都小于容器大小，直接显示原图
        if (imgWidth < boxWidth / 2 && imgHeight < boxHeight / 2) {
          canvasScale = Math.min(boxWidth / 2 / imgWidth, boxHeight / 2 / imgHeight);
        } else {
          canvasScale = 1;
        }
      } else if (imgWidth < boxWidth && imgHeight > boxHeight) {
        // 宽小于容器大小，高大于容器
        const scaleY = boxHeight / imgHeight;
        canvasScale = scaleY;
      } else if (imgWidth > boxWidth && imgHeight < boxHeight) {
        // 宽大于容器大小，高小于容器
        const scaleX = boxWidth / imgWidth;
        canvasScale = scaleX;
      } else {
        // 都大于容器
        const scaleX = boxWidth / imgWidth;
        const scaleY = boxHeight / imgHeight;
        if (scaleX > scaleY) {
          if (boxHeight < imgHeight * scaleX) {
            canvasScale = scaleX * (boxHeight / imgHeight / scaleX);
          } else {
            canvasScale = scaleX;
          }
        } else {
          if (boxWidth < imgWidth * scaleY) {
            canvasScale = scaleY * (boxWidth / imgWidth / scaleY);
          } else {
            canvasScale = scaleY;
          }
        }
      }

      this.canvas.scale = canvasScale;
      this.canvas.style.transform = `scale(${canvasScale})`;

      // 计算画布父容器位置和大小
      const canvasOffsetWidth = imgWidth * canvasScale;
      const canvasOffsetHeight = imgHeight * canvasScale;
      const canvasOffsetTop = (boxHeight - canvasOffsetHeight) / 2 + padding;
      const canvasOffsetLeft = (boxWidth - canvasOffsetWidth) / 2 + padding;

      this.wrap.style.width = `${canvasOffsetWidth}px`;
      this.wrap.style.height = `${canvasOffsetHeight}px`;
      this.wrap.style.top = `${canvasOffsetTop}px`;
      this.wrap.style.left = `${canvasOffsetLeft}px`;

      this.wrap.offsetWidth = canvasOffsetWidth;
      this.wrap.offsetHeight = canvasOffsetHeight;
      this.wrap.offsetTop = canvasOffsetTop;
      this.wrap.offsetLeft = canvasOffsetLeft;

      // 向上取整，取出偶数
      this.canvasClip.width = Math.ceil(canvasOffsetWidth) * 2;
      this.canvasClip.height = Math.ceil(canvasOffsetHeight) * 2;

      this.canvasClip.style.width = `${Math.ceil(canvasOffsetWidth)}px`;
      this.canvasClip.style.height = `${Math.ceil(canvasOffsetHeight)}px`;

      // 初始化
      this.canvasClip.clipWidth = 0;
      this.canvasClip.clipHeight = 0;

      this.drawClipRect();
    },
    drawClipRect({ newClipX = 0, newClipY = 0, isDrag = false, newClipWidth, newClipHeight } = {}) {
      if (this.options.disabledClipRect) {
        this.canvas.clipRectReady = true;
        this.$emit('clip-wrap-change', {
          clipWidth: this.canvas.width,
          clipHeight: this.canvas.height,
        });
        return;
      }
      this.$nextTick(() => {
        // clipCanvas是二倍像素，所以转换成图片真实尺寸后还需要乘2
        const ctx = this.$refs.canvasClip.getContext('2d');
        const { scale } = this.canvas;
        const { width, height, clipWidth: oldClipWidth, clipHeight: oldClipHeight } = this.canvasClip;
        let clipWidth = newClipWidth || oldClipWidth || width * 0.68; // 默认设置一个裁剪区域
        let clipHeight = newClipHeight || oldClipHeight || height * 0.68;
        // 清除裁剪层的内容
        ctx.clearRect(0, 0, width, height);
        // 绘制一个黑色遮盖
        ctx.fillStyle = this.options.clipCanvasBackground;
        ctx.fillRect(0, 0, width, height);
        // 避免截止区域溢出
        clipWidth = width - clipWidth > 0 ? clipWidth : width;
        clipHeight = height - clipHeight > 0 ? clipHeight : height;

        let clipX = 0;
        let clipY = 0;

        if (isDrag) {
          // 是拖动的情况
          clipX = newClipX;
          clipY = newClipY;
        } else {
          // 默认居中
          clipX = (width - clipWidth) / 2;
          clipY = (height - clipHeight) / 2;
        }
        // 边界检测
        clipX = clipX < 0 ? 0 : clipX;
        clipX = clipX > width - clipWidth ? width - clipWidth : clipX;
        clipY = clipY < 0 ? 0 : clipY;
        clipY = clipY > height - clipHeight ? height - clipHeight : clipY;

        // 记录上次的值
        this.canvasClip.clipX = clipX;
        this.canvasClip.clipY = clipY;
        this.canvasClip.clipWidth = clipWidth;
        this.canvasClip.clipHeight = clipHeight;

        // 画一个边框
        ctx.beginPath();
        ctx.lineWidth = 6;
        ctx.setLineDash([0]);
        ctx.strokeStyle = this.options.clipRectBorderColor;
        ctx.strokeRect(clipX, clipY, clipWidth, clipHeight);
        // 清空区域
        ctx.clearRect(clipX, clipY, clipWidth, clipHeight);
        ctx.closePath();

        // 画出来边框小点，共八个
        const radius = 10;
        this.clipPoint = [];
        this.drawClipPoint(clipX, clipY, radius, 'tl');
        this.drawClipPoint(clipX + clipWidth, clipY, radius, 'tr');
        this.drawClipPoint(clipX, clipY + clipHeight, radius, 'bl');
        this.drawClipPoint(clipX + clipWidth, clipY + clipHeight, radius, 'br');
        this.drawClipPoint(clipX + clipWidth / 2, clipY, radius, 't', clipWidth);
        this.drawClipPoint(clipX, clipY + clipHeight / 2, radius, 'l', clipHeight);
        this.drawClipPoint(clipX + clipWidth, clipY + clipHeight / 2, radius, 'r', clipHeight);
        this.drawClipPoint(clipX + clipWidth / 2, clipY + clipHeight, radius, 'b', clipWidth);

        // 画出来比例线，九宫格, 3:3 3:3
        const baseClipWidth = Math.floor(clipWidth / 3);
        const baseClipHeight = Math.floor(clipHeight / 3);
        this.drawClipLine(clipX + baseClipWidth, clipY, clipX + baseClipWidth, clipY + clipHeight);
        this.drawClipLine(clipX + baseClipWidth * 2, clipY, clipX + baseClipWidth * 2, clipY + clipHeight);
        this.drawClipLine(clipX, clipY + baseClipHeight, clipX + clipWidth, clipY + baseClipHeight);
        this.drawClipLine(clipX, clipY + baseClipHeight * 2, clipX + clipWidth, clipY + baseClipHeight * 2);

        this.$emit('clip-wrap-change', {
          clipWidth: Math.floor(clipWidth / scale / 2),
          clipHeight: Math.floor(clipHeight / scale / 2),
        });
        this.canvas.clipRectReady = true;
      });
    },
    drawClipLine(sx, sy, dx, dy) {
      const ctx = this.$refs.canvasClip.getContext('2d');
      const color = this.options.clipLineStrokeColor;
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.setLineDash([6]);
      ctx.strokeStyle = color;
      ctx.moveTo(sx, sy);
      ctx.lineTo(dx, dy);
      ctx.stroke();
      ctx.closePath();
    },
    drawClipPoint(x, y, radius, type, range = 0) {
      const ctx = this.$refs.canvasClip.getContext('2d');
      const fillColor = this.options.clipPointFillColor;
      ctx.beginPath();
      const eventPlaceSize = radius * 2;
      ctx.fillStyle = fillColor;
      ctx.fillRect(x - eventPlaceSize / 2, y - eventPlaceSize / 2, eventPlaceSize, eventPlaceSize);
      ctx.fill();
      ctx.stroke();

      let sx = x - eventPlaceSize;
      let sy = y - eventPlaceSize;
      let dx = x + eventPlaceSize;
      let dy = y + eventPlaceSize;
      // 延伸四边的事件范围
      if (type === 't' || type === 'b') {
        sx = x - range / 2 - eventPlaceSize;
        dx = x + range / 2 - eventPlaceSize;
        sy = y - eventPlaceSize / 2;
        dy = y + eventPlaceSize / 2;
      } else if (type === 'l' || type === 'r') {
        sy = y - range / 2 - eventPlaceSize;
        dy = y + range / 2 - eventPlaceSize;
        sx = x - eventPlaceSize / 2;
        dx = x + eventPlaceSize / 2;
      }
      this.clipPoint.push({ sx, sy, dx, dy, type });
    },
    clearCanvas() {
      const ctx = this.$refs.canvas.getContext('2d');
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.beginPath();
      ctx.fillStyle = this.options.imageCanvasBackground;
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.closePath();
    },
    moveImage(x, y) {
      const ctx = this.$refs.canvas.getContext('2d');
      this.clearCanvas();
      ctx.drawImage(this.img.get(), x, y);
      // 设置移动后的图片位置
      this.canvas.startX = x;
      this.canvas.startY = y;
    },
    addListener() {
      let x = 0;
      let y = 0;
      let w = 0;
      let h = 0;
      let type = 'none';
      let bw = 0;
      let bh = 0;
      let imageStartX = 0;
      let imageStartY = 0;
      let scale = 1;
      const target = this.$refs.canvasClip;
      const canvasClip = this.canvasClip;
      this.drag = dragger({
        target,
        startcb: (pageX, pageY, event) => {
          const offsetX = Math.floor(event.offsetX * 2);
          const offsetY = Math.floor(event.offsetY * 2);
          const clipPoint = this.clipPoint || [];
          w = canvasClip.clipWidth;
          h = canvasClip.clipHeight;
          x = canvasClip.clipX;
          y = canvasClip.clipY;
          bw = canvasClip.width;
          bh = canvasClip.height;
          imageStartX = this.canvas.startX;
          imageStartY = this.canvas.startY;
          scale = this.canvas.scale;
          type = 'imageMove';
          // 判断是否在移动区域内
          if (x < offsetX && offsetX < x + w && y < offsetY && offsetY < y + h) {
            type = 'drag';
          }
          // 判断是否在拉伸区域内，拉伸区域在边框的10个像素内。四角的
          for (const point of clipPoint) {
            if (point.sx <= offsetX && offsetX <= point.dx && point.sy <= offsetY && offsetY <= point.dy) {
              type = point.type;
              break;
            }
          }

          return this.canvas.clipRectReady;
        },
        movecb: res => {
          throttle(() => {
            // tl tr bl br 为 b l t r 组合出来的结果
            const { moveLeft, moveTop } = res;
            let newClipX, newClipY, newClipWidth, newClipHeight;
            switch (type) {
              case 'imageMove':
                // 不需要边界判断，图片画布没有边界
                this.moveImage(moveLeft / scale + imageStartX, moveTop / scale + imageStartY);
                break;
              case 'drag':
                newClipX = Math.floor(x + moveLeft * 2);
                newClipY = Math.floor(y + moveTop * 2);
                break;
              case 'tl':
                newClipWidth = Math.floor(w - moveLeft * 2);
                newClipHeight = Math.floor(h - moveTop * 2);
                newClipX = newClipWidth < 0 ? x + w : Math.floor(x + moveLeft * 2);
                newClipY = newClipHeight < 0 ? y + h : Math.floor(y + moveTop * 2);
                newClipWidth = Math.abs(newClipWidth);
                newClipHeight = Math.abs(newClipHeight);
                break;
              case 'tr':
                newClipWidth = Math.floor(w + moveLeft * 2);
                newClipHeight = Math.floor(h - moveTop * 2);
                newClipX = newClipWidth < 0 ? x + newClipWidth : x;
                newClipY = newClipHeight < 0 ? y + h : Math.floor(y + moveTop * 2);
                newClipWidth = Math.abs(newClipWidth);
                newClipHeight = Math.abs(newClipHeight);
                break;
              case 'bl':
                newClipWidth = Math.floor(w - moveLeft * 2);
                newClipHeight = Math.floor(h + moveTop * 2);
                newClipX = newClipWidth < 0 ? x + w : Math.floor(x + moveLeft * 2);
                newClipY = newClipHeight < 0 ? y + newClipHeight : y;
                newClipWidth = Math.abs(newClipWidth);
                newClipHeight = Math.abs(newClipHeight);
                break;
              case 'br':
                newClipWidth = Math.floor(w + moveLeft * 2);
                newClipHeight = Math.floor(h + moveTop * 2);
                newClipX = newClipWidth < 0 ? x + newClipWidth : x;
                newClipY = newClipHeight < 0 ? y + newClipHeight : y;
                newClipWidth = Math.abs(newClipWidth);
                newClipHeight = Math.abs(newClipHeight);
                break;
              case 'b':
                newClipHeight = Math.floor(h + moveTop * 2);
                newClipX = x;
                newClipY = newClipHeight < 0 ? y + newClipHeight : y;
                newClipHeight = Math.abs(newClipHeight);
                break;
              case 't':
                newClipHeight = Math.floor(h - moveTop * 2);
                newClipX = x;
                newClipY = newClipHeight < 0 ? y + h : Math.floor(y + moveTop * 2);
                newClipHeight = Math.abs(newClipHeight);
                break;
              case 'l':
                // 左侧
                newClipWidth = Math.floor(w - moveLeft * 2);
                newClipX = newClipWidth < 0 ? x + w : Math.floor(x + moveLeft * 2);
                newClipY = y;
                newClipWidth = Math.abs(newClipWidth);
                break;
              case 'r':
                // 右侧
                newClipWidth = Math.floor(w + moveLeft * 2);
                newClipX = newClipWidth < 0 ? x + newClipWidth : x;
                newClipY = y;
                newClipWidth = Math.abs(newClipWidth);
                break;
            }
            if (type === 'imageMove') {
              return;
            }
            // 控制边界
            if (newClipX + newClipWidth > bw) {
              newClipWidth = bw - newClipX;
            }
            if (newClipX < 0) {
              newClipWidth = newClipWidth + newClipX;
              newClipX = 0;
            }
            if (newClipY + newClipHeight > bh) {
              newClipHeight = bh - newClipY;
            }
            if (newClipY < 0) {
              newClipHeight = newClipHeight + newClipY;
              newClipY = 0;
            }

            this.drawClipRect({
              newClipX,
              newClipY,
              newClipWidth,
              newClipHeight,
              isDrag: true,
            });
          }, 60)();
        },
        donecb: () => {
          // document.body.style.cursor = 'initial';
        },
      });
    },
    removeListener() {
      this.drag && this.drag.remove();
    },
    // 截取图片
    handleClipImage() {
      if (!this.canvas.clipRectReady) {
        return;
      }
      return new Promise(resolve => {
        const resultCanvas = document.createElement('canvas');
        const ctx = resultCanvas.getContext('2d');
        const { scale, width, height } = this.canvas;
        const canvasClip = this.canvasClip;

        // clip为显示的2倍，同时乘与了放大系数，这里要反向操作
        let clipX = Math.floor(canvasClip.clipX / 2 / scale);
        let clipY = Math.floor(canvasClip.clipY / 2 / scale);
        let clipWidth = Math.floor(canvasClip.clipWidth / 2 / scale);
        let clipHeight = Math.floor(canvasClip.clipHeight / 2 / scale);
        if (this.options.disabledClipRect) {
          clipX = 0;
          clipY = 0;
          clipWidth = width;
          clipHeight = height;
        }

        resultCanvas.width = clipWidth;
        resultCanvas.height = clipHeight;

        const imageCanvas = this.$refs.canvas.getContext('2d');
        const imageData = imageCanvas.getImageData(clipX, clipY, clipWidth, clipHeight);
        // 数据源，图片x，图片y，画布x，画布y，宽，高
        ctx.putImageData(imageData, 0, 0, 0, 0, clipWidth, clipHeight);
        // 不直接使用toblob是因为后端如果不做判断会无法识别上传的文件
        resolve(resultCanvas.toDataURL('image/png', 1));
      });
    },
    async getClipToFile() {
      const file = await this.handleClipImage().then(base64 => {
        return toBlob(base64, `${new Date().getTime()}.png`);
      });
      return file;
    },
  },
};
</script>
<style lang="less" scoped>
.wrap {
  position: relative;
  height: 600px;
  overflow: hidden;
  .img {
    position: absolute;
    right: 0;
    left: 0;
  }
  .action {
    position: absolute;
    bottom: 0;
    left: 50%;
    z-index: 99;
    width: 200px;
    transform: translateX(-50%);
  }
}
</style>
