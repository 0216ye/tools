/**
 * 防抖函数
 * @param func
 * @param wait
 * @param immediate
 * @param self
 * @returns
 */
export function debounce(func: (...args: any[]) => any, wait: number, immediate = false, self?: any) {
  let timeout: any = null;
  let isImmediate = false;
  return function (...args: any) {
    if (timeout) {
      clearTimeout(timeout);
    }
    return new Promise(resolve => {
      if (immediate && timeout === null) {
        resolve(func.call(self, ...args));
        isImmediate = true;
      }
      timeout = setTimeout(() => {
        !isImmediate && resolve(func.call(self, ...args));
        timeout = null;
        isImmediate = false;
      }, wait);
    });
  };
}

/**
 * 节流函数
 * @param func
 * @param mustRun
 * @param context
 * @returns
 */
export function throttle(func: (...args: any[]) => any, mustRun: number, context?: any) {
  let timeout: any = null;
  return (...args: any) => {
    if (timeout) {
      return;
    }
    timeout = setTimeout(() => {
      func.apply(context, args);
      timeout = null;
    }, mustRun);
  };
}

/**
 * 生成随机字符串
 * @param len
 * @returns
 */
export function randomString(len = 20): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const maxPos = chars.length;
  let res = '';
  for (let i = 0; i < len; i++) {
    res += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return res;
}

/**
 * 获取后缀
 * @param fileName
 * @param transImageToJpg
 * @returns
 */
export function getSuffix(fileName: string, transImageToJpg?: boolean): string {
  const strSplit = fileName.split('.');
  let suffix = '';
  if (strSplit) {
    suffix = strSplit[strSplit.length - 1];
    if (suffix === 'image' && transImageToJpg) {
      suffix = 'jpg';
    }
  }
  return suffix;
}

/**
 * 金额分割
 * @param money
 * @returns
 */
export function moneySplit(money: number | string) {
  if (typeof money === 'number') {
    money = money.toFixed(2);
  }
  const res = money.split('.');
  if (!res[1]) {
    res[1] = '00';
  }
  return {
    res,
    num: `${res[0]}.${res[1]}}`,
  };
}

/**
 * 日转月
 * @param value
 * @returns
 */
export function conversionMonth(value: number) {
  return Math.floor(value / 30);
}

export function sleep(delay: number) {
  return new Promise(resolve => setTimeout(resolve, delay));
}
