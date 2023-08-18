import FormExtend from './form-extend.vue';

FormExtend.install = (app: any) => {
  app.component('form-extend', FormExtend);
  return app;
};

export default FormExtend;
