/**
 * 使用方式：
 *
 * <template>
 *      <pagination ref="myPaginationRef" :create-page-data="createPageData" />
 * </template>
 * <script>
    //分页组件Ref
    const myPaginationRef = ref();
    //获取首屏数据
    async function createPageData(isDeleted?: boolean) {
      isShowLoading.value = true;
      try{
        const  {data: { pageInfo, list }} = await getListApi({
          ...searchForm.value,
          ...myPaginationRef.value.handlePageBehind(isDeleted),
         })
        myPaginationRef.value.handlePageFront(pageInfo);
        dataSource.value = list;
      }finally{
        isShowLoading.value = false;
      }
    }


    function search() {
      myPaginationRef.value.setCurrent(1);
      createPageData();
    }
    </script>

 */
import { ref } from 'vue';
export default function usePagination(createPageData: any) {
  //后端返回的分页
  interface IPageInfo {
    page: number;
    count: number;
    pageSize: number;
  }
  const pagination = ref({
    current: 1,
    total: 0,
    pageSize: 10,
  });
  /**
   * 后端返回的分页信息修改为前端需要的
   * @param pageInfo
   * @returns
   */
  function handlePageFront(pageInfo: IPageInfo) {
    pagination.value = { current: pageInfo.page, total: pageInfo.count, pageSize: pageInfo.pageSize };
  }

  /**
   * 修改请求分页字段给后端
   * @param pageInfo
   * @returns
   */
  function handlePageBehind(isDelete?: boolean) {
    let page = pagination.value.current;
    if (isDelete && pagination.value.total % pagination.value.pageSize == 1) {
      page = page - 1 <= 0 ? 1 : page - 1;
    }
    return { page, pageSize: pagination.value.pageSize };
  }

  /**
   * 设置页码
   * @param current 页码
   */
  function setCurrent(current: number) {
    pagination.value.current = current;
  }

  /**
   * 页码变化
   * @param page 改变后的页码
   */
  const pageChange = (page: number) => {
    pagination.value.current = page;
    createPageData();
  };

  /**
   * 每页条数变化
   * @param current 改变后的页码
   * @param pageSize 每页条数
   */
  const pageSizeChange = (current: number, pageSize: number) => {
    pagination.value.current = 1;
    pagination.value.pageSize = pageSize;
    createPageData();
  };
  return {
    pagination,
    handlePageFront,
    handlePageBehind,
    setCurrent,
    pageChange,
    pageSizeChange,
  };
}
