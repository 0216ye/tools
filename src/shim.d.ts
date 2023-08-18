declare module '*.vue';
declare const React: string;
declare module '*.json';
declare module '*.png';
declare module '*.jpg';
declare module '*.svg';
declare module '*.scss';
declare module '*.less';
declare module '*.css';
declare module '*.js';
declare module 'ant-design-vue/lib/locale-provider/zh_CN';
declare module 'moment/locale/zh-cn';
declare module '@/*';
declare module '*.module.less';
declare module '@vitejs/plugin-legacy';
declare module 'dom-to-image';
declare module 'insert-css';
declare module '@antv/hierarchy';

declare interface Window {
  BMap?: any;
  $loadMapEnv?: any;
  BMAP_ANCHOR_BOTTOM_RIGHT?: any;
  BMAP_ANCHOR_TOP_LEFT?: any;
  BMAP_NAVIGATION_CONTROL_SMALL?: any;
  BMAP_ANIMATION_BOUNCE?: any;
  BMAP_STATUS_SUCCESS?: any;
  sensors: any;
}

declare module 'jr-qrcode';

declare const XLSX: any;

// declare module '*.vue' {
//   import type { DefineComponent } from 'vue';
//   const component: DefineComponent<{}, {}, any>;
//   export default component;
// }
