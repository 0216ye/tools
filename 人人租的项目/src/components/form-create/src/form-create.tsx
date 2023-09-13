import { defineComponent, PropType, ref, watch } from 'vue';
import { FormProps } from 'ant-design-vue';
import { FormGroupItem } from './typing';
import * as formFragment from './form-fragment';

export default defineComponent({
  name: 'form-create',
  props: {
    // 初始化数据
    value: { type: Object, default: () => ({}) },

    // 表单项配置
    formGroup: { type: Array as PropType<Array<FormGroupItem>>, required: true },

    // 开启栅格布局
    grid: { type: Boolean, default: false },
    // 栅格布局中按钮和输入框是否位于同一行
    gripInlineBtn: { type: Boolean, default: false },

    // 用于 v-bind 绑定antdv表单组件props
    originProps: { type: Object as PropType<FormProps>, default: () => ({}) },
  },

  emits: ['update:value'],

  setup(props) {
    const formData = ref({});

    watch(
      () => props.value,
      val => {
        if (val) {
          formData.value = val;
        }
      },
      { immediate: true },
    );

    const formRef = ref(null);
    function getFormRef() {
      return formRef.value;
    }

    return { formData, formRef, getFormRef };
  },

  render() {
    const defaultRender = () => (
      <>
        {this.$props.formGroup.map((item, index) => (
          <>
            {this.$slots[`customer${index}`]?.()}
            {formFragment[item.fragmentKey](item, this.formData)()}
          </>
        ))}
        {this.$slots.buttons && <a-form-item>{this.$slots.buttons()}</a-form-item>}
      </>
    );

    const colspan = {
      // xs: 2,
      // sm: 4,
      md: 8,
      lg: 8,
      xl: 6,
      xxl: 4,
      xxxl: 4,
    };
    const gridLayoutRender = () => (
      <>
        <a-row gutter={{ md: 8, lg: 8, xl: 16, xxxl: 24 }}>
          {this.$props.formGroup.map((item, index) => (
            <>
              {this.$slots[`customer${index}`] && (
                <a-col {...colspan} {...item.colspan} style="padding-left:0;padding-right:24px;">
                  {this.$slots[`customer${index}`]?.()}
                </a-col>
              )}
              <a-col {...colspan} {...item.colspan} style="padding-left:0;padding-right:24px;">
                {formFragment[item.fragmentKey](item, this.formData)()}
              </a-col>
            </>
          ))}
          {/* btn在同一行时插槽位置 */}
          {this.$props.gripInlineBtn && this.$slots.buttons && (
            <a-col style="flex-wrap:wrap;padding-left:0;">{this.$slots.buttons()}</a-col>
          )}
        </a-row>

        {/* btn在不同行时插槽位置 */}
        {!this.$props.gripInlineBtn && this.$slots.buttons && (
          <a-row>
            <a-col span={24} style="text-align: right;">
              {this.$slots.buttons()}
            </a-col>
          </a-row>
        )}
      </>
    );
    return (
      <a-form {...this.$props.originProps} model={this.formData} ref={(ref: any) => (this.formRef = ref)}>
        {this.$props.grid ? gridLayoutRender() : defaultRender()}
      </a-form>
    );
  },
});
