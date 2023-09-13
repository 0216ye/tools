<template>
  <div
    class="img_upload_wrap"
    style="font-size: 0; line-height: 0"
  >
    <a-upload
      accept=".jpg, .jpeg, .png, .gif"
      :class="className"
      :custom-request="uploadAction"
      :disabled="disabled"
      :file-list="fileList"
      :headers="{ 'X-Requested-With': null }"
      list-type="picture-card"
      :multiple="multiple"
      name="uploadfile"
      :show="show"
      :show-upload-list="showUploadList"
      :with-credentials="true"
      @change="handleChange"
      @preview="handlePreview"
    >
      <div v-if="fileList.length < max && !show">
        <PlusOutlined />
        <div class="ant-upload-text">
          {{ uploadText }}
        </div>
      </div>
    </a-upload>
  </div>
</template>
<script>
/* eslint-disable no-param-reassign */
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { generateAndUploadImage2Oss } from '@/utils/oss-helper';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
export default {
  components: {
    PlusOutlined,
  },
  props: {
    // 传入图片列表，支持双向绑定，列表例子 ['aaa.png', 'bbb.png']
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    // action: {
    //   type: String,
    //   required: true,
    // },
    action: {
      type: String,
      default: 'site',
    },
    max: {
      type: [Number, String],
      default: 5,
    },
    pathName: {
      type: String,
      default: 'imageUpload',
    },
    className: {
      type: String,
      default: '',
    },
    uploadText: {
      type: String,
      default: '上传图片',
    },
    onError: {
      type: Function,
      default: res => {
        // 人人组件接口错误是msg
        message.warning(res.msg || '抱歉，上传时发生未知错误，请重试');
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    show: {
      type: Boolean,
      default: false,
    },
    showUploadList: {
      type: Boolean,
      default: true,
    },
    // 图片质量，为空的话 默认为m
    // 只有三种类型 o m s
    quality: {
      type: String,
      default: '',
    },
    isDelCaptureAttr: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['change', 'update:value'],
  data() {
    return {
      fileList: [],
      path: [],
    };
  },
  watch: {
    value: {
      handler(value, oldVal) {
        if (JSON.stringify(value) === JSON.stringify(oldVal)) return;
        this.fileList = !value
          ? []
          : value.map((url, index) => ({
              url,
              status: 'done',
              uid: index,
              name: url,
              path: this.path[index],
            }));
      },
      immediate: true, // 立即以表达式的当前值触发回调
    },
  },
  mounted() {
    // 删除input上的capture属性
    if (this.isDelCaptureAttr) {
      const el = document.querySelector('.img_upload_wrap #form_item_cover');
      el.removeAttribute('capture');
    }
  },
  methods: {
    /**
     *  自定义上传方法
     */
    async uploadAction(options) {
      try {
        // 阿里云压缩上传
        const res = await generateAndUploadImage2Oss(
          options.file,
          {
            progress: percent => options.onProgress({ percent: percent * 100 }),
          },
          this.action,
        );
        options.onSuccess({
          domain: '',
          imageUrls: { m: res.m, o: res.o, s: res.s },
          imgOssServer: res.oss,
          status: 1,
          url: res.mPath,
        });
      } catch (error) {
        // this.onError({ msg: '图片数据可能有问题,请选择其他图片', status: 0 });
        options.onError('图片数据可能有问题,请选择其他图片');
      }
    },
    handleCancel() {
      this.previewVisible = false;
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      const previewImage = this.fileList.map(item => item.url);
      this.$preview.open({
        imgs: previewImage,
        index: previewImage.indexOf(file.url || file.preview),
      });
    },
    handleChange({ file, fileList }) {
      // status: 'done', // 状态有：uploading done error removed
      this.fileList = fileList;
      const list = [];
      // 保留图片上传后端返回的原始路径（即不带域名的路径）
      const path = [];
      fileList.forEach(item => {
        if (item.status === 'done') {
          if (this.quality && item.response && item.response.imageUrls) {
            // 有要求图片质量
            path.push(item.response.url);
            list.push(item.response.imageUrls[this.quality]);
          } else if (item.response && item.response.url) {
            path.push(item.response.url);
            list.push(`${item.response.imgOssServer || ''}${item.response.url}`);
          } else if (item.url) {
            path.push(item.path);
            list.push(item.url);
          } else {
            // 捕获服务器返回的提示错误
            this.onError(item.response || {});
          }
        }
      });
      this.path = path;
      if (file.status !== 'uploading') {
        this.$emit('update:value', list);
        this.$emit('change', list, fileList, path);
      }
      if (file.status === 'error') {
        message.warning(file.error || '抱歉，上传时发生未知错误，请重试');
      }
    },
  },
};
</script>
<style lang="less" scoped>
.ant-upload-select-picture-card i {
  color: #999;
  font-size: 32px;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.ant-upload {
  margin-bottom: 0;
}
</style>
