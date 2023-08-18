<template>
  <a-card
    :class="[active ? 'card-active' : '']"
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
      <image-item
        border="none"
        :height="imageHeight"
        :img="item.cover || item.icon"
        :width="imageWidth"
      />
    </template>
    <!-- 普通的方案 -->
    <a-card-meta v-if="cardTextType === ''">
      <template #title>
        {{ item.scheme_title }}
      </template>
      <template #description>
        <div
          v-if="item.tag_attribute"
          style="margin-bottom: 5px"
        >
          <span
            v-for="(item, index) in item.tag_attribute.split(',')"
            :key="index"
            class="tag"
          >
            {{ item }}
          </span>
        </div>
        <div class="line-wrap flex-wrap flex-x-justify">
          <template v-if="item.rental && item.rental !== ''">
            <label class="price"><label class="price-symbol">￥</label>{{ item.rental }}{{ item.suffix }}</label>
          </template>
          <label v-if="item.tenancy && item.tenancy !== ''">{{ item.tenancy }}{{ item.suffix && item.suffix.replace(/\//, '') }}起租</label>
        </div>
        <div class="line-wrap">
          <TagList
            :list="
              item.tag_attribute === undefined && item.tag_service === undefined ? item.rent_tag : item.tag_service
            "
          />
        </div>
      </template>
    </a-card-meta>
    <!-- 普通的方案 -->
    <a-card-meta v-if="cardTextType === 'explosion-item'">
      <template #title>
        <div class="flex-wrap flex-x-justify flex-y-center">
          {{ item.scheme_title }}
        </div>
      </template>
      <template #description>
        <div class="flex-wrap flex-x-justify flex-y-center">
          <template v-if="item.rental && item.rental !== ''">
            <label class="price"> <label class="price-symbol">￥</label>{{ item.rental }}{{ item.suffix }} </label>
          </template>
          <template
            v-if="item.origin_rental && item.origin_rental !== ''"
            style="color: #ccc"
          >
            <del> <label>￥</label>{{ item.origin_rental }}{{ item.suffix }} </del>
          </template>
        </div>
      </template>
    </a-card-meta>
    <!-- 分类tab -->
    <a-card-meta v-if="cardTextType === 'category-tab'">
      <template #description>
        <label class="line-wrap">
          <div style="color: rgba(0, 0, 0, 0.65); text-align: center">{{ item.name }}</div>
        </label>
        <label class="line-wrap line-wrap-length">
          <div style="color: rgba(0, 0, 0, 0.65); text-align: center">({{ item.item_list.length }})</div>
        </label>
      </template>
    </a-card-meta>
    <!-- 置顶的方案 -->
    <a-card-meta v-if="cardTextType === 'top'">
      <template #title>
        {{ item.item_id }}
      </template>
      <template #description>
        <div class="line-wrap">
          <TagList :list="item.city" />
        </div>
      </template>
    </a-card-meta>
    <!-- 快捷入口 -->
    <a-card-meta v-if="cardTextType === 'quick-enter'">
      <template #title>
        <div style="color: rgba(0, 0, 0, 0.65); text-align: center">
          {{ item.value }}
        </div>
      </template>
    </a-card-meta>
    <!-- pc方案 -->
    <a-card-meta v-if="cardTextType === 'index-pc-scheme'">
      <template #title>
        {{ item.title }}
      </template>
      <template #description>
        <div class="line-wrap flex-wrap flex-x-justify">
          <template v-if="item.price && item.price !== ''">
            <label class="price"><label class="price-symbol">￥</label>{{ item.price }}{{ item.suffix ? `/${item.suffix}` : '' }}</label>
          </template>
          <label v-if="item.tenancy && item.tenancy !== ''">{{ item.tenancy }}{{ item.suffix && item.suffix.replace(/\//, '') }}起租</label>
        </div>
        <div class="line-wrap">
          {{ item.subtitle }}
        </div>
        <div class="line-wrap">
          <TagList :list="item.top_title" />
        </div>
      </template>
    </a-card-meta>
    <!-- 小程序楼层 -->
    <a-card-meta v-if="cardTextType === 'mini-storey-list'">
      <template #title>
        {{ item.name }}
      </template>
      <template #description>
        <div class="line-wrap price">
          {{ item.price }}/{{ item.suffix }}
        </div>
      </template>
    </a-card-meta>
  </a-card>
</template>
<script>
/**
 * scheme 容器
 */
import { card } from '@/mixin/card';

export default {
  mixins: [card],
};
</script>
<style lang="less" scoped>
.line-title {
  display: inline-block;
  color: #000;
  font-weight: bold;
}
.line-wrap {
  height: 25px;
  margin-bottom: 6px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.line-wrap:last-child {
  margin-bottom: 0;
}
.price {
  color: #f5222d;
  font-weight: bold;
  .price-symbol {
    font-size: 12px;
  }
}

.card-active {
  border-color: rgb(0, 200, 190);
}
.card-active::before {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: rgb(0, 200, 190);
  content: '';
}
::v-deep(.img-wrap) {
  margin-bottom: 0;
}
::v-deep(.ant-card-body) {
  padding: 12px;
}
::v-deep(.ant-card-cover) {
  text-align: center;
}
.tag {
  display: inline-block;
  margin-left: 5px;
  padding: 2px 5px;
  font-size: 12px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 5px;
}
</style>
