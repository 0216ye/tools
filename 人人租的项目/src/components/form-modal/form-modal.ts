import FormModal from './form-modal.vue';

FormModal.install = (app: any) => {
  app.component('form-modal', FormModal);
  return app;
};

export default FormModal;
