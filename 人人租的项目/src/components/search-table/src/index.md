# SearchTable 搜索表格

带搜索表单的表格

# 何时使用

- 当页面简单简洁只存在搜索项和渲染表格的时候;

# API

<table>
  <tr>
    <th>参数</th>
    <th>说明</th>
    <th>类型</th>
    <th>默认值</th>
  </tr>
  <tr>
    <td>
      <b>searchApi</b>
    </td>
    <td>搜索的api,通常放在services中</td>
    <td>Function()</td>
    <td>-</td>
  </tr>
  <tr>
    <td>
      <b>searchConfig</b>
    </td>
    <td>搜索表单的配置项</td>
    <td>ISearchConfigItem[]</td>
    <td>[]</td>
  </tr>
  <tr>
    <td>
      <b>tbCol</b>
    </td>
    <td>表格列的配置描述</td>
    <td>ITableColumnsItem[]</td>
    <td>[]</td>
  </tr>
  <tr>
    <td>
      <b>pageKey</b>
    </td>
    <td>分页数据,当前页的key</td>
    <td>String</td>
    <td>currentPage</td>
  </tr>
  <tr>
    <td>
      <b>handleParams</b>
    </td>
    <td>自定义处理查询参数</td>
    <td>Function(params)</td>
    <td>undefined</td>
  </tr>
  <tr>
    <td>
      <b>handleResult</b>
    </td>
    <td>自定义处理查询结果</td>
    <td>Function(res)</td>
    <td>undefined</td>
  </tr>
</table>

# slot

```html
<!-- 额外的按钮,searchValue: 搜索参数 -->
<template #formBtns="{searchValue}"></template>
<!-- table表格中需要处理的项,column:表格列, text: 当前数据, record: 当前列的数据 -->
<template #bodyCell="{column, text, record}"></template>
```

## demo

```html
<template>
  <!-- 标准版 -->
  <search-table
    :searchApi="apiGetDemo"
    :searchConfig="searchConfig"
    :tbCol="tbCol"
    />
  <!-- 高级版 -->
  <search-table
    :searchApi="apiGetDemo"
    :searchConfig="searchConfig"
    :tbCol="tbCol"
  >
    <template #formBtns="{searchValue}">
      <a-button :disabled="searchValue.demo" @click="onDemo">Demo</a-button>
    </template>
    <template #bodyCell="{column, text, record}">
      <!-- 这里可以直接套用antd中的table组件的bodyCell -->
      <template v-if="column.dataIndex === 'demo'">
        <a>{{ text }}</a>
      </template>
    </template>
  </search-table>
</template>
<script setup lang="ts">
  import 'apiGetDemo' from './services';
  const searchConfig = [];
  const tbCol = [];
  function onDemo() {
    // ...handle
  }
<script>
```

## 注意事项

- 目前这个组件只支持 input, select, DatePicker 的搜索项, 后期会逐步完善
