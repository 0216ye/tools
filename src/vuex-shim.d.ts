import { Store } from 'vuex';

export interface Category {
  categoryParentId?: string;
  categoryId?: string;
  brandId?: string;
  spuModelId?: string;
  categoryParentTitle?: string;
  categoryTitle?: string;
  brandTitle?: string;
  spuModelTitle?: string;
  applySpuModel?: string;
  applyBrand?: string;
  titles?: Array<string>;
  values?: Array<string>;
}
export interface Commodity {
  category: Category;
  currentType: string; //发布商品时选择的类型 ：全新或二手
  is_security_rent: boolean;
}

export interface State {
  baseUrl: string;
  commodity: Commodity;
  is_sales: number | null;
  is_image_show: boolean;
}

declare module '@vue/runtime-core' {
  // Declare your own store states.
  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
