import { message } from 'ant-design-vue';
/**
 * 对象遍历。用法：for (const [key, value] in objectEntries(target)) { ... }
 * 功能同：obj[Symbol.iterator] = objectEntries。
 * @param obj
 */
export const objectEntries = function* (obj: any) {
  const propKeys = Reflect.ownKeys(obj);
  for (const propKey in propKeys) {
    yield [propKey, propKeys[propKey]];
  }
};

/**
 * 防抖
 * @param func
 * @param wait
 */
export const debounce = function (func: (...args: any) => any, wait: undefined | number) {
  let timeout: NodeJS.Timeout;
  return (...args: any) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

/**
 * 节流函数
 */
export function waterTap(func: (iArguments: IArguments) => any, delay: number, self?: any) {
  let prev = 0;
  return function (...args: any) {
    if (Date.now() - prev >= delay) {
      func.apply(self, args);
      prev = Date.now();
    }
  };
}

/**
 * 拷贝
 * @param obj
 */
export const deepCopy = (obj: any) => {
  const newObj: any = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    newObj[key] = typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key];
  }
  return newObj;
};

/**
 * 将字节转成合适的单位
 * @param size
 */
export const forMatterByte = (size: number) => {
  if (!size) return '0';
  let str = '';
  const num = 1024.0; // byte
  if (size < num) str = `${size}B`;
  else if (size < num ** 2) str = `${(size / num).toFixed(2)}KB`;
  // kb
  else if (size < num ** 3) str = `${(size / num ** 2).toFixed(2)}MB`;
  // M
  else if (size < num ** 4) str = `${(size / num ** 3).toFixed(2)}G`; // G
  return str;
};

/**
 * 加载script文件
 * @param src
 * @param checkFunc
 */
export const loadScript = (src: string, checkFunc: () => boolean) => {
  return new Promise(resolve => {
    if (checkFunc()) {
      resolve('ok');
    } else {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = src;
      const head = document.querySelector('head');
      if (head) {
        head.appendChild(script);
      }
      script.onload = () => {
        if (checkFunc()) {
          resolve('ok');
        } else {
          console.error(`加载${src}失败,请检查您的配置地址URL填写是否正确!`);
        }
      };
    }
  });
};

/**
 * 限制只能输入中文，英文，数字和常见字符
 * @param str
 */
export const inputLimit = (str: string) => {
  return str.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\ \(\)\（\）\~\.\,\?\<\>\。\，\-\——\=\;\@\！\!\+\$]/g, '');
};

/**
 * 深拷贝
 * @param origin
 * @param hashmap
 */
export function deepClone(origin: any, hashmap = new WeakMap()) {
  if (origin == undefined || typeof origin !== 'object') {
    return origin;
  }
  if (origin instanceof Date) {
    return new Date(origin);
  }
  if (origin instanceof RegExp) {
    return new RegExp(origin);
  }
  const hashKey = hashmap.get(origin);
  if (hashKey) {
    return hashKey;
  }
  const target = new origin.constructor();
  hashmap.set(origin, target);
  for (const k in origin) {
    if (origin.hasOwnProperty(k)) {
      target[k] = deepClone(origin[k], hashmap);
    }
  }
  return target;
}

/**
 * 不修改指向的情况下覆盖对象
 * @param target 需要被覆盖的对象
 * @param source 遍历着获取值的对象
 * @return target 返回taget 选用
 */
export function coverObj(target = {}, source = {}) {
  // 先清空目标对象
  for (const prop in target) {
    delete target[prop];
  }
  // 再逐个属性赋值
  for (const prop in source) {
    target[prop] = source[prop];
  }
  return target;
}

/**
 * 获取对象值，有默认值
 * 避免空指针异常
 */
export function getValue(obj: any, keysStr: string, defaultValue: any) {
  try {
    const keys = keysStr.split('.');
    keys.forEach(function (key) {
      const arr = key.match(/\[[^\]]+\]/g);
      if (arr) {
        key = key.substring(0, key.indexOf(arr[0]));
        key && (obj = obj[key]);
        arr.forEach(function (value: any) {
          key = value.substring(1, value.length - 1);
          obj = obj[key];
        });
      } else {
        obj = obj[key];
      }
    });
    return obj === undefined ? defaultValue : obj;
  } catch (e) {
    return defaultValue;
  }
}

/**
 * 根据参数获取对象多层的值
 * @param {object} target
 * @param {string} keys
 * @returns value
 */
export function getTargetValueByKeys(target: any, keys: string) {
  const keyArr = keys.split('.');
  if (keyArr.length === 0 || !target) {
    return undefined;
  } else if (keyArr.length === 1) {
    return target[keys];
  } else {
    return keyArr.reduce((previousValue: any, currentValue: string) => {
      if (previousValue) {
        return previousValue[currentValue];
      }
    }, target);
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = (val: unknown): val is Function => typeof val === 'function';
export const isObject = (val: unknown): val is Record<any, any> => val !== null && typeof val === 'object';

export const isPromise = <T = any>(val: unknown): val is Promise<T> => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
};

/**
 * @description 去除表单属性(值为string类型)中的空格和换行
 * @param form objcet
 * @param keys [] 可选 对应的key（指定key时就只格式化某一项，不指定就是全部）
 * @returns form[key]
 */
export const removeFormSpace = <T extends Record<string, any>, K extends keyof T>(form: T, keys?: K[]) => {
  const formDataKeys = keys && keys.length > 0 ? keys : Object.keys(form);
  // 去除表单指定属性的换行和空格
  formDataKeys.forEach(key => {
    if (typeof form[key] === 'string') {
      // 只有字符串才能replace
      form[key] = form[key].replace(/\ +/g, '').replace(/[\r\n]/g, '');
    }
  });
};

/**
 * @description 复制内容到剪贴板
 * @param content 需要复制的内容
 */
export const copyToClipboard = (content: string) => {
  const input = document.createElement('input');
  document.body.appendChild(input);
  input.setAttribute('value', content);
  input.select();
  if (document.execCommand('copy')) {
    document.execCommand('copy');
    message.success('复制成功');
    document.body.removeChild(input);
  }
};

/**
 * 为树形随机生成唯一标识uid
 * @returns
 */
export const createGuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

//扁平化数据
export const toLineData = <T = any>(data: T[], { childrenKey = 'children' } = {} as any) => {
  const stack: T[] = [...data];
  const nodes: T[] = [];
  while (stack.length > 0) {
    const item: any = stack.shift();
    const children: any = item[childrenKey];
    nodes.push(item);
    if (children && Array.isArray(children)) {
      for (let i = children.length - 1; i >= 0; i--) {
        stack.unshift(children[i]);
      }
    }
  }
  return nodes;
};
