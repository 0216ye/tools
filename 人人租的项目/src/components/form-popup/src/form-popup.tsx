import { defineComponent, PropType, ref } from 'vue';
import { message, ModalProps } from 'ant-design-vue';

export default defineComponent({
  name: 'form-popup',
  props: {
    // 弹窗显示隐藏
    visible: { type: Boolean },

    // 一般异步操作需要submit loading
    loading: { type: Boolean },

    // form-create所需props
    form: { type: Object, required: true },

    // a-modal原始props
    originProps: { type: Object as PropType<ModalProps>, default: () => ({}) },

    // 表单验证错误信息
    errorText: { type: String, default: '' },
  },
  emits: ['update:visible', 'update:loading', 'submit'],
  setup(props, { emit }) {
    const formCreateRef = ref();

    async function submit() {
      emit('update:loading', true);
      const formRefValue = formCreateRef.value.getFormRef();
      try {
        await formRefValue.validateFields();
        emit('submit');
      } catch {
        message.error(props.errorText || '请正确填写表单信息！');
        emit('update:loading', false);
      }
    }

    function cancel() {
      emit('update:visible', false);
    }

    return {
      formCreateRef,
      submit,
      cancel,
    };
  },
  render() {
    return (
      <a-modal
        {...this.$props.originProps}
        visible={this.$props.visible}
        confirmLoading={this.$props.loading}
        onOk={this.submit}
        onCancel={this.cancel}
      >
        {this.$slots.topTip?.()}
        <form-create {...this.$props.form} ref={(ref: any) => (this.formCreateRef = ref)} />
        {this.$slots.bottomTip?.()}
      </a-modal>
    );
  },
});
