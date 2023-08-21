/**
 * 按照区间生成随机数
 *
 * example: getRoundNumber(5, 15, 3)
 * return: [9, 6, 13]
 *
 * example: getRoundNumber(6, 20, 1)
 * return: 10
 *
 * @param {number} min 最小值 默认值 0
 * @param {number} max 最大值 默认值 1
 * @param {number} number 要生成几个随机数，默认生成1个
 * @returns {number|array} 生成的随机数 [min, max] 左闭右闭区间
 */
export const getRoundNumber = (min = 0, max = 1, number = 1) => {
  const tempMin = Math.ceil(min);
  const tempMax = Math.floor(max);
  const result = [];

  for (let i = 0; i < number; i++) {
    result.push(Math.floor(Math.random() * (tempMax - tempMin + 1)) + tempMin);
  }

  return number === 1 ? result[0] : result;
};

/**
 * 格式化价格(每隔3位一个逗号)
 *
 * example: formatPrice(123456789)
 * return: '123,456,789'
 *
 * example: formatPrice(123456789, true)
 * return: '123,456,789.00'
 *
 * example: formatPrice(123456789.00, true)
 * return: '123,456,789.00'
 *
 * example: formatPrice(123456789.00)
 * return: '123,456,789.00'
 *
 * example: formatPrice(123456789.8)
 * return: '123,456,789.80'
 *
 * @param {number} price 价格
 * @param {boolean} decimal 是否需要小点两位; 如果价格已是小数，则此参数无效
 * @returns {string} 被格式化后的价格,例如 '123,456,789.00'
 */
export const formatPrice = (price: number, decimal = false): string => {
  const regExp = /\B(?=(\d{3})+(?!\d))/g;

  if (decimal || price.toString().includes('.')) {
    return price.toFixed(2).toString().replace(regExp, ',');
  }

  return price.toString().replace(regExp, ',');
};

/**
 * 加法函数，用来得到精确的加法结果
 * @param {Object} arg1
 * @param {Object} arg2
 */
export function accAdd(arg1 = 0, arg2 = 0) {
  const r1 = deal(arg1);
  const r2 = deal(arg2);
  const m = Math.pow(10, Math.max(r1, r2));
  return (arg1 * m + arg2 * m) / m;
}

/**
 * 加法函数，用来得到精确的加法结果
 * @param {Object} arg1
 * @param {Object} arg2
 */
export function accMin(arg1 = 0, arg2 = 0) {
  const r1 = deal(arg1);
  const r2 = deal(arg2);
  const m = Math.pow(10, Math.max(r1, r2));
  return (arg1 * m - arg2 * m) / m;
}

/**
 * 乘法函数，用来得到精确的乘法结果
 * @param {Object} arg1
 * @param {Object} arg2
 */
export function accMul(arg1 = 0, arg2 = 0) {
  let m = 0;
  m += deal(arg1);
  m += deal(arg2);
  const r1 = Number(arg1.toString().replace('.', ''));
  const r2 = Number(arg2.toString().replace('.', ''));
  return (r1 * r2) / Math.pow(10, m);
}

/**
 * 除法函数，用来得到精确的除法结果
 * @param {Object} arg1
 * @param {Object} arg2
 */
export function accDiv(arg1 = 0, arg2 = 0) {
  const t1 = deal(arg1);
  const t2 = deal(arg2);
  const r1 = Number(arg1.toString().replace('.', ''));
  const r2 = Number(arg2.toString().replace('.', ''));
  return (r1 / r2) * Math.pow(10, t2 - t1);
}

/**
 * 求小数点后的数据长度
 */
export function deal(arg = 0) {
  let t = 0;
  try {
    t = arg.toString().split('.')[1].length;
  } catch (e) {}
  return t;
}
