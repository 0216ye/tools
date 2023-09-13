<template>
  <div
    class="outer-wrapper"
    :style="{
      width: typeof width === 'string' ? width : width + 'px',
    }"
  >
    <div
      v-if="valArr.length"
      class="tag-wrapper"
    >
      <a-tag
        v-for="(item, index) in valArr"
        :key="index"
        :class="['val-tag', { 'red-text': errorDataSet.has(item) }]"
      >
        {{ item }}
        <close-outlined
          v-if="!disabled"
          class="close"
          :style="{ fontSize: '0.8em', color: 'rgba(0, 0, 0, 0.45)', marginLeft: '7px' }"
          @click="delValArr(index)"
        />
      </a-tag>
    </div>
    <a-input
      v-model:value="inputVal"
      :bordered="false"
      :disabled="disabled"
      :placeholder="placeholder"
      :type="type"
      @blur="onBlur"
      @change="onInputChange"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, watch } from 'vue';
import { debounce } from '@/utils/base';
import { CloseOutlined } from '@ant-design/icons-vue';
import { computed } from '@vue/reactivity';

export default defineComponent({
  components: {
    CloseOutlined,
  },
  props: {
    placeholder: {
      type: String,
      default: '',
    },
    width: {
      type: [String, Number],
      default: 480,
    },
    value: {
      type: String,
      default: '',
    },
    joinWord: {
      type: String,
      default: ',',
    },
    type: {
      type: String,
      default: 'string',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    errorData: {
      type: Array, //错误列表，错的展示为红色
      default: [],
    },
  },
  emits: ['update:value', 'inputChange'],
  setup(props, { emit }) {
    const inputVal = ref('');
    const valArr: Ref<string[]> = ref([]);

    // 根据传入value设置数组
    watch(
      () => props.value,
      (val: string) => {
        valArr.value = val ? val.split(props.joinWord) : [];
      },
      {
        immediate: true,
      },
    );

    const updateValueHandle = () => {
      const value = valArr.value.join(props.joinWord);
      emit('inputChange');
      emit('update:value', value);
    };

    const setValArr = debounce(() => {
      if (!inputVal.value) return;
      if (inputVal.value.indexOf(' ') != -1) {
        valArr.value.push(...inputVal.value.split(' ').filter(o => o));
        inputVal.value = '';
        updateValueHandle();
      } else if (inputVal.value.indexOf(',') != -1) {
        valArr.value.push(...inputVal.value.split(',').filter(o => o));
        inputVal.value = '';
        updateValueHandle();
      }
    }, 200);
    // 处理输入
    const onInputChange = () => {
      setValArr();
    };
    const onBlur = () => {
      if (!inputVal.value) return;
      valArr.value.push(inputVal.value);
      inputVal.value = '';
      updateValueHandle();
    };
    // 删除数组元素
    const delValArr = (index: number) => {
      valArr.value.splice(index, 1);
      updateValueHandle();
    };

    const errorDataSet = computed(() => {
      return new Set(props.errorData);
    });
    return {
      inputVal,
      valArr,
      onInputChange,
      onBlur,
      delValArr,
      errorDataSet,
    };
  },
});
</script>

<style lang="less" scoped>
.outer-wrapper {
  width: 480px;
  border: 1px solid rgb(217, 217, 217);
  border-radius: 4px;
}

.tag-wrapper {
  margin-top: 8px;
  padding: 0 11px;
}

.val-tag {
  margin-bottom: 4px;
}
.red-text {
  color: red;
}
</style>
