<template>
  <div>
    <div class="header flex-wrap flex-y-center">
      <div
        v-if="cardTitle"
        class="title flex-wrap flex-y-center"
      >
        <span>{{ cardTitle }}</span>
        <a-switch
          v-if="proxyChildSwitchAssign.show && cardSwitchName"
          :checked="proxySwitchStatus"
          class="proxy-child-switch"
          :size="proxyChildSwitchAssign.size"
          style="margin-left: 8px"
          @change="proxyChildSwitchStatus"
        />
        <div
          v-if="isOrderCancelPop"
          class="flex-wrap flex-y-center"
          style="cursor: pointer"
          @click="onEdit()"
        >
          <plus-outlined class="header-add-icon" />
          <span class="header-add-btn">添加{{ text }}</span>
        </div>
      </div>
      <div
        v-if="cardText"
        class="text"
      >
        {{ cardText }}
      </div>
    </div>
    <span
      v-if="addBtnTitle && btnTitleBefore"
      class="btn-title"
    > {{ addBtnTitle }}</span>
    <template v-if="pageName === 'lifePageConfig'">
      <div :class="[text !== '模块（产品展示）' ? 'header-box' : 'modal-box']">
        <i
          v-show="text !== '模块（产品展示）'"
          class="header-icon"
          style="margin-left: 16px"
        />
        <span
          v-if="addBtnTitle && !btnTitleBefore"
          class="btn-title"
          style="margin-left: 8px"
        > {{ addBtnTitle }}</span>
        <a-button
          v-if="isEdit && allowAdd && items.length < max"
          :class="['add-btn', pageName === 'lifePageConfig' && text !== '商品' ? 'add-border' : '']"
          size="large"
          style="margin-bottom: 0"
          type="link"
          @click="onEdit()"
        >
          <PlusOutlined />
          {{ pageName === 'lifePageConfig' && text !== '商品' ? '新增' : '添加' }}{{ text }}
        </a-button>
      </div>
    </template>
    <template v-else>
      <a-button
        v-if="isEdit && allowAdd && items.length < max"
        class="add-btn"
        size="large"
        type="link"
        @click="onEdit()"
      >
        <PlusOutlined />
        添加{{ text }}
      </a-button>

      <span
        v-if="addBtnTitle && !btnTitleBefore"
        class="btn-title"
      > {{ addBtnTitle }}</span>
      <img
        v-if="addBtnTitleTag && addBtnTitleTag != ''"
        alt="addBtnTitleTag"
        class="title-tag"
        contextmenu=""
        :src="addBtnTitleTag"
      >
      <span
        v-if="addBtnSubtitle"
        class="btn-sub-title"
      > {{ addBtnSubtitle }}</span>
    </template>

    <span v-if="scrollbg && scrollbg.method == 'text'">
      <br>
      <CardImage
        v-if="scrollbg"
        :allow-delete="false"
        :allow-edit="false"
        :card-switch-false-value="cardSwitchFalseValue"
        :card-switch-name="cardSwitchName"
        :card-switch-true-value="cardSwitchTrueValue"
        :card-text-type="cardTextType"
        :card-width="cardWidth"
        :image-height="imageHeight"
        :image-key="imageKey"
        :image-width="imageWidth"
        :is-edit="isEdit"
        :item="scrollbg"
        :show-image-path="showImagePath"
        style="margin-left: 7px"
        @on-delete="onDelete"
        @on-edit="onEdit(scrollbg)"
        @on-switch="onSwitch"
      />
    </span>
    <drag
      :direction="direction"
      :item-width="itemWidth"
      :items="items"
      @on-sort="update"
    >
      <template #item="{ item }">
        <template v-if="cardType === 'scheme'">
          <CardScheme
            :active="item.active"
            :allow-delete="allowDelete"
            :card-switch-false-value="cardSwitchFalseValue"
            :card-switch-name="cardSwitchName"
            :card-switch-true-value="cardSwitchTrueValue"
            :card-text-type="cardTextType"
            :card-width="cardWidth"
            :image-height="imageHeight"
            :image-width="imageWidth"
            :is-edit="isEdit"
            :item="item"
            :preview="false"
            @click="cardClick(item.dragId)"
            @on-delete="onDelete"
            @on-edit="onEdit(item)"
            @on-switch="onSwitch"
          />
        </template>
        <template v-if="cardType === 'image'">
          <CardImage
            :allow-delete="allowDelete"
            :allow-edit="allowEdit"
            :card-switch-false-value="cardSwitchFalseValue"
            :card-switch-name="cardSwitchName"
            :card-switch-show="cardSwitchShow"
            :card-switch-true-value="cardSwitchTrueValue"
            :card-text-type="cardTextType"
            :card-width="cardWidth"
            :image-height="imageHeight"
            :image-key="imageKey"
            :image-width="imageWidth"
            :is-edit="isEdit"
            :is-order-cancel-pop="isOrderCancelPop"
            :item="item"
            :show-image-path="showImagePath"
            @on-delete="onDelete"
            @on-edit="onEdit(item)"
            @on-switch="onSwitch"
          />
        </template>
        <template v-if="cardType === 'text'">
          <CardText
            :allow-delete="allowDelete"
            :card-switch-false-value="cardSwitchFalseValue"
            :card-switch-name="cardSwitchName"
            :card-switch-true-value="cardSwitchTrueValue"
            :card-text-type="cardTextType"
            :card-width="cardWidth"
            :is-edit="isEdit"
            :item="item"
            @on-delete="onDelete"
            @on-edit="onEdit(item)"
            @on-switch="onSwitch"
          />
        </template>
        <template v-if="cardType === 'menu'">
          <CardMenu
            :active="item.active"
            :allow-delete="allowDelete"
            :allow-edit="item.allowEdit === false ? false : true"
            :card-item-class="cardItemClass"
            :card-switch-false-value="cardSwitchFalseValue"
            :card-switch-name="cardSwitchName"
            :card-switch-true-value="cardSwitchTrueValue"
            :card-text-type="cardTextType"
            :card-width="cardWidth"
            :is-edit="isEdit && !item.noEdit"
            :item="item"
            :show-drag-icon="showDragIcon"
            @click="cardClick(item.dragId)"
            @on-delete="onDelete"
            @on-edit="onEdit(item)"
            @on-switch="onSwitch"
          />
        </template>
        <template v-if="cardType === 'coupon'">
          <CardCoupon
            :allow-delete="allowDelete"
            :card-switch-false-value="cardSwitchFalseValue"
            :card-switch-name="cardSwitchName"
            :card-switch-true-value="cardSwitchTrueValue"
            :card-text-type="cardTextType"
            :card-width="cardWidth"
            :image-height="imageHeight"
            :image-key="imageKey"
            :image-width="imageWidth"
            :is-edit="isEdit"
            :item="item"
            :show-image-path="showImagePath"
            @on-delete="onDelete"
            @on-edit="onEdit(item)"
            @on-switch="onSwitch"
          />
        </template>
        <template v-if="cardType === 'cardListGroup'">
          <card-list-group
            :group-type="groupType"
            :items="item.items"
            :page-name="pageName"
            :parent="item"
            @on-delete="onDelete(item)"
            @on-edit="onEdit(item)"
          />
        </template>
      </template>
    </drag>
    <form-modal
      v-model:visible="formModal.visible"
      :async-data="formModal.asyncData"
      :auto-close="modalShow"
      :form="formModal.form"
      :title="formModal.title"
      :width="formWidth"
      @on-validate="onValidate"
    />
  </div>
</template>
<script>
/**
 * 这是一个业务组件，显示一个可拖拽可编辑的卡片列表
 * tips: 这个组件的数据，一定要整个替换才会被监听。
 *
 * 1.支持租赁商品显示以及编辑删除
 * 2.支持轮播图片显示以及编辑删除
 * 3.
 */
import { PlusOutlined } from '@ant-design/icons-vue';
import CardScheme from '../card/card-scheme.vue';
import CardImage from '../card/card-image.vue';
import CardText from '../card/card-text.vue';
import CardMenu from '../card/card-menu.vue';
import CardCoupon from '../card/card-coupon.vue';
import { formConfig } from '../../config/form-config';
import { card } from '../../mixin/card';
import CardListGroup from '../card-list-group/card-list-group.vue';
import { message } from 'ant-design-vue';
export default {
  components: {
    PlusOutlined,
    CardScheme,
    CardImage,
    CardText,
    CardMenu,
    CardCoupon,
    CardListGroup,
  },
  inject: ['formGroup'],
  props: {
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    cardType: {
      type: String,
      default: 'image', // image | scheme | text | menu
    },
    cardText: {
      type: String,
      default: '', // image | scheme | text | menu
    },
    cardTitle: {
      type: String,
      default: '', // image | scheme | text | menu
    },
    scrollbg: {
      type: null,
      default: '', // image | scheme | text | menu
    },
    cardForm: {
      type: String,
      default: '',
    },
    direction: {
      type: String,
      default: 'horizontal', // vertical | horizontal
    },
    addBtnText: {
      type: String,
      default: '',
    },
    itemWidth: {
      type: [String, Number],
      default: 'auto',
    },
    formWidth: {
      type: [Number],
      default: 800,
    },
    isAddSign: {
      type: Boolean,
      default: false,
    },
    sameSign: {
      type: Boolean,
      default: false,
    },
    groupType: {
      type: String,
      default: '',
    },
    addBtnTitle: {
      type: String,
      default: '',
    },
    addBtnSubtitle: {
      type: String,
      default: '',
    },
    addBtnTitleTag: {
      type: String,
      default: '',
    },
    modalShow: {
      type: Boolean,
      default: true,
    },
    valiData: {
      type: Function,
      default: null,
    },
    //隐藏子模块的switch，一般在被父模块或者其他代理switch之后开启，自身不再需要控制switch
    cardSwitchShow: {
      type: Boolean,
      default: true,
    },
    //用于代理开启了cardSwitchName字段的子模块，接管所有子模块中的switch
    proxyChildSwitch: {
      type: Object,
      default() {
        return {};
      },
    },
    //用于代理其他模块的switch,数组内的模块switch状态会与当前一致
    proxyModuleSwitch: {
      type: Array,
      default() {
        return [];
      },
    },
    //指定switch默认值
    defaultCardSwitchValue: {
      type: Boolean || Number || String || undefined,
      default: undefined,
    },
    //指定btnTitle样式放前面
    btnTitleBefore: {
      type: Boolean,
      default: false,
    },
    pageName: {
      type: String,
      default: '',
    },
    // 当点击保存或者修改时，是否调用message进行提示
    dialogConfirmShoweMessage: {
      type: Boolean,
      default: true,
    },
    ...card.props,
  },
  emits: ['update:value', 'on-card-click', 'on-edit', 'on-add', 'on-delete', 'on-switch'],
  data() {
    return {
      items: [],
      formModal: {
        visible: false,
        form: [],
        title: '',
        asyncData: false,
      },
      id: '',
    };
  },
  computed: {
    text() {
      if (this.addBtnText) {
        return this.addBtnText;
      }
      const { cardType } = this;
      let text = '';
      switch (cardType) {
        case 'scheme':
          text = '商品';
          break;
        case 'image':
          text = '图片';
          break;
        case 'coupon':
          text = '优惠券';
          break;
        case 'text':
          text = '';
          break;
      }
      return text;
    },
    proxySwitchStatus() {
      let status = false;
      if (this.items.length) {
        status = this.items.every(item => {
          return item[this.cardSwitchName];
        });
      }
      //让被代理模块的状态跟当前模块switch保持一样
      this.handleOtherModuleSwitch(status);
      return status;
    },
    // 合并初始值
    proxyChildSwitchAssign() {
      return Object.assign(
        {
          show: false,
          size: 'default',
          conflictModule: [], //与自身switch状态冲突的其他card-list模块
        },
        this.proxyChildSwitch,
      );
    },
  },
  watch: {
    value: {
      handler(value) {
        console.log(value);
        // 避免重复更新，例如排序时触发了双向绑定更新，会有问题
        if (this.items === value && this.items) {
          return;
        }
        this.id = this.getUid();
        // 替换数组，触发drag内容变化 (相当于更改了prop数据，更改了父组件数据。要不然父组件，拿不到dragId)
        this.items = value;
        this.items.forEach((item, index) => {
          item.dragId = item.id || item.dragId || `${this.id}${index.toString()}`;

          // 特殊处理图片类型的extraData
          if (this.cardType === 'image' && item.extraData) {
            const target = item.extraData;
            if (typeof target === 'string') {
              item.extraData = target;
              return;
            }
            if (typeof target === 'object') {
              let res = '';
              Object.keys(target).forEach(key => {
                res = `${res}${res ? '&' : ''}${key}=${target[key]}`;
              });
              item.extraData = res;
              return;
            }
            item.extraData = '';
          }
          // 特殊处理商品类型的rent_tag 返回的数组要转成字符串
          if (this.cardType === 'scheme' && item.rent_tag) {
            item.rent_tag = item.rent_tag.toString();
          }
        });
      },
      immediate: true,
    },
  },
  methods: {
    cardClick(id) {
      this.$emit('on-card-click', id);
    },
    onDelete(item) {
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].dragId === item.dragId) {
          this.items.splice(i, 1);
          this.$message.success('操作成功，保存修改后生效');
          this.$emit('on-delete');
          this.update();
          break;
        }
      }
    },
    openModal({ title, form }) {
      this.formModal.title = title;
      this.formModal.form = form;
      this.formModal.asyncData = form[0].asyncData;

      this.formModal.visible = true;
    },
    onValidate(newItem) {
      const newItems = JSON.parse(JSON.stringify(this.items)); //即将更新的数据
      // 渠道重复自定义验证start
      if (this.activeItemId !== null) {
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].dragId === this.activeItemId) {
            const tamp = {
              ...this.items[i],
              ...newItem,
            };
            newItems.splice(i, 1, tamp);
          }
        }
      } else {
        newItems.splice(newItems.length, 0, newItem);
      }
      if (this.valiData) {
        if (this.valiData(newItems)) {
          this.formModal.visible = false;
        } else {
          message.error('已存在默认渠道,请选择其他渠道!');
          return;
        }
      }
      // 渠道重复自定义验证end
      if (this.activeItemId !== null) {
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].dragId === this.activeItemId) {
            const tamp = {
              ...this.items[i],
              ...newItem,
            };
            // 处理多个元素，共用一个坑位的情况，标识：sameSign
            if (this.sameSign && !tamp.position_sign) {
              tamp.position_if = 0;
              const firstHasSign = this.items.filter(e => e.position_sign)[0];
              tamp.position_sign = firstHasSign ? firstHasSign.position_sign : `pos${new Date().valueOf()}`;
            }
            if (this.isAddSign && !tamp.position_sign) {
              tamp.position_if = 0;
              tamp.position_sign = `pos${new Date().valueOf()}`;
            }
            this.items.splice(i, 1, tamp);
            this.dialogConfirmShoweMessage && this.$message.success('操作成功，保存修改后生效');
            this.update();
            this.$emit('on-edit', tamp);
            break;
          }
        }
      } else {
        const tamp = {
          ...newItem,
          dragId: `${this.items.length}${this.getUid()}`,
        };
        if (this.cardSwitchName) {
          tamp[this.cardSwitchName] =
            this.defaultCardSwitchValue == undefined ? this.cardSwitchTrueValue : this.defaultCardSwitchValue; // 防止新增时缺少控制字段
        }
        if (this.isAddSign) {
          tamp.position_if = 0;
          tamp.position_sign = `pos${new Date().valueOf()}`;
        }
        // 处理多个元素，共用一个坑位的情况，标识：sameSign
        if (this.sameSign) {
          tamp.position_if = 0;
          const firstHasSign = this.items.filter(e => e.position_sign)[0];
          tamp.position_sign = firstHasSign ? firstHasSign.position_sign : `pos${new Date().valueOf()}`;
        }
        this.items.splice(this.items.length, 0, tamp);
        this.$message.success('操作成功，保存修改后生效');
        this.update();
        this.$emit('on-add', tamp);
      }
    },
    update() {
      this.$emit('update:value', this.items);
    },
    onEdit(item) {
      if (!formConfig[this.cardForm]) {
        return;
      }

      const form = formConfig[this.cardForm].map(formItem => {
        return { ...formItem };
      });
      // 保留编辑标识
      this.activeItemId = null;
      if (item) {
        form.forEach(formItem => {
          if (typeof item[formItem.key] !== 'undefined') {
            formItem.value = item[formItem.key];
          }
        });
        this.activeItemId = item.dragId;
      }

      this.openModal({
        title: item ? `编辑${this.text}` : `添加${this.text}`,
        form,
      });
    },
    // 卡片switch开关变更
    onSwitch(item, changeItemValue) {
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].dragId === item.dragId) {
          this.items[i] = Object.assign(item, changeItemValue);
          this.update();
          break;
        }
      }
      this.$emit('on-switch', item, changeItemValue);
    },
    getUid() {
      return `list_${Math.random().toString(16).slice(-6)}${new Date().getTime()}`;
    },
    proxyChildSwitchStatus(status) {
      if (this.items.length && this.cardSwitchName) {
        this.items.forEach(item => {
          item[this.cardSwitchName] = status;
        });
        this.handleOtherModuleSwitch(status);
        this.handleConflictModule(status);
      }
    },
    // 代理其他模块的switch
    handleOtherModuleSwitch(status) {
      const modules = this.proxyModuleSwitch;
      modules.length &&
        modules.forEach(key => {
          const curModule = this.formGroup.filter(item => item.key == key)[0];
          if (curModule.value.length) {
            curModule.cardSwitchName != undefined &&
              curModule.value.map(item => {
                item[curModule.cardSwitchName] = status;
              });
          }
        });
    },
    //更改冲突模块switch
    handleConflictModule(status) {
      const modules = this.proxyChildSwitchAssign.conflictModule;
      if (!modules.length && !status) return;
      modules.forEach(key => {
        const curModule = this.formGroup.filter(item => item.key == key)[0];
        if (curModule.value.length) {
          curModule.cardSwitchName != undefined &&
            curModule.value.map(item => {
              item[curModule.cardSwitchName] = false;
            });
        }
      });
    },
  },
};
</script>
<style scoped lang="less">
.add-btn {
  margin-bottom: 8px;
}
.header-add-btn {
  color: rgba(6, 21, 51, 0.65);
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
}
.header-add-icon {
  width: 15px;
  height: 16px;
  margin: 0 4px 0 16px;
  color: rgba(6, 21, 51, 0.65);
}
.header {
  .title {
    position: relative;
    margin-bottom: 8px;
    padding-left: 16px;
    color: rgba(6, 21, 51, 0.85);
    font-weight: 500;
    font-size: 16px;
  }
  .title::before {
    position: absolute;
    top: 50%;
    left: 6px;
    width: 4px;
    height: 16px;
    background: rgb(0, 200, 190);
    transform: translateY(-50%);
    content: '';
  }
}
.btn-title,
.btn-sub-title {
  display: inline-block;
  margin-left: 18px;
  font-weight: bold;
  font-size: 16px;
  line-height: 26px;
}
.btn-sub-title {
  margin-left: 14px;
  color: #999;
  font-size: 14px;
}

.title-tag {
  display: inline-block;
  max-width: 32px;
  margin-left: 8px;
}

.add-border {
  margin-left: 16px;
  color: rgba(6, 21, 51, 0.65);
  font-size: 14px;
  line-height: 23px;
  border: 1px solid rgba(6, 21, 51, 0.15);
}

.header-box {
  display: flex;
  align-items: center;
  min-width: calc(100vw - 400px);
  margin-bottom: 10px;
  line-height: 40px;
  background: #f5f7fa;
  border-radius: 6px;
}

.header-icon {
  width: 2px;
  height: 14px;
  background: #00c8be;
}

.modal-box {
  margin-right: 6px;
  margin-bottom: 16px;
  margin-left: 6px;
  line-height: 72px;
  // background: #fff;
}
</style>
