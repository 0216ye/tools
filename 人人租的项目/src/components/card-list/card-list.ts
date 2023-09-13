import CardList from './card-list.vue';

CardList.install = (app: any) => {
  app.component('card-list', CardList);
  return app;
};

export default CardList;
