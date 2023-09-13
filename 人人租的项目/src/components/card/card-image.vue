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
        <div v-if="!allowEdit && !allowDelete" />
        <EditOutlined
          v-if="allowEdit"
          @click="onEdit(item)"
        />
        <DeleteOutlined
          v-if="allowDelete"
          @click="onDelete(item)"
        />
        <label v-if="!allowDelete && !useSwitch" />
        <a-switch
          v-if="useSwitch && cardSwitchShow"
          :checked="switchChecked"
          size="small"
          @change="onSwitchChange"
        />
      </div>
    </template>
    <template #cover>
      <image-item
        border="none"
        :height="imageHeight"
        :img="item[imageKey]"
        :width="imageWidth"
      />
      <div
        v-if="useSwitch && !isOrderCancelPop"
        class="tag"
      >
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
      </div>
      <div
        v-if="showImagePath"
        class="path-text"
      >
        {{ path }}
      </div>
      <div
        v-if="cardTextType === 'marketsource'"
        class="tag-wrap"
      >
        <a-tag>大标题: {{ item.title }}</a-tag>
        <a-tag>小标题: {{ item.sub_title }}</a-tag>
        <a-tag>颜色: {{ item.color }}</a-tag>
      </div>
      <div
        v-if="cardTextType === 'time' && timeTag"
        class="tag-wrap"
      >
        <a-tag>倒计时: {{ timeTag }}</a-tag>
      </div>
      <!-- 背景图的更换时间 start -->
      <div
        v-if="cardTextType === 'time_start'"
        class="tag-wrap"
      >
        <a-tag>更换时间: {{ item.time_start }}</a-tag>
      </div>
      <!-- 背景图的更换时间 end -->

      <!-- 商品信息 start -->
      <div
        v-if="cardTextType === 'commodity'"
        class="commodity"
      >
        <!-- 标题 -->
        <div class="title">
          {{ item.title }}
        </div>
        <div
          class="flex-x"
          style="align-items: center"
        >
          <!-- 租金 -->
          <div
            v-if="item.rent_money"
            class="rent-money"
          >
            <span class="unit"> ¥ </span>
            <span class="money1">{{ item.rent_money.split('.')[0] }}</span>
            <span
              v-if="item.rent_money.split('.')[1]"
              class="money2"
            >.{{ item.rent_money.split('.')[1] }}</span>
            <span class="suffix">/天</span>
          </div>
          <!-- 副标题 -->
          <a-tag
            v-if="item.sub_head"
            class="sub-head"
            color="orange"
          >
            {{ item.sub_head }}
          </a-tag>
        </div>
        <div
          v-if="item.buy_num"
          class="buy-num"
        >
          已抢{{ item.buy_num }}台
        </div>
        <div class="tag-wrap">
          <a-tag> 更换时间: {{ item.time_start }} </a-tag>
        </div>
      </div>
      <!-- 商品信息 end -->

      <!-- 我的服务start -->
      <div
        v-if="cardTextType === 'myService'"
        class="my-service"
      >
        <!-- 服务标题 -->
        <div class="service-title">
          {{ item.service_title }}
        </div>
        <a-tag class="service-login">
          需要登录： {{ item.is_require_login ? '是' : '否' }}
        </a-tag>
      </div>
      <!-- 我的服务end -->
      <!-- 下单成功页弹窗/取消订单页start -->
      <div
        v-if="['orderCancelPopup', 'orderSuccessPopup'].includes(cardTextType)"
        class="orderSuccessPopup"
      >
        <a-tag
          :class="['orderSuccessPopup-tag', switchChecked && isOrderCancelPop ? 'select-orderCancelPopup-tag' : '']"
        >
          {{ item.channelType && parseChannelType }}
        </a-tag>
      </div>
      <!-- 下单成功页弹窗end -->
    </template>
  </a-card>
</template>
<script>
/**
 * banner容器
 */
import { card } from '@/mixin/card';

export default {
  mixins: [card],
  computed: {
    path() {
      const str = this.item.cover.split('/').pop();
      return str.substr(str.length - 12 ? str.length - 12 : 0, str.length);
    },
    timeTag() {
      const { limit_time, countdown, time_limit } = this.item;
      return limit_time || countdown || time_limit || '';
    },
    parseChannelType() {
      if (typeof this.item.channelType == 'string') {
        try {
          var obj = JSON.parse(this.item.channelType);
          if (typeof obj == 'object' && obj) {
            return JSON.parse(this.item.channelType)[0];
          } else {
            return this.item.channelType[0];
          }
        } catch (e) {
          return this.item.channelType[0];
        }
      }
      return this.item.channelType[0];
    },
  },
};
</script>
<style lang="less" scoped>
::v-deep(.ant-card-body) {
  display: none;
}
.tag-wrap {
  padding: 12px;
}
.tag {
  position: absolute;
  top: 10px;
  right: 10px;
  width: auto;
}
.path-text {
  padding-bottom: 12px;
  font-size: 12px;
  text-align: center;
}
::v-deep(.ant-card-cover) {
  text-align: center;
}

.commodity {
  width: 215px;
  margin: 0 8px;
  .flex-x {
    display: flex;
    justify-content: space-between;
  }
  .rent-money {
    color: red;
    text-align: left;
    .unit,
    .suffix {
      font-size: 20px;
    }
    .money1 {
      font-size: 28px;
    }
    .money2 {
      font-size: 18px;
    }
  }
  .sub-head {
    display: block;
    max-width: 90px;
    height: 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .buy-num {
    color: #908d8d;
    font-size: 12px;
  }
}
.my-service {
  .service-title {
    color: #666;
    font-size: 26px;
    line-height: 41px;
  }
  .service-login {
    margin-top: 26px;
    margin-bottom: 13px;
  }
}
.orderSuccessPopup {
  .orderSuccessPopup-tag {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
    height: 22px;
    padding: 0 8px;
    color: rgba(6, 21, 51, 0.65);
    font-weight: 400;
    font-size: 12px;
    line-height: 22px;
    border: 1px solid rgba(6, 21, 51, 0.15);
    border-radius: 2px;
  }

  .select-orderCancelPopup-tag {
    color: #00c8be;
    background: #ebfafa;
    border: 1px solid #7fe0da;
  }
}
</style>
