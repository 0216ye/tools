import LayoutPage from './layout-page.vue';

LayoutPage.install = (app: any) => {
  app.component('layout-page', LayoutPage);
  return app;
};

export default LayoutPage;
