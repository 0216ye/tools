import ImagePreview from './image-preview.vue';
import { createApp } from 'vue';

ImagePreview.install = (app: any) => {
  app.component('image-preview', ImagePreview);

  const com: any = ImagePreview;
  app.config.globalProperties.$preview = {
    init() {
      const elem = document.createElement('div');
      document.body.appendChild(elem);
      this.previewElem = createApp(com).mount(elem);
      this.elem = elem;
    },
    open(option = {}) {
      // 创建vue对象
      this.init();
      // 打开组件，并传入参数
      this.previewElem.open({
        ...option,
        beforeClose: () => {
          this.elem && document.body.removeChild(this.elem);
          this.elem = null;
          this.previewElem = null;
        },
      });
    },
  };
  return app;
};

export default ImagePreview;
