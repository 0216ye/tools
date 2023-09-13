<template>
  <div
    v-for="item in items"
    :key="item"
    class="flex-wrap"
  >
    <div class="title">
      {{ item.title }}
    </div>
    <div class="content flex-con">
      {{ item.text }}
    </div>
  </div>
  <div
    v-if="showcategory"
    class="flex-wrap"
  >
    <div class="title">
      所属类目
    </div>
    <div class="content flex-con">
      <span
        v-for="(item, index) in category.category"
        :key="index"
      >{{ item.name + '&#12288;' }}</span>
    </div>
  </div>
  <div
    v-if="showcategory"
    class="flex-wrap"
  >
    <div class="title">
      所属类型
    </div>
    <div class="content flex-con">
      <span
        v-for="(item, index) in category.type"
        :key="index"
      >{{ item.name + '&#12288;' }}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    items: {
      type: Array,
      default() {
        return [];
      },
    },
    category: {
      type: Array,
      default() {
        return [];
      },
    },
    showcategory: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
};
</script>
<style scoped lang="less">
.title {
  width: 30%;
  margin-bottom: 16px;
  padding-right: 12px;
  color: rgba(0, 0, 0, 0.45);
  text-align: right;
}
.content {
  color: rgba(0, 0, 0, 0.65);
}
</style>
