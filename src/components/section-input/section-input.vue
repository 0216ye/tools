<template>
  <div class="section-input-list">
    <template
      v-for="(item, index) in values"
      :key="index"
    >
      <a-input
        :disabled="true"
        :value="item"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { Form } from 'ant-design-vue';

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
});

const values = ref<Array<string>>([]);
watch(
  () => props.value,
  val => {
    if (val) {
      values.value = val.replace(/(.{4})/g, '$1 ').split(' ');
    } else {
      values.value = new Array(4);
    }
  },
  {
    immediate: true,
  },
);

Form.useInjectFormItemContext();
</script>

<style scoped lang="less">
.section-input-list {
  display: flex;
  margin: 0 -4px;
  :deep(.ant-input) {
    margin: 0 4px;
    text-align: center;
  }
}
</style>
