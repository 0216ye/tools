/* eslint-disable @typescript-eslint/ban-types */
import { WritableComputedRef, computed } from 'vue';

type TEmit<E> = (event: E, ...args: any[]) => void;
/**
 * 避免因为引用关系导致子组件修改时影响了父组件的值，破坏正常数据流
 * @param props 组件props,
 * @param propName 需要支持v-model的propKey
 * @param emit 组件emit
 * @returns {Proxy}
 */
function handleObject<P extends object, K extends keyof P, E extends string>(props: P, propName: K, emit: TEmit<E>) {
  return new Proxy<any>(props[propName], {
    // 保持正常数据流，子组件通过emit修改父组件的值
    set(target, key, value) {
      emit(`update:${propName.toString()}` as E, {
        ...target,
        [key]: value,
      });
      return true;
    },
  });
}
/**
 * 让props支持v-model.
 * 父组件传递的值如果是对象,该对象请用ref声明,reactive会导致无法监听到变化
 * @param props 组件props,
 * @param propName 需要支持v-model的propKey
 * @param emit 组件emit
 * @returns {WritableComputedRef<T>} 返回一个可读可写的代理对象
 *
 */

export function useVModel<P extends object, K extends keyof P, E extends string>(
  props: P,
  propName: K,
  emit: TEmit<E>,
): WritableComputedRef<P[K]> {
  return computed({
    get() {
      return Object.prototype.toString.call(props[propName]) === '[object Object]'
        ? handleObject(props, propName, emit)
        : props[propName];
    },
    set(val) {
      emit(`update:${propName.toString()}` as E, val);
    },
  });
}
