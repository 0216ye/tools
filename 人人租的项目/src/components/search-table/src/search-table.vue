<template>
  <div class="search-table-comp">
    <div class="search-form">
      <a-form
        ref="searchFormRef"
        layout="inline"
        :model="searchValue"
      >
        <a-form-item
          v-for="item in props.searchConfig"
          :key="item.key"
          :label="item.label"
          :name="item.key"
        >
          <template v-if="item.renderType === 'input'">
            <a-input
              v-model:value="searchValue[item.key]"
              allow-clear
              :placeholder="item.placeholder || `请输入${item.label}`"
              style="width: 100%"
            />
          </template>
          <template v-else-if="item.renderType === 'select'">
            <a-select
              v-bind="item.renderProps"
              v-model:value="searchValue[item.key]"
              allow-clear
              :options="item.options"
              :placeholder="item.placeholder || `请选择${item.label}`"
              style="width: 100%"
            />
          </template>
          <template v-else-if="item.renderType === 'datePicker'">
            <a-range-picker
              v-model:value="searchValue[item.key]"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </template>
          <!-- 新增 search 类型 date -->
          <template v-else-if="item.renderType === 'date'">
            <a-date-picker
              v-model:value="searchValue[item.key]"
              v-bind="item.renderProps"
              format="YYYY-MM-DD"
              :placeholder="item.placeholder || `请选择${item.label}`"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </template>
        </a-form-item>
        <a-form-item class="form-btns">
          <a-button
            :loading="searchLoading"
            type="primary"
            @click="searchFormData"
          >
            查询
          </a-button>
          <a-button @click="resetForm">
            重置
          </a-button>
          <slot
            name="formBtns"
            :search-value="searchValue"
          />
        </a-form-item>
      </a-form>
    </div>
    <div class="table-data">
      <a-table
        :columns="props.tbCol"
        :data-source="tbData"
        :loading="searchLoading"
        :pagination="tbPage"
        v-bind="props.tbProps"
        @change="tbChange"
      >
        <template #bodyCell="{ column, text, record, index }: any">
          <slot
            :column="column"
            :index="index"
            name="bodyCell"
            :page="tbPage"
            :record="record"
            :text="text"
          >
            {{ text }}
          </slot>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, PropType, reactive, ref } from 'vue';
import { ISearchConfigItem, ITableColumnsItem, ISearchValue } from './data';
import { deepClone } from '@/utils/base';

const props = defineProps({
  searchApi: {
    type: Function as PropType<(params: unknown) => Promise<unknown>>,
    required: true,
  },
  searchConfig: {
    type: Array as PropType<ISearchConfigItem[]>,
    default: [],
  },
  tbCol: {
    type: Array as PropType<ITableColumnsItem[]>,
    default: [],
  },
  tbProps: {
    type: Object as PropType<unknown>,
    default: {},
  },
  pageKey: {
    type: String,
    default: 'currentPage',
  },
  handleParams: {
    type: Function as PropType<(params: ISearchValue) => ISearchValue>,
    default: undefined,
  },
  handleResult: {
    type: Function as PropType<(params: unknown) => unknown>,
    default: undefined,
  },
});

const searchLoading = ref(false);
const searchValue = reactive<ISearchValue>({});
const defaultSearchVal = reactive<ISearchValue>({});
const tbPage = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条记录`,
});

const tbData = ref([]);

function getSearchParams() {
  let params: any = {
    [props.pageKey]: tbPage.current,
    pageSize: tbPage.pageSize,
    ...searchValue,
  };
  // 暂时
  Object.keys(params).forEach(key => {
    params[key] = params[key] || (params[key] === 0 ? 0 : undefined);
  });
  if (props.handleParams) {
    params = props.handleParams(params);
  }
  return params;
}
function defaultHandleResult(result: any) {
  // 处理默认逻辑，如果不是约定参数，报错提醒前端
  try {
    const { list, page, listData, pageData } = result.data;
    // 修改处理: 处理后台返回字段名不同情况
    tbData.value = list ?? listData;
    tbPage.total = page?.totalCount ?? pageData?.count;
  } catch (e) {
    console.error(`ConstraintError: 默认逻辑处理失败，请传入handleResult进行自定义修改.\n${e}`);
  }
}
function getFromData() {
  searchLoading.value = true;
  props
    .searchApi({
      ...getSearchParams(),
    })
    .then((res: any) => {
      props.handleResult ? props.handleResult(res) : defaultHandleResult(res);
    })
    .finally(() => {
      searchLoading.value = false;
    });
}

function searchFormData() {
  tbPage.current = 1;
  getFromData();
}

const searchFormRef = ref();
function resetForm() {
  const defaultVal = deepClone(defaultSearchVal);
  Object.assign(searchValue, defaultVal);
  searchFormData();
}

function tbChange(page: any) {
  const { current, pageSize } = page;
  tbPage.current = current;
  tbPage.pageSize = pageSize;
  getFromData();
}
const defaultValueMap = {
  input: '',
  datePicker: [],
  select: undefined,
};
const renderPropsMap = {
  select: {
    multiple: [],
  },
};
/**
 * 获取配置项的默认值
 * @param {ISearchConfigItem} config - 配置项对象
 * @returns {any} - 默认值
 */
function getConfigDefaultValue(config: ISearchConfigItem): any {
  const { renderType, renderProps, default: defaultValue } = config;
  if (defaultValue) {
    return defaultValue;
  } else if (renderProps) {
    if (renderType === 'select') {
      return renderPropsMap[renderType][renderProps.mode as string];
    }
  }
  return defaultValueMap[renderType];
}
// 生成默认值
function generateDefaultValue(config: ISearchConfigItem[]): any {
  config.forEach(item => {
    searchValue[item.key] = getConfigDefaultValue(item);
    defaultSearchVal[item.key] = getConfigDefaultValue(item);
  });
}
onMounted(() => {
  generateDefaultValue(props.searchConfig);
  searchFormData();
});

defineExpose({
  getFromData,
  searchFormData,
  searchValue,
});
</script>
<style scoped lang="less">
.search-table-comp {
  background-color: #fff;
  .ant-form {
    display: grid;
    grid-gap: 24px;
    margin-bottom: 24px;
    .ant-form-item {
      margin: 0;
    }
    .ant-select {
      min-width: 180px;
    }
    .ant-picker-range {
      min-width: 240px;
    }
  }
  .form-btns {
    .ant-btn {
      margin-right: 8px;
    }
  }
}
.table-data {
  background-color: #fff;
}
/* ≥ 816px */
@media screen and (min-width: 816px) {
  /* 在这里编写适用于屏幕宽度 ≥ 816px 的样式 */
  .ant-form {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* ≥ 1080px */
@media screen and (min-width: 1080px) {
  /* 在这里编写适用于屏幕宽度 ≥ 1080px 的样式 */
  .ant-form {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* ≥ 1440px */
@media screen and (min-width: 1440px) {
  /* 在这里编写适用于屏幕宽度 ≥ 1440px 的样式 */
  .ant-form {
    grid-template-columns: repeat(5, 1fr);
  }
}
</style>
