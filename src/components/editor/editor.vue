<template>
  <div
    ref="editor"
    :class="[usedImageLibrary ? 'zindex' : '']"
  />
</template>
<script>
/**
 * 兼容常见的 PC 浏览器：Chrome，Firefox，Safari，Edge，QQ 浏览器，IE11。
 * 文档：http://www.wangeditor.com/doc/
 * 需要先安装依赖 npm install --save wangeditor
 */
import WangEditor from 'wangeditor';
import { formatUrl } from '@/services/format-url';
import ImageLibraryBtn from './components/image-library-btn';

export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    config: {
      type: Object,
      default() {
        return {
          height: 500,
        };
      },
    },
    usedImageLibrary: {
      type: Boolean,
      default: false,
    },
    editDisable: {
      type: Boolean,
      default: false,
    },
    menus: {
      type: Array,
      default: function () {
        return [
          'head',
          'bold',
          'fontSize',
          'fontName',
          'italic',
          'underline',
          'strikeThrough',
          'indent',
          'lineHeight',
          'foreColor',
          'backColor',
          'link',
          'list',
          'justify',
          'quote',
          'emoticon',
          'image',
          'splitLine',
          'undo',
          'redo',
          // 'video',
          // 'table',
          // 'code',
        ];
      },
    },
  },
  emits: ['update:value', 'change', 'blur', 'open-image-library'],
  watch: {
    value: {
      handler(value) {
        if (this.instance && value !== this.instance.txt.html()) {
          this.instance.txt.html(value);
        }
      },
      immediate: true, // 立即以表达式的当前值触发回调
    },
    editDisable: {
      handler(value) {
        if (value) {
          this.instance.disable();
        } else {
          this.instance.enable();
        }
      },
    },
  },
  mounted() {
    this.createEditor();
  },
  // vue2 beforeUnmount 要改成 beforeDestroy
  beforeUnmount() {
    this.instance.destroy();
    this.instance = null;
  },
  methods: {
    createEditor() {
      const instance = new WangEditor(this.$refs.editor);
      Object.assign(
        instance.config,
        {
          onchange: () => {
            const html = instance.txt.html();
            if (this.value !== html) {
              this.$emit('update:value', html);
              this.$emit('change', html);
            }
          },
          onblur: html => {
            this.$emit('blur', html);
          },
          zIndex: 500,
          // 上传图片配置，是针对默认人人租机后台上传图片接口进行的处理
          uploadImgServer: formatUrl({ url: '/common/image?pathName=imageUpload&oss=1' }),
          uploadFileName: 'uploadfile',
          withCredentials: false,
          placeholder: '',
          uploadImgHooks: {
            // 图片上传并返回了结果，想要自己把图片插入到编辑器中
            // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
            // result 即服务端返回的接口，insertImgFn 可把图片插入到编辑器，传入图片 src，执行函数即可
            customInsert: (insertImgFn, result) => {
              if (!result || !result.url) {
                this.$message.error((result && result.msg) || '图片上传出错');
                return;
              }
              insertImgFn(result.imgOssServer + result.url.replace(/\/[s,m]\//, '/o/'));
            },
          },
          menus: this.menus,
        },
        this.config,
      );
      this.extendMenu(instance);

      instance.txt.eventHooks.dropEvents.push(event => {
        event.target.parentNode.insertBefore(dragImage, event.target);
      });
      instance.create();
      instance.txt.html(this.value);
      // 处理使用图片库的图片上传
      instance.openImageLibrary = () => {
        this.$emit('open-image-library');
      };

      const textElem = instance.$textElem.elems[0];
      let dragImage = null;
      textElem.addEventListener('dragstart', event => {
        dragImage = event.target;
      });

      this.instance = instance;
      this.$nextTick(() => {
        if (this.editDisable) {
          this.instance.disable();
        }
      });
    },
    // 扩展菜单。需要在编辑器创建前进行扩展
    extendMenu(instance) {
      if (this.usedImageLibrary) {
        // 去除普通的图片上传按钮
        const imageIndex = instance.config.menus.indexOf('image');
        instance.config.menus.splice(imageIndex, 1);
        // 注册新菜单
        instance.menus.extend('image-library-btn', ImageLibraryBtn);
        instance.config.menus = instance.config.menus.concat('image-library-btn');
      }
    },
    //  往编辑器追加新内容
    append(html) {
      if (!this.instance) {
        return;
      }
      // 会报错，但不影响效果。
      try {
        this.instance.cmd.do('insertHtml', html);
      } catch (e) {}

      // 如果光标插入失效，就改成这个文件末尾插入的
      // this.instance.txt.append(html);
    },
  },
};
</script>
<style scoped>
.zindex {
  z-index: 1000 !important;
}
</style>
