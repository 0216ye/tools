/**
 * 各种属性的表单项
 * renderInput -> input
 * renderSelect -> select
 * renderDatePicker -> DataPicker
 * renderMonthPicker -> MonthPicker
 * renderRangePicker -> RangePicker
 *
 * renderCheckbox -> checkbox
 * renderRadio -> radio
 */

import { SelectProps } from 'ant-design-vue/lib/vc-select';
import { FormGroupItem } from './typing';

export const renderInput = <T,>(config: FormGroupItem, modelData: T) => {
  return () => (
    <a-form-item {...config.originProps}>
      <a-input {...config.elProps} vModel={[modelData[config.key], 'value']} />
    </a-form-item>
  );
};

export const renderInputNumber = <T,>(config: FormGroupItem, modelData: T) => {
  return () => (
    <a-form-item {...config.originProps}>
      <a-input-number {...config.elProps} vModel={[modelData[config.key], 'value']} />
    </a-form-item>
  );
};

export const renderSelect = <T,>(config: FormGroupItem<SelectProps>, modelData: T) => {
  return () => (
    <a-form-item {...config.originProps}>
      <state-select config={config} vModel={[modelData[config.key], 'value']} />
    </a-form-item>
  );
};

export const renderMonthPicker = <T,>(config: FormGroupItem, modelData: T) => {
  return () => (
    <a-form-item {...config.originProps}>
      <a-month-picker {...config.elProps} vModel={[modelData[config.key], 'value']} />
    </a-form-item>
  );
};

export const renderDatePicker = <T,>(config: FormGroupItem, modelData: T) => {
  return () => (
    <a-form-item {...config.originProps}>
      <a-date-picker {...config.elProps} vModel={[modelData[config.key], 'value']} />
    </a-form-item>
  );
};

export const renderRangePicker = <T,>(config: FormGroupItem, modelData: T) => {
  return () => (
    <a-form-item {...config.originProps}>
      <a-range-picker {...config.elProps} vModel={[modelData[config.key], 'value']} />
    </a-form-item>
  );
};

export const renderCheckbox = <T,>(config: FormGroupItem, modelData: T) => {
  return () => (
    <a-form-item {...config.originProps}>
      <a-checkbox-group {...config.elProps} vModel={[modelData[config.key], 'value']} />
    </a-form-item>
  );
};

export const renderRadio = <T,>(config: FormGroupItem, modelData: T) => {
  return () => (
    <a-form-item {...config.originProps}>
      <a-radio-group {...config.elProps} vModel={[modelData[config.key], 'value']}>
        {config.options?.map(item => (
          <a-radio-button {...item}>{item.label}</a-radio-button>
        ))}
      </a-radio-group>
    </a-form-item>
  );
};

export const renderSwitch = <T,>(config: FormGroupItem, modelData: T) => {
  return () => (
    <a-form-item {...config.originProps}>
      <a-switch {...config.elProps} vModel={[modelData[config.key], 'checked']} />
    </a-form-item>
  );
};

export const renderCascader = <T,>(config: FormGroupItem, modelData: T) => {
  return () => (
    <a-form-item {...config.originProps}>
      <state-cascader config={config} vModel={[modelData[config.key], 'value']} />
    </a-form-item>
  );
};

export const renderSelectAndInput = <T,>(config: FormGroupItem, modelData: T) => {
  return () => (
    <a-form-item {...config.originProps}>
      <div class="flex-wrap key-word-item">
        <state-select config={config['selectConfig']} vModel={[modelData[config.key['select']], 'value']} />
        <a-form-item name={config.key['input']} style="flex:1; padding: 0;margin-bottom: 0">
          <a-input {...config.elProps} vModel={[modelData[config.key['input']], 'value']} />
        </a-form-item>
      </div>
    </a-form-item>
  );
};
