<template>
  <a-card
    hoverable
    :style="cardStyle"
  >
    <template #actions>
      <div class="flex-wrap flex-x-around">
        <EditOutlined @click="onEdit(item)" />
        <div v-if="!allowDelete" />
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
    <a-card-meta>
      <template
        v-if="item.name"
        #title
      >
        {{ item.name }}
      </template>
      <template #description>
        <label class="list-wrap">
          <template v-if="useSwitch">
            <a-tag
              v-if="switchChecked"
              color="success"
            > 启用 </a-tag>
            <a-tag
              v-else
              color="error"
            > 未启用 </a-tag>
          </template>
        </label>

        <label
          v-if="item.path"
          class="line-wrap"
        >
          {{ item.path }}
        </label>

        <template v-if="cardTextType === 'add-gift'">
          <a-row>
            <a-col span="8">
              <label class="line-wrap">福利类型<a-tag color="blue">{{ item.gift_type === 1 ? '优惠券' : '现金' }}</a-tag></label>
              <label class="line-wrap">福利内容<a-tag color="blue">{{ item.gift_content || '未设置' }}</a-tag></label>
            </a-col>
            <a-col span="8">
              <label class="line-wrap">首页开启<a-tag color="blue">{{ item.index_open === 1 ? '开启' : '关闭' }}</a-tag></label>
              <label class="line-wrap">下单成功页<a-tag color="blue">{{ item.order_success_open === 1 ? '开启' : '关闭' }}</a-tag></label>
            </a-col>
            <a-col span="8">
              <label class="line-wrap">已领现金金额<a-tag color="red">{{ item.money_num || 0 }} 元</a-tag></label>
              <label class="line-wrap">已领优惠券张数<a-tag color="red">{{ item.coupon_num || 0 }} 张</a-tag></label>
            </a-col>
          </a-row>
        </template>
        <template v-if="cardTextType === 'member-type'">
          {{ item.member ? '开启' : '关闭' }}会员视角
        </template>
        <template v-if="cardTextType === 'radius-type'">
          {{ item.top ? '开启' : '关闭' }}上圆角<br>
          {{ item.bottom ? '开启' : '关闭' }}下圆角
        </template>
      </template>
    </a-card-meta>
  </a-card>
</template>
<script>
/**
 * cardtext 容器
 */
import { card } from '@/mixin/card';

export default {
  mixins: [card],
};
</script>
<style lang="less" scoped>
.line-wrap {
  display: -webkit-box;
  height: 44px;
  overflow: hidden;
  line-height: 44px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  .ant-tag {
    margin-left: 20px;
  }
}
</style>
