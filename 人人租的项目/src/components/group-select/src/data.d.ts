export interface IOptionType {
  label?: string;
  value?: number | string;
  disabled?: boolean;
  children?: IOptionType[];
}
