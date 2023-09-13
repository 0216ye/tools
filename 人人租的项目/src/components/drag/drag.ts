import Drag from './drag.vue';

Drag.install = (app: any) => {
  app.component('drag', Drag);
  return app;
};

export default Drag;
