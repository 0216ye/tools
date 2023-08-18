<template>
  <div class="editable-cell">
    <div
      v-if="isEdit && showEdit"
      class="editable-cell-input-wrapper"
    >
      <a-input
        :default-value="defaultValue"
        :max="max"
        :min="min"
        :type="type"
        :value="value"
        @input="handleInput"
        @press-enter="saveEditHandle"
      >
        <template #suffix>
          <CheckOutlined @click="saveEditHandle" />
        </template>
      </a-input>
    </div>
    <div
      v-else
      class="editable-cell-text-wrapper"
    >
      <slot name="content" />
      <FormOutlined
        v-show="isEdit"
        @click="setEditHandle"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, ref } from 'vue';
import { FormOutlined, CheckOutlined } from '@ant-design/icons-vue';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  // 输入内容
  value: {
    type: String,
    required: true,
    default: '',
  },
  // 是否允许编辑
  isEdit: {
    type: Boolean,
    required: true,
    default: false,
  },
  // input类型
  type: {
    type: String,
    default: 'text',
  },
  // 输入框默认内容
  defaultValue: {
    type: String || Number || undefined,
    default: '',
  },
  // 数字类型最小值
  min: {
    type: String || Number || undefined,
    default: undefined,
  },
  // 数字类型最大值
  max: {
    type: String || Number || undefined,
    default: undefined,
  },
});
const emits = defineEmits(['update:value', 'onSaveEditHandle', 'onSetEditHandle']);
const showEdit = ref<boolean>(false);

const handleInput = event => {
  const value = event.target.value;
  if (props.max && value >= Number(props.max)) {
    emits('update:value', props.max);
  } else if (props.min && value <= Number(props.min)) {
    emits('update:value', props.min);
  } else {
    emits('update:value', value);
  }
};

// 开启编辑状态时调用的函数
const setEditHandle = () => {
  emits('onSetEditHandle');
  showEdit.value = true;
};
// 保存编辑内容时调用的函数
const saveEditHandle = () => {
  emits('onSaveEditHandle');
  showEdit.value = false;
};
</script>
