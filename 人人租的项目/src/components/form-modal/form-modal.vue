import { GET } from "@/*";
<template>
  <a-modal
    :confirm-loading="loading"
    :mask-closable="false"
    :title="title"
    :visible="visible"
    :width="width"
    v-bind="extraModal"
    @cancel="onCancel"
    @ok="onOk"
  >
    <form-extend
      ref="form"
      :form-group="form"
      :label-col="labelCol"
      :layout="layout"
      :wrapper-col="wrapperCol"
      @change="onChange"
      @checkbox-change="checkboxChange"
      @radio-change="radioChange"
    >
      <template #content>
        <slot name="content" />
      </template>
    </form-extend>
  </a-modal>
</template>
<script>
/**
 * 接受父组件的表单配置，提交url，自动处理一些简单的数据提交工作
 */
import { POST, GET } from '@/services/api';

export default {
  props: {
    // 双向绑定
    visible: {
      type: Boolean,
      default: false,
    },
    // 双向绑定
    loading: {
      type: Boolean,
      default: false,
    },
    form: {
      type: Array,
      default() {
        return [];
      },
    },
    title: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
    width: {
      type: Number,
      default: 800,
    },
    labelCol: {
      type: Object,
      default() {
        return {
          span: 4,
        };
      },
    },
    wrapperCol: {
      type: Object,
      default() {
        return {
          span: 18,
        };
      },
    },
    extraPost: {
      type: Object,
      default() {
        return {};
      },
    },
    extraQuery: {
      type: Object,
      default() {
        return {};
      },
    },
    autoClose: {
      type: Boolean,
      default: true,
    },
    asyncData: {
      type: String,
      default: '',
    },
    layout: {
      type: String,
      default: 'horizontal',
    },
    // 扩展底部按钮文字自定义
    extraModal: {
      type: Object,
      default: () => ({
        okText: '确认',
        cancelText: '取消',
      }),
    },
    // tip: 卢韩国-扩展参数格式
    isGetType: {
      type: Boolean,
      default: false,
    },
    queryParams: {
      type: Array,
      default: () => [],
    },
  },
  emits: [
    'update:visible',
    'update:loading',
    'on-success',
    'on-validate',
    'radio-change',
    'on-change',
    'checkbox-change',
  ],
  methods: {
    //  tip: 卢韩国: 扩展修改, 满足地址栏参数
    async getSubmit(form) {
      this.$emit('update:loading', true);
      const queryParams = {};
      if (this.queryParams.length) {
        for (const key of this.queryParams) {
          queryParams[key] = form[key];
        }
      }
      try {
        const res = await GET(this.url, {
          ...this.extraQuery,
          ...queryParams,
        });
        this.$emit('on-success', form, res);
        this.close();
      } catch (err) {
        console.log(err, 'err');
        this.$emit('update:loading', false);
      }
    },
    submit(form) {
      this.$emit('update:loading', true);
      return POST(
        this.url,
        { ...this.extraPost, ...form },
        {
          params: this.extraQuery,
        },
      )
        .then(() => {
          // 提交成功后，再返回输入值
          this.$emit('on-success', form);
          this.close();
        })
        .catch(err => {
          console.log(err, 'err');
          this.$emit('update:loading', false);
        });
    },
    getAsyncAddItem(form) {
      this.$emit('update:loading', true);
      GET(this.asyncData, {
        hash: form.hash,
      })
        .then(res => {
          this.$emit('on-validate', res.data);
          this.close();
        })
        .catch(() => {
          this.$emit('update:loading', false);
        });
    },
    onOk() {
      return this.$refs.form
        .submit()
        .then(form => {
          // 校验ok
          // tip: 卢韩国-当前请求类型不为 get
          if (this.url && !this.isGetType) {
            // 需要先提交，再展示；
            return this.submit(form);
          } else if (this.asyncData) {
            // 需要展示的数据，要先通过填写表单内容异步请求回来得到；
            return this.getAsyncAddItem(form);
          } else if (this.isGetType) {
            return this.getSubmit(form);
          } else {
            // 普通表单填写
            this.$emit('on-validate', form);
            // 正常情况，验证结束后会自动关闭
            if (this.autoClose) {
              this.close();
            }
          }
          return Promise.resolve(form);
        })
        .catch(err => {
          this.$message.warning(err.toString());
          return Promise.reject(err);
        });
    },
    onCancel() {
      this.close();
    },
    onChange(val) {
      this.$emit('on-change', val);
    },
    checkboxChange(val) {
      this.$emit('checkbox-change', val);
    },
    radioChange(val) {
      this.$emit('radio-change', val);
    },
    close() {
      this.$emit('update:visible', false);
      this.$emit('update:loading', false);
    },
  },
};
</script>
