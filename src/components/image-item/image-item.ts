import ImageItem from './image-item.vue';

ImageItem.install = (app: any) => {
  app.component('image-item', ImageItem);
  return app;
};

export default ImageItem;
