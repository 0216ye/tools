### 2021-02-25 created by lizhibin

### 安装以下插件

- EditorConfig (vscode 编辑器配置)
- Prettier ESLint (格式化代码&按照规范格式化代码)
- ESLint (代码规范 Javascript)
- Stylelint (代码规范 css)

### 配置 vscode 工作区配置

1. 打开项目根目录 .vscode/settings.json 文件，清空里面内容。如果没有这个文件自行新建。
2. 将以下配置贴进去，该配置只会影响当前的项目。

tips：这个配置，可以格式化本项目各种代码文档。

```JSON

{
  "editor.tabSize": 2, // tab两个空格
  "files.trimTrailingWhitespace": true, // 自动去除多余空格
  "eslint.alwaysShowStatus": true, // 显示异常信息
  "editor.formatOnSave": true, // 保存时自动格式化
  "editor.formatOnPaste": false, // 粘贴时自动格式化
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.fixAll.stylelint": true
  },
  "editor.defaultFormatter": "rvest.vs-code-prettier-eslint",
  "[markdown]": {
    "editor.defaultFormatter": "rvest.vs-code-prettier-eslint"
  },
  "[json]": {
    "editor.defaultFormatter": "rvest.vs-code-prettier-eslint"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "rvest.vs-code-prettier-eslint"
  },
  "[yml]": {
    "editor.defaultFormatter": "rvest.vs-code-prettier-eslint"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "rvest.vs-code-prettier-eslint"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "rvest.vs-code-prettier-eslint"
  },
  "[typescript]": {
    "editor.defaultFormatter": "rvest.vs-code-prettier-eslint"
  },
  "[javascript]": {
    "editor.defaultFormatter": "rvest.vs-code-prettier-eslint"
  },
  "[html]": {
    "editor.defaultFormatter": "rvest.vs-code-prettier-eslint"
  },
  "[vue]": {
    "editor.defaultFormatter": "rvest.vs-code-prettier-eslint"
  },
  "[css]": {
    "editor.defaultFormatter": "rvest.vs-code-prettier-eslint"
  },
  "[less]": {
    "editor.defaultFormatter": "rvest.vs-code-prettier-eslint"
  },
  "[scss]": {
    "editor.defaultFormatter": "rvest.vs-code-prettier-eslint"
  },
  "vetur.validation.template": false, // 关闭vetur的模版校验
  "eslint.validate": ["javascript", "javascriptreact", "vue", "html"], // eslint校验的范围
  "html.validate.styles": false, // vscode配置，关闭style校验防止在查看小程序**ml文件时出错
  "files.associations": {
    "*.axml": "html",
    "*.wxml": "html",
    "*.ttml": "html",
    "*.acss": "css",
    "*.wxss": "css",
    "*.ttss": "css"
  }
}


```
