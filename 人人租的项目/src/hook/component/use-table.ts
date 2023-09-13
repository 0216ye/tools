import { reactive, Ref, ref } from 'vue';
import { PaginationProps } from 'ant-design-vue';
import { GET, POST, RequestConfig } from '@/services/api';
import { AxiosResponse } from 'axios';
import { getTargetValueByKeys, isPromise } from '@/utils/base';

export interface IUseTableOptions<T, K = any> {
  url?: string;
  api?: (searchForm: K) => Promise<AxiosResponse<any>>;
  method?: 'GET' | 'POST';
  pagination?: PaginationProps;
  searchForm?: K;
  pageKey?: string;
  pageSizeKey?: string;
  totalKey?: string;
  requestConfig?: RequestConfig;
  formatHandle?: (res: AxiosResponse<any>) => T[] | Promise<T[]>;
  setSortField?: (sorter: unknown) => void;
  formatSearchValue?: (searchForm?: K) => K;
}

export interface ITableResult<T> {
  list: Ref<T[]>;
  listLoading: Ref<boolean>;
  page: PaginationProps;
  getTableList: (type?: string) => void;
  tableChange: (pagination: PaginationProps, _?: any, sorter?: unknown) => void;
  resetPagination: () => void;
}
/**
 * table通用封装
 * @param options url 和 api 必须满足一条
 * @returns
 * ``` js
    const { list, listLoading, page, getTableList, tableChange } = useTable({...});
 * ```
 */
export function useTable<T, K>(options: IUseTableOptions<T, K>): ITableResult<T> {
  const request = { GET, POST };
  const list: Ref<T[]> = ref([]);

  const listLoading = ref(false);

  const { total, current, pageSize = 10, showQuickJumper = true, showSizeChanger = true, pageSizeOptions, showTotal } =
    options.pagination || {};
  const page = reactive<PaginationProps>({
    total: total || 0,
    current: current || 1,
    pageSize: pageSize || 10,
    showQuickJumper,
    showSizeChanger,
    pageSizeOptions: pageSizeOptions || ['10', '15', '20', '30'],
    showTotal,
  });
  async function getTableList(type?: string) {
    if (type === 'search') {
      resetPagination();
    }
    listLoading.value = true;
    try {
      const params: any = {
        ...(options.formatSearchValue ? options.formatSearchValue(options.searchForm) : options.searchForm),
        [options.pageKey || 'page']: page.current,
        [options.pageSizeKey || 'page_size']: page.pageSize,
      };

      let res = null;
      if (options?.api) {
        res = await options.api(params);
      } else if (options.url) {
        res = await request[options.method || 'GET']<K, T[]>(options.url, params, options.requestConfig);
      } else {
        return console.error('SyntaxError：You must set the configuration of API or URL！');
      }
      if (typeof options.formatHandle === 'function') {
        const tempList = options.formatHandle(res);
        isPromise(tempList) ? (list.value = await tempList) : (list.value = tempList);
      } else {
        list.value = res.data;
      }
      const total = getTargetValueByKeys(res, options.totalKey || 'data.page_data.count');
      page.total = Number(total || 0);
    } finally {
      listLoading.value = false;
    }
    // 如果当前页码非第一页，且当前页已无数据重新请求
    if (list.value.length == 0 && Number(page.current) > 1) {
      getTableList('search');
    }
  }

  function tableChange(pagination: PaginationProps, _: any, sorter: unknown) {
    page.current = pagination.current || 1;
    page.pageSize = pagination.pageSize || pageSize;
    if (typeof options.setSortField === 'function') {
      options.setSortField(sorter);
    }
    getTableList();
  }

  function resetPagination() {
    page.current = 1;
    page.pageSize = pageSize;
  }

  return {
    list,
    listLoading,
    page,
    getTableList,
    tableChange,
    resetPagination,
  };
}
