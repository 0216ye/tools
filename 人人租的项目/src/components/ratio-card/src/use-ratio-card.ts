import { IRatioValue, IConfigItem } from './data';
export function useRatioCard() {
  function handleRatioCardData(config: IRatioValue[], data: IConfigItem): IRatioValue[] {
    return config.map(item => {
      const { num, ratio } = data[item.key];
      item.value = num;
      item.ratio = String(Math.abs(ratio));
      item.trend = ratio >= 0 ? 'up' : 'down';
      return item;
    });
  }
  return {
    handleRatioCardData,
  };
}
