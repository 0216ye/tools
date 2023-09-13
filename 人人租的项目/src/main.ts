import { createApp } from 'vue';
import App from './app.vue';
import { router } from './router/router';
import { store } from './store/store';
import 'ant-design-vue/dist/antd.variable.less';
import './style/style.less';
import clickoutside from '@/utils/clickoutside';
// import 'ant-design-vue/dist/antd.less';
import '@/plugins/data-center-init';

import {
  message,
  Modal,
  Button,
  Card,
  Table,
  List,
  Empty,
  Form,
  Input,
  Checkbox,
  InputNumber,
  Tree,
  Popconfirm,
  Tooltip,
  Breadcrumb,
  Spin,
  Select,
  Tag,
  Pagination,
  Row,
  Col,
  Upload,
  Radio,
  Switch,
  Cascader,
  Steps,
  Tabs,
  Popover,
  Alert,
  TreeSelect,
  Progress,
  BackTop,
  Anchor,
  Descriptions,
  Badge,
  Dropdown,
  Menu,
  Drawer,
  Slider,
  Affix,
  Carousel,
  notification,
  Timeline,
  Image,
  Statistic,
  Space,
  Collapse,
  Avatar,
  Divider,
  Result,
  Typography,
  AutoComplete,
  PageHeader,
  Layout,
  Skeleton,
  Transfer,
  Comment,
  Rate,
} from 'ant-design-vue';
import DatePicker from 'ant-design-vue/es/date-picker/moment';
import TimePicker from 'ant-design-vue/es/time-picker/moment';
import { PageBreadcrumb } from './components/breadcrumb';
import { CrmRemark } from './components/crm-remark';
import { FormCreate, StateSelect, StateCascader } from './components/form-create';
import { FormPopup } from './components/form-popup';
import { CollapseText } from './components/collapse-text';
import { LayoutShopsPage } from './layouts/layout-shops-page';
import { LayoutAdminPage } from './layouts/layout-admin-page';
import { LayoutCommonPage } from './layouts/layout-common-page';
import { TableSearchHeader } from './components/table-search-header';
import { SearchTable } from './components/search-table';
import { RatioCard } from './components/ratio-card';
import { CascadeDatePicker } from './components/cascade-date-picker';
/**rrzu-component-registry-import-placeholder*/
import FormExtend from './components/form-extend/form-extend';
import FormModal from './components/form-modal/form-modal';
import ImagePreview from './components/image-preview/image-preview';
import CardList from './components/card-list/card-list';
import CardListGroup from './components/card-list-group/card-list-group';
import Drag from './components/drag/drag';
import LayoutPage from './layouts/layout-page/layout-page';
import ImageLazy from './directive/image-lazy.js';
import ImageItem from './components/image-item/image-item';
import { createFromIconfontCN } from '@ant-design/icons-vue';
import { vRoles } from '@/directive/permission';
import Permission from '@/components/permission/index.vue';
import PictureOverlay from '@/components/picture-overlay/index.vue';

const IconFont = createFromIconfontCN({
  // scriptUrl: '//at.alicdn.com/t/font_2803185_kbav8r17ewc.js',
  scriptUrl: '//at.alicdn.com/t/c/font_3502985_4lv79j6z6r4.js',
});

const app = createApp(App);
app.use(router);
app.use(store);

// antd组件
app.use(Button);
app.use(Card);
app.use(Table);
app.use(List);
app.use(Modal);
app.use(Empty);
app.use(Form);
app.use(Input);
app.use(Checkbox);
app.use(InputNumber);
app.use(Tree);
app.use(Popconfirm);
app.use(Tooltip);
app.use(Breadcrumb);
app.use(Spin);
app.use(Select);
app.use(DatePicker);
app.use(Tag);
app.use(Pagination);
app.use(Row);
app.use(Col);
app.use(Upload);
app.use(Radio);
app.use(Switch);
app.use(Cascader);
app.use(Steps);
app.use(Tabs);
app.use(Popover);
app.use(Alert);
app.use(TreeSelect);
app.use(Progress);
app.use(BackTop);
app.use(Anchor);
app.use(Descriptions);
app.use(Badge);
app.use(Dropdown);
app.use(Menu);
app.use(Slider);
app.use(Drawer);
app.use(Affix);
app.use(Timeline);
app.use(Image);
app.use(Statistic);
app.use(Space);
app.use(Collapse);
app.use(Avatar);
app.use(TimePicker);
app.use(Divider);
app.use(PageHeader);
app.use(Layout);
app.use(Skeleton);
app.use(Transfer);
app.use(Comment);
app.use(Rate);
// 非antd组件
app.use(FormExtend);
app.use(ImagePreview);
app.use(LayoutPage);
app.use(FormModal);
app.use(CardList);
app.use(CardListGroup);
app.use(PageBreadcrumb);
app.use(CrmRemark);
app.use(FormCreate);
app.use(StateSelect);
app.use(StateCascader);
app.use(FormPopup);
app.use(CollapseText);
app.use(LayoutAdminPage);
app.use(LayoutShopsPage);
app.use(LayoutCommonPage);
app.use(TableSearchHeader);
app.use(Drag);
app.use(ImageItem);
app.use(Carousel);
app.use(Result);
app.use(Typography);
app.use(AutoComplete);
app.use(SearchTable);
app.use(RatioCard);
app.use(CascadeDatePicker);
app.use(PictureOverlay);
/**rrzu-component-registry-use-placeholder*/
// 权限验证
app.component('permission', Permission);
app.component('icon-font', IconFont);

app.config.globalProperties.$message = message;
app.config.globalProperties.$modal = Modal;
app.config.globalProperties.$notification = notification;
app.directive('lazy', ImageLazy);
app.directive('roles', vRoles);
app.directive('clickoutside', clickoutside);
app.mount('#app');
