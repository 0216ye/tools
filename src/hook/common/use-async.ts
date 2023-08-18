import { ref } from 'vue';
/*
 *  功能: 针对异步请求，统一处理error和loading状态
 * */
export default function useAsync<D = any>(throwOnError = false) {
  // 数据
  const dataList = ref<D>(null);
  // 加载状态
  const isLoading = ref(false);
  // 错误信息
  const error = ref<Error | null>(null);

  // 成功调用
  const setState = (data: D) => {
    dataList.value = data;
    error.value = null;
  };
  // 失败调用
  const setError = (err: Error) => {
    dataList.value = null;
    error.value = err;
  };

  const run = (promise: Promise<D>, runConfig?: { callback?: (res: any) => any }) => {
    if (!promise || !promise.then) {
      throw new Error('请传递promise类型数据!');
    }
    isLoading.value = true;
    return promise
      .then(({ data }: any) => {
        // 如果callback不为空，则执行callback 完成对数据的修改,为空则直接返回原始数据
        data = (runConfig?.callback && runConfig.callback(data)) || data;
        setState(data);
        return data;
      })
      .catch(error => {
        // catch会消化异常,如果不主动抛出,外面是接收不到的
        setError(error);
        // 如果使用者希望将错误抛到外层
        if (throwOnError) {
          return Promise.reject(error);
        }
        return error;
      })
      .finally(() => (isLoading.value = false));
  };
  return {
    dataList,
    isLoading,
    error,
    run,
  };
}
