# rrzuji-web

#### 起步

```bash
0.拉取代码
1.npm install
2.husky install
3.npm run vite:dev
```

#### 前端上线流程

1. 开发的分支本地合并 dev 分支
2. 提交开发分支到远程
3. 通知上线人员，发送分支名，审核后上线，**同时上线人员会把这个分支删除**。
4. 收到上线通知后需要线上验收

#### 云效流水线部署

yarn deploy 的效果：

- 在 master 分支执行，无效果。
- 在 develop 分支执行，使用云效 develop 分支打包，并且合并到 master 分支（上线前使用）。
- 在 test 分支 执行，使用云效 test 分支打包，部署到 test-admin-vue.rrzuji.com （开发联调使用）。（一组二组）
- 在 其他分支 执行，使用云效对应分支打包，部署到指定的测试服，例：指定编号为 1，那么会部署到 admin-vue1.rrzuji.net （正式测试时使用）。（admin1.rrzuji.net）

#### vue2 迁移到 vue3

- v-shot 要写在 template 里，例如`<template #title={ text }>{{ text }}</template>`
- v-model 改成 v-model:value 或者 v-model:visible ，看情况
- $set 已丢弃
- a-icon 已丢弃，需要分别引入例如`import { xxx } from '@ant-design/icons-vue'`;
- `>>>`style 深度作用器改为：`::v-deep(.ant-form-item) { color: #000; }`
- 表单 a-form-model 之类的 已丢弃，需要改成`a-form`

#### 相关文档

- 新一代构建工具 https://github.com/vitejs/vite
- vue3 官方文档 https://vue3js.cn/docs/guide/migration/introduction.html
- vuex4 https://github.com/vuejs/vuex/tree/4.0#vuex-4
- vuerouter https://github.com/vuejs/vue-router-next
- jsx https://github.com/vuejs/jsx-next
- jsx 非 vue 定制版 https://zh-hans.reactjs.org/docs/jsx-in-depth.html
- antd vue3 https://2x.antdv.com/
- 组合式 api https://composition-api.vuejs.org/zh/api.html#setup

#### typescript 代码风格规范

- 所有的 interface 起始为 I,而 types 起始为 T
- class 或 组件的 interface 应该包含它的名字
- interface 尽量进行 extends 而不是从零写
- 如果可以的话，尽量将类型分的更细一点
- 使用?:来替代 undefined 类型
- 在 class 中总是使用 private public protected 明确

### 人人租机后台新框架开发注意事项

- 目前使用 iframe 进行嵌入使用，跨域请求和人人租机进行通讯，逐步替换。
- 人人租机 CORS 配置里应该包含改项目测试服域名和正式服域名。
- 使用 eslint 和 stylelintrc 约束代码规范。
- 使用 Typescript 编写代码，获得了更多的类型推断和提示，避免低级错误。
- 人人租机后台中一个菜单入口对应一个 php 视图，视图里放入以下代码完成引入。
- 新的模块改动 iframe 的 baseUrl 参数即可，其它如果没有意外可以不用修改。
- 文件不要命名为 index，如果通过打开太多会很难区分。《为什么文件名要小写 https://www.ruanyifeng.com/blog/2017/02/filename-should-be-lowercase.html 》
- 注意文件名要为 小写加横杆-，其他格式检查会不通过。

#### vite

Vite 是一个由原生 ESM 驱动的 Web 开发构建工具。在开发环境下基于浏览器原生 ES imports 开发，在生产环境下基于 Rollup 打包。vue 作者尤雨溪开发的工具。

- 快速的冷启动
- 即时的模块热更新
- 真正的按需编译

### vscode 插件

需要安装 eslint 和 stylelint 插件。

### 人人租机后台 php 视图

```php
<style>
@import url(/rrzujiFrame/rrzujiFrame.css);
</style>
<div class="frame-wrap">
  <iframe
    frameborder="0"
    id="view"
    scrolling="yes"
    name="rrzuji"
  >
  </iframe>
</div>
<script src="/rrzujiFrame/rrzujiFrame.js"></script>
<script>
  window.rrzujiFrame && window.rrzujiFrame.init({
    baseUrl: '/freight/template/list', // 后端只需要改这个
  });
</script>
```

### 如何开发测试

see [语雀](https://www.yuque.com/oxa3qz/icl0kt/ybagbv).

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### Vue import type

```js
import { Component, Emit, Inject, Model, Prop, Provide, Vue, Watch } from 'vue-property-decorator';
```

### e2e 端对端测试文档

see [e2e 文档](https://docs.cypress.io/zh-cn/guides/overview/why-cypress.html#).

### 提交代码

提交代码前会使用 husky，githook 工具检查代码质量。

### 导入导出前，需要安装 code，code 命令使用前需要执行 cmd + p 然后

```bash
shell commond install code in Path
```

### vscode 扩展导出

```bash
code --list-extensions > vscode-extensions.list
```

### vscode 扩展导入

```bash
cat vscode-extensions.list | xargs -L 1 code --install-extension
```

### package json 去除 e2e 测试加快自动化部署速度

```dotnetcli
"@vue/cli-plugin-e2e-cypress": "^4.4.6"
```

### husky 添加勾子的方法: husky add <hookname> [cmd]

```dotnetcli
npx husky add pre-commit "npm test"
```

### sourcetree husky 无法执行相关命令的处理方法

在 GUI 环境（如 Github Desktop 和 Sourcetree）中可用的$PATH变量与终端中可用的变量不同。默认情况下，GUI环境中可用的$PATH 找不到你的节点模块。例子：进入 .husky/pre-commit，在首行加入命令行 `PATH=$PATH:/usr/local/bin:/usr/local/sbin` 声明环境变量。

### 流水线git浅克隆
git fetch origin master:master --depth=1
git checkout master
git pull origin master --depth=1 --allow-unrelated-histories
git merge develop

