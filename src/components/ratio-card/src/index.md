# RatioCard 环比卡片

环比数据看版卡片

# 何时使用

- 当统计页面数据看版需要带环比的时候

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
      <b>value</b>
    </td>
    <td>需要展示的数据</td>
    <td>Object[IRatioValue]</td>
    <td>-</td>
  </tr>
</table>

### 数据类型

- ##### IRatioValue

  <table>
    <tr>
      <th>参数</th>
      <th>说明</th>
      <th>类型</th>
      <th>默认值</th>
    </tr>
    <tr>
      <td>
        <b>title</b>
      </td>
      <td>标题</td>
      <td>string</td>
      <td>-</td>
    </tr>
    <tr>
      <td>
        <b>value</b>
      </td>
      <td>标题对应的数据</td>
      <td>string || number </td>
      <td>-</td>
    </tr>
      <tr>
      <td>
        <b>key</b>
      </td>
      <td>key</td>
      <td>'up' | 'down' </td>
      <td>up</td>
    </tr>
    <tr>
      <td>
        <b>ratio</b>
      </td>
      <td>环比数据</td>
      <td>string</td>
      <td>-</td>
    </tr>
    <tr>
      <td>
        <b>trend</b>
      </td>
      <td>环比上升/下降的标识</td>
      <td>'up' | 'down' </td>
      <td>up</td>
    </tr>

    <tr>
      <td>
        <b>prevIcon</b>
      </td>
      <td>value前置icon</td>
      <td>string(可选)</td>
      <td>-</td>
    </tr>
    <tr>
      <td>
        <b>desc</b>
      </td>
      <td>描述</td>
      <td>string(可选)</td>
      <td>-</td>
    </tr>
  </table>

# slot

- 暂无

## demo

```html
<template>
  <!-- 标准版 -->
  <ratio-card
    :value="value"
  />
</template>
<script setup lang="ts">
  import 'apiGetDemo' from './services';
  const value = {
    title: 'title',
    value: 'value',
    ratio: 'ratio',
    trend: 'up',
    key: 'key',
  }
<script>
```

## 注意事项

- 暂无
