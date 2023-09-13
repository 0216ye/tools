import pictureOverlay from './index.vue';

pictureOverlay.install = (app: any) => {
  app.component('picture-overlay', pictureOverlay);
  return app;
};

export default pictureOverlay;
