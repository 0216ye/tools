import { withInstall } from '@/utils';
import FormCreateComp from './src/form-create';
import StateSelectComp from './src/state-select';
import StateCascaderComp from './src/state-cascader';

export const FormCreate = withInstall(FormCreateComp);
export const StateSelect = withInstall(StateSelectComp);
export const StateCascader = withInstall(StateCascaderComp);
