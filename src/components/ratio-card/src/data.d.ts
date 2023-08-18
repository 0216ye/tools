export interface IRatioValue {
  title: string;
  value: string | number;
  ratio: string;
  trend: 'up' | 'down';
  key: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  prevIcon?: '￥' | (string & {});
  // eslint-disable-next-line @typescript-eslint/ban-types
  nextIcon?: '元' | (string & {});
  desc?: string;
}

export interface IConfigItem {
  [key: string]: {
    num: number;
    ratio: number;
  };
}
