import CardListGroup from './card-list-group.vue';

CardListGroup.install = (app: any) => {
  app.component('card-list-group', CardListGroup);
  return app;
};

export default CardListGroup;
