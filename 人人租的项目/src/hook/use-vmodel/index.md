---
category: Component
---

# useVModel

Shorthand for v-model binding, props + emit -> ref

## Usage

```js
import { useVModel } from '@/hook';

export default {
  setup(props, { emit }) {
    const data = useVModel(props, 'data', emit);

    console.log(data.value); // props.data
    data.value = 'foo'; // emit('update:data', 'foo')
  },
};
```

### `<script setup>`

```vue
<script lang="ts" setup>
import { useVModel } from '@/hook';

const props = defineProps<{
  modelValue: string;
}>();
const emit = defineEmits(['update:modelValue']);

const data = useVModel(props, 'modelValue', emit);
</script>
```

### example

> useVModel 配合 props 的 ts 类型配合 key 可以自动推导类型
>
> 当父组件提供给子组件的值是一个对象时，子组件使用 v-model 绑定的值是对象中的属性，这时候需要在父组件使用 ref 声明这个对象

```vue
<!-- 父组件 -->
<template>
  <my-modal v-model:visible="myModalVisible" />
  <my-form v-model:value="myFormData" />
</template>
<script lang="ts" setup>
// import .... 引入组件及依赖
const myModalVisible = ref(false);
// 注意当某个对象在子组件需要使用v-model绑定值的时候，父组件使用ref声明这个对象
const myTableData = ref({
  id: '',
});
</script>
```

```vue
<!-- 父组件 -->
<template>
  <my-modal v-model:visible="myModalVisible" />
  <my-form v-model:value="myFormData" />
</template>
<script lang="ts" setup>
// import .... 引入组件及依赖
const myModalVisible = ref(false);
// 注意当某个对象在子组件需要使用v-model绑定值的时候，父组件使用ref声明这个对象
const myTableData = ref({});
</script>
```

```vue
<!-- 子组件:my-modal -->
<template>
  <a-modal v-model:visible="visible"></a-modal>
</template>
<script lang="ts" setup>
import { useVModel } from '@/hook';

const props = defineProps<{
  visible: boolean;
}>();
const emit = defineEmits(['update:visible']);
// 自动推导类型boolean
const visible = useVModel(props, 'visible', emit);
</script>
```

```vue
<!-- 子组件:my-form -->
<template>
  <a-form>
    <a-form-item name="id">
      <a-input v-model:value="form.id" />
    </a-form-item>
  </a-form>
</template>
<script lang="ts" setup>
import { useVModel } from '@/hook';

const props = defineProps<{
  value: { id: string };
}>();
const emit = defineEmits(['update:value']);
// 自动推导类型{ id: string };
// form.value.id
const form = useVModel(props, 'value', emit);
</script>
```
