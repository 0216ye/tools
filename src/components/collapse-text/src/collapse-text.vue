<template>
  <div class="wrapper">
    <input
      :id="uid"
      class="exp"
      type="checkbox"
    >
    <div class="text">
      <label
        class="btn"
        :for="uid"
      />
      <span
        v-if="isSetHtml"
        v-html="text"
      />
      <span v-else>{{ text }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { nanoid } from 'nanoid';

export default defineComponent({
  name: 'collapse-text',
  props: {
    text: {
      type: String,
      default: '',
    },
    isSetHtml: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const uid = nanoid() + 'id';

    return {
      uid,
    };
  },
});
</script>

<style scoped lang="less">
.wrapper {
  display: flex;
  overflow: hidden;
}
.text {
  position: relative;
  display: -webkit-box;
  overflow: hidden;
  text-align: justify;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.text::before {
  float: right;
  height: calc(100% - 24px);
  content: '';
}
.text::after {
  position: absolute;
  width: 999vw;
  height: 999vw;
  margin-left: -100px;
  box-shadow: inset calc(100px - 999vw) calc(30px - 999vw) 0 0 #fff;
  transition: box-shadow 0.5s;
  content: '';
}
.btn {
  float: right;
  clear: both;
  margin-left: 10px;
  padding: 0 8px;
  color: var(--ant-primary-color);
  line-height: 24px;
  border-radius: 4px;
  cursor: pointer;
}
.btn::before {
  content: '展开';
}
.exp {
  display: none;
}
.exp:checked + .text {
  -webkit-line-clamp: 999;
}
.exp:checked + .text::after {
  visibility: hidden;
}
.exp:checked + .text .btn::before {
  content: '收起';
}
</style>
