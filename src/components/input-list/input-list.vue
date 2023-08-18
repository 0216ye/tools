<template>
  <div class="input-list">
    <Draggable
      :disabled="!draggable"
      :list="value"
      @change="draggableChange"
    >
      <template v-for="(item, index) in value">
        <div
          v-if="item"
          :key="index + keyName + 'input'"
          :class="[...listWrapClass]"
        >
          <a-input
            v-model:value="item.value"
            :class="['list-input', listClass, item.isNull ? 'error-input' : '']"
            :disabled="disabled"
            :maxlength="maxlength"
            :placeholder="item.placeholder ? item.placeholder : placeholder"
            @blur="
              () => {
                item.value = inputLimit(item.value);
                onFill(item, index);
              }
            "
            @change="
              () => {
                item.isNull = item.value == '';
              }
            "
          >
            <template #suffix>
              <span class="input-tip-text">({{ item.value.length }}/ {{ maxlength }})</span>
            </template>
          </a-input>
          <span @click="onRemove(index)">
            <slot name="clear">
              <a-button
                :disabled="disabled"
                shape="circle"
                size="small"
              >
                <MinusOutlined />
              </a-button>
            </slot>
          </span>
          <slot
            :item="item"
            name="action"
          />
          <transition name="fade">
            <div
              v-if="item.isNull"
              class="error-text"
            >
              该字段不允许为空
            </div>
          </transition>
        </div>
      </template>
    </Draggable>
    <div :class="[...listWrapClass]">
      <a-input
        v-model:value="inputValue"
        :class="[...inputClass, 'list-input']"
        :disabled="disabled"
        :maxlength="maxlength"
        :placeholder="placeholder"
        @blur="
          () => {
            inputValue = inputLimit(inputValue);
            onAdd();
          }
        "
        @press-enter="onAdd()"
      >
        <template #suffix>
          <span class="input-tip-text">({{ inputValue.length }}/ {{ maxlength }})</span>
        </template>
      </a-input>
      <span @click="onAdd()">
        <slot
          :item="addItem"
          name="add"
        >
          <a-button
            :disabled="inputValue === ''"
            shape="circle"
            size="small"
            type="primary"
          >
            <PlusOutlined />
          </a-button>
        </slot>
      </span>
      <slot
        :item="addItem"
        name="action"
        type="add"
      />
    </div>
  </div>
</template>
<script>
import { message } from 'ant-design-vue';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons-vue';
import { inputLimit } from '@/utils/base';
import { VueDraggableNext } from 'vue-draggable-next';
export default {
  components: {
    PlusOutlined,
    MinusOutlined,
    Draggable: VueDraggableNext,
  },
  props: {
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    maxlength: {
      type: [Number, String],
      default: 10,
    },
    inputIcon: {
      type: String,
      default: 'md-return-left',
    },
    inputClass: {
      type: Array,
      default() {
        return [];
      },
    },
    listClass: {
      type: Array,
      default() {
        return [];
      },
    },
    // 输入框外层样式
    listWrapClass: {
      type: Array,
      default() {
        return [];
      },
    },
    placeholder: {
      type: String,
      default: '请输入',
    },
    itemObject: {
      type: Object,
      default() {
        return {};
      },
    },
    keyName: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    check: {
      type: Function,
      default() {
        return () => null;
      },
    },
    // 是否开启排序上下拖拽
    draggable: {
      type: Boolean,
      default: () => false,
    },
  },
  emits: ['change', 'update:value', 'onDraggableChange'],
  data() {
    return {
      inputValue: '', // 输入框的值
      cascaderData: [], // 字典初始值
    };
  },
  computed: {
    addItem() {
      return {
        ...this.itemObject,
        value: this.inputValue,
      };
    },
  },
  methods: {
    inputLimit(value) {
      return inputLimit(value.trim());
    },
    onFill(item, index) {
      // 判断是否为空值
      const inputList = this.value;
      if (item.value === '') {
        item.placeholder = this.placeholder;
      } else {
        // 判断是否重复
        const total = inputList.reduce((total, obj) => {
          return obj.value === item.value ? (total += 1) : total;
        }, 0);
        if (total >= 2) {
          message.warning('已存在相同名称选项');
          inputList[index].value = '';
          inputList[index].isNull = true;
          this.$emit('update:value', inputList);
        }
      }
      this.$emit('change', inputList, {
        index,
        data: item,
        keyName: this.keyName,
        type: 'change',
      });
    },
    onRemove(index, value) {
      if (value) {
        return;
      }
      const inputList = this.value;
      inputList.splice(index, 1);
      this.$emit('update:value', inputList);
      this.$emit('change', inputList, {
        index,
        data: null,
        keyName: this.keyName,
        type: 'remove',
      });
    },
    onAdd() {
      const value = this.inputValue;
      if (!value) {
        return;
      }
      const inputList = this.value;
      if (inputList.some(item => item.value === value)) {
        message.warning('已存在相同名称选项');
        return;
      }
      if (!this.check()) {
        return;
      }
      inputList.push(this.addItem);
      this.$emit('update:value', inputList);
      this.$emit('change', inputList, {
        data: this.addItem,
        keyName: this.keyName,
        type: 'add',
      });
      this.inputValue = '';
    },
    draggableChange(e) {
      console.log('change---', e);
      const { moved } = e;
      const { oldIndex, newIndex } = moved;
      this.$emit('onDraggableChange', { oldIndex, newIndex });
    },
  },
};
</script>
<style lang="less" scoped>
.list-input {
  width: 200px;
  margin-right: 8px;
  margin-bottom: 8px;
}
.error-input {
  border-color: #ff4d4f;
}
.error-input.ant-input-affix-wrapper-focused {
  box-shadow: 0 0 0 2px rgb(255 77 79 / 20%) !important;
}
.anticon {
  vertical-align: middle;
}
.input-tip-text {
  color: rgba(0, 0, 0, 0.25);
}
</style>
