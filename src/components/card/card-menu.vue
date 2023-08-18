<template>
  <a-card
    :class="[active ? 'card-active' : '', cardItemClass, { 'padding-default': !showAction }]"
    hoverable
    :style="cardStyle"
  >
    <template
      v-if="showAction"
      #actions
    >
      <div class="flex-wrap flex-y-center actions-box">
        <label v-if="!allowDelete && !useSwitch" />
        <label v-if="!allowDelete && !isEdit" />
        <EditOutlined
          v-if="isEdit && allowEdit"
          @click="onEdit(item)"
        />
        <DeleteOutlined
          v-if="allowDelete"
          @click="onDelete(item)"
        />
        <a-switch
          v-if="useSwitch"
          :checked="switchChecked"
          size="small"
          @change="onSwitchChange"
        />
      </div>
    </template>
    <!-- menuName分类菜单名字 -->
    <!-- dataKey小程序首页 -->
    <div class="text">
      <template v-if="item.noDrag !== true && showDragIcon">
        <dragOutlined class="drag-icon" />
      </template>
      <template v-if="cardTextType === 'index-page-menu'">
        {{ item.title }}
        <br>
      </template>
      <template v-else-if="cardTextType === 'checkbox-menu'">
        {{ item.scheme_title }}
      </template>
      <template v-else>
        {{ item.menuName || item.title || item.name }}
      </template>
      <template v-if="useSwitch && cardTextType === 'index-page-menu'">
        <a-tag>底边距: {{ item.bottom }}</a-tag>
      </template>
      <span
        v-if="cardTextType !== 'index-page-menu'"
        style="display: inline-block; width: 8px"
      />
      <template v-if="useSwitch">
        <a-tag
          v-if="switchChecked"
          color="success"
        >
          启用
        </a-tag>
        <a-tag
          v-else
          color="error"
        >
          未启用
        </a-tag>
      </template>
    </div>
  </a-card>
</template>
<script>
/**
 * cardtext 容器
 */
import { card } from '@/mixin/card';
import { DragOutlined } from '@ant-design/icons-vue';

export default {
  components: {
    DragOutlined,
  },
  mixins: [card],
  computed: {
    showAction() {
      const { isEdit, allowEdit, allowDelete, useSwitch } = this;
      return (isEdit && allowEdit) || allowDelete || useSwitch;
    },
  },
};
</script>
<style lang="less" scoped>
::v-deep(.ant-card-actions) {
  position: absolute;
  top: 50%;
  right: 6px;
  background: none;
  border: none;
  transform: translateY(-50%);
}
.ant-card-bordered {
  border-width: 2px;
}
.padding-default {
  ::v-deep(.ant-card-body) {
    padding: 24px 12px 24px 24px;
  }
}
::v-deep(.ant-card-body) {
  padding: 18px 68px 18px 24px;
}
.card-active {
  border-color: rgb(0, 200, 190);
}
.actions-box > * {
  margin: 0 8px;
}
.text {
  font-weight: bold;
  font-size: 16px;
  word-break: break-all;
}
.drag-icon {
  margin-right: 8px;
  font-size: 14px;
  vertical-align: initial;
}
</style>
