<template>
  <a-card
    hoverable
    :style="cardStyle"
  >
    <template
      #actions
      class="ant-card-actions"
    >
      <div class="flex-wrap flex-x-around">
        <EditOutlined @click="onEdit(item)" />
        <DeleteOutlined
          v-if="allowDelete"
          @click="onDelete(item)"
        />
        <label v-if="!allowDelete && !useSwitch" />
        <a-switch
          v-if="useSwitch"
          :checked="switchChecked"
          size="small"
          @change="onSwitchChange"
        />
      </div>
    </template>
    <template #cover>
      <div class="coupon-box">
        <div class="coupon-value">
          <span class="value-text">{{ item.money }}</span>
          <span class="value-unit">元</span>
        </div>
        <div class="coupon-limit">
          满{{ item.use_money }}元使用
        </div>
        <div class="coupon-type">
          {{ useRange[item.coupon_range] }}
        </div>
      </div>
    </template>
  </a-card>
</template>

<script>
import { card } from '@/mixin/card';

export default {
  name: 'card-coupon',
  mixins: [card],
  data() {
    return {
      useRange: {
        1: '全场使用',
        2: '适用于某类商品',
        3: '适用于指定商品',
      },
    };
  },
};
</script>

<style scoped lang="less">
::v-deep(.ant-card-body) {
  display: none;
}
.coupon-box {
  position: relative;
  width: 214px;
  height: 224px;
  margin: 16px;
  padding-top: 50px;
  text-align: center;
  background-image: url('https://img1.rrzuji.cn/uploads/scheme/2012/14/o/eR7hGZh5fd70ea2181eb.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.coupon-value {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin: 0 0 34px;
  color: #f64356;
  .value-text {
    font-size: 68px;
    line-height: 60px;
  }
  .value-unit {
    font-size: 18px;
  }
}
.coupon-limit {
  margin-bottom: 10px;
  color: #999;
  font-weight: 400;
  font-size: 18px;
  line-height: 18px;
}
.coupon-type {
  color: #999;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
}
</style>
