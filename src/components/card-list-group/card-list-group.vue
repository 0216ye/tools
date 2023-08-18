<template>
  <div class="wrap">
    <template v-if="!pageName">
      <a-button
        v-if="items && config.addButtonText != '活动专区' && showAddButton"
        style="margin: 24px 12px 12px 12px"
        type="primary"
        @click="onAddTabs(items)"
      >
        <PlusOutlined />
        添加{{ config.addButtonText || '' }} ({{ items.length }})
      </a-button>
      <span
        v-if="items && groupTitle"
        class="group-title"
      >
        {{ groupTitle || '' }}
      </span>
    </template>
    <template v-if="pageName === 'lifePageConfig'">
      <div class="life-page-title">
        <span
          v-if="items && groupTitle"
          class="group-title"
          style="margin-left: 12px"
        >
          {{ groupTitle || '' }}
        </span>
        <div
          v-if="items && config.addButtonText != '活动专区' && showAddButton"
          class="new-add-btn"
          type="primary"
          @click="onAddTabs(items)"
        >
          <PlusOutlined />
          添加{{ config.addButtonText || '' }}
        </div>
        <i class="line" />
        <div
          v-if="config.curShowEditBtn"
          style="color: rgba(6, 21, 51, 0.65); cursor: pointer"
          @click="onEdit"
        >
          <EditOutlined style="margin-right: 4px" />编辑
        </div>
        <i class="line" />
        <div
          v-if="config.curShowDeleteBtn"
          style="color: rgba(6, 21, 51, 0.65); cursor: pointer"
          @click="onDelete"
        >
          <DeleteOutlined style="margin-right: 4px" />删除
        </div>
      </div>
    </template>

    <div
      v-if="!showAddButton"
      class="wrap-action wrap-action-btn"
    >
      <a-button
        v-if="config.curShowEditBtn"
        type="link"
        @click="onEdit"
      >
        <EditOutlined />编辑
      </a-button>
      <a-button
        v-if="config.curShowDeleteBtn"
        type="link"
        @click="onDelete"
      >
        <DeleteOutlined />删除
      </a-button>
    </div>
  </div>
  <div
    v-if="cover"
    style="width: 200px; padding-left: 20px"
  >
    <image-item
      border="none"
      :img="cover"
      width="100"
    />
  </div>
  <div class="wrap">
    <drag :items="items">
      <template #item="{ item, index }">
        <div
          v-show="showAddButton"
          class="wrap-action wrap-action-btn"
        >
          <a-button
            type="link"
            @click="onEditTabs(item)"
          >
            <EditOutlined />编辑
          </a-button>
          <a-button
            v-if="!(config.noDeleteFirst && index === 0)"
            type="link"
            @click="onDeleteTabs(items, item)"
          >
            <DeleteOutlined />删除
          </a-button>
        </div>

        <!-- 特殊处理一下自动推送的情况 -->
        <template v-if="item.method === 'auto'">
          <span class="btn-title">{{ item[config.curGroupName] }}</span>
          <span class="btn-sub-title">{{ item[config.curGroupSubName] }}</span>
          <a-alert
            :message="`根据排名自动推送${item.show_num}个产品`"
            style="margin: 8px 0 16px"
            type="success"
          />
        </template>
        <template v-else-if="item.method === 'text' || item.method === 'huodong'">
          <slot
            :item="item"
            name="beforeItem"
          />
          <card-list
            v-model:value="item[config.curListKey]"
            :add-btn-subtitle="item[config.curGroupSubName]"
            :add-btn-text="config.curListTitle"
            :add-btn-title="item[config.curGroupName]"
            :add-btn-title-tag="item[config.curGroupNameTag]"
            :allow-add="config.allowFirst || !(config.noDeleteFirst && index === 0)"
            :card-form="config.cardForm"
            :card-text-type="config.cardTextType"
            card-type="image"
            :card-width="160"
            :image-height="160"
            image-width="70%"
            :is-add-sign="true"
            :item-width="config.itemWidth"
            :max="config.max"
            :scrollbg="item"
            @on-add="afterAddItem"
            @on-card-click="onCardClick"
          />
          <slot
            :item="item"
            name="afterItem"
          />
        </template>
        <!-- 企业小程序分类页面数据配置 -->
        <template v-else-if="item.method === 'classifyPageConfigTab'">
          <slot
            :item="item"
            name="beforeItem"
          />
          <card-list
            v-model:value="item[config.curListKey]"
            :add-btn-subtitle="item[config.curGroupSubName]"
            :add-btn-text="config.curListTitle"
            :add-btn-title="item[config.curGroupName]"
            :add-btn-title-tag="item[config.curGroupNameTag]"
            :allow-add="config.allowFirst || !(config.noDeleteFirst && index === 0)"
            :btn-title-before="true"
            :card-form="config.cardForm"
            :card-text-type="config.cardTextType"
            card-type="scheme"
            :card-width="config.cardWidth"
            :image-height="200"
            :is-add-sign="true"
            :item-width="config.itemWidth"
            :max="config.max"
            @on-add="afterAddItem"
            @on-card-click="onCardClick"
          />
          <slot
            :item="item"
            name="afterItem"
          />
        </template>
        <template v-else>
          <slot
            :item="item"
            name="beforeItem"
          />
          <card-list
            v-model:value="item[config.curListKey]"
            :add-btn-subtitle="item[config.curGroupSubName]"
            :add-btn-text="config.curListTitle"
            :add-btn-title="item[config.curGroupName]"
            :add-btn-title-tag="item[config.curGroupNameTag]"
            :allow-add="config.allowFirst || !(config.noDeleteFirst && index === 0)"
            :card-form="config.cardForm"
            :card-text-type="config.cardTextType"
            card-type="scheme"
            :card-width="config.cardWidth"
            :image-height="config.imgHight || 70"
            :image-width="config.imgWidth || '70%'"
            :is-add-sign="true"
            :item-width="config.itemWidth"
            :max="config.max"
            :page-name="pageName"
            @on-add="afterAddItem"
            @on-card-click="onCardClick"
          />
          <slot
            :item="item"
            name="afterItem"
          />
        </template>
      </template>
    </drag>
  </div>
  <form-modal
    v-model:visible="formModal.visible"
    :auto-close="false"
    :form="formModal.form"
    :loading="formModal.loading"
    :title="formModal.title"
    :width="800"
    @on-validate="onValidateForCreate"
  />
</template>
<script>
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { groupListConfig } from '../../config/group-list-config';

export default {
  components: {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
  },
  props: {
    // 列表类型
    groupType: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      default() {
        return [];
      },
    },
    parent: {
      type: Array,
      default() {
        return [];
      },
    },
    showAddButton: {
      type: Boolean,
      default: true,
    },
    pageName: {
      type: String,
      default: '',
    },
  },
  emits: ['on-click', 'on-update', 'on-edit', 'on-delete'],
  data() {
    return {
      formModal: {
        visible: false,
        form: [],
        title: '操作窗口',
        loading: false,
      },
    };
  },
  computed: {
    config() {
      return groupListConfig[this.groupType] || [];
    },
    groupTitle() {
      // group的名字，小程序首页，产品展示会用上
      return `${this.parent.name || ''}${this.parent.slogan ? `(${this.parent.slogan})` : ''}`;
    },
    cover() {
      return this.groupType === 'indiList' || this.groupType === 'indiLifeList' ? this.parent.icon : '';
    },
  },
  methods: {
    onEdit() {
      this.$emit('on-edit');
    },
    onDelete() {
      this.$modal.confirm({
        title: '提示',
        content: '确定删除？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.$emit('on-delete');
        },
      });
    },
    onCardClick(dragId) {
      this.$emit('on-click', dragId);
    },
    // 添加tab组
    onAddTabs(groupList) {
      this.editTabs(groupList, 'create');
    },
    onEditTabs(target) {
      this.editTabs(target, 'edit', target);
    },
    editTabs(target, type, curEditItem) {
      this.formModal.visible = true;
      this.formModal.type = `${type}`;
      this.formModal.target = target; // target有可能是一个列表，有可能是一个项目
      switch (this.groupType) {
        case 'categoryTab':
        case 'indiRecommend':
        case 'newInidRecommend':
        case 'indiExplosion':
        case 'miniRecommend':
          this.formModal.title = type === 'create' ? '新增tab分类' : '编辑tab分类';
          break;
        case 'indiList':
        case 'indiLifeList':
          this.formModal.title = type === 'create' ? '新增子模块' : '编辑子模块';
          break;
      }
      this.formModal.form = this.config.curAddForm.map(item => {
        return {
          ...item,
          value: (curEditItem && curEditItem[item.key]) || item.value,
        };
      });
    },
    // 添加小tab后要进行初始化
    afterAddItem(groupListItem) {
      if (this.config.lastListKey) {
        groupListItem[this.config.lastListKey] = [];
      }
      this.$emit('on-update');
    },
    onDeleteTabs(target, item) {
      this.$modal.confirm({
        title: '提示',
        content: `确定删除 ${item[this.config.curGroupName]} ？`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const index = target.indexOf(item);
          if (index !== -1) {
            target.splice(index, 1);
            this.$emit('on-update');
          }
        },
      });
    },
    // 为当前的items添加内容
    onValidateForCreate(res) {
      const type = this.formModal.type;
      const target = this.formModal.target;
      if (type === 'create' && this.config.addButtonText == '推荐专区') {
        res['method'] = 'text';
      }
      if (type === 'create' && this.config.addButtonText == '活动专区') {
        res['method'] = 'huodong';
      }
      if (type === 'create') {
        target.push({
          ...res,
          [this.config.curListKey]: [],
        });
      }
      if (type === 'edit' && target) {
        Object.assign(target, res);
      }
      this.formModal.visible = false;
    },
  },
};
</script>
<style scoped lang="less">
.wrap {
  position: relative;
  padding-right: 18px;
  .wrap-action {
    position: absolute;
    top: 8px;
    right: 24px;
  }
  .group-title {
    display: inline-block;
    margin-left: 18px;
    font-weight: bold;
    font-size: 20px;
    border-bottom: 2px solid rgb(0, 200, 190);
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
.line {
  width: 1px;
  height: 14px;
  margin: 0 16px;
  margin-bottom: 2px;
  border: 1px solid rgba(6, 21, 51, 0.25);
}

.life-page-title {
  display: flex;
  align-items: center;
  padding-top: 24px;
  padding-bottom: 18px;
}
</style>
