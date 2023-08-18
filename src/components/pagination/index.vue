<!--  -->
<template>
  <!-- 分页条 -->
  <a-pagination
    v-if="pagination.total"
    class="pagination"
    :current="pagination.current"
    :page-size="pagination.pageSize"
    show-quick-jumper
    show-size-changer
    :total="pagination.total"
    @change="pageChange"
    @show-size-change="pageSizeChange"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import usePagination from './use-pagination';
export default defineComponent({
  props: {
    createPageData: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const { pagination, handlePageFront, handlePageBehind, setCurrent, pageChange, pageSizeChange } = usePagination(
      props.createPageData,
    );
    return { pagination, handlePageFront, handlePageBehind, setCurrent, pageChange, pageSizeChange };
  },
});
</script>
<style scoped lang="less">
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
}
</style>
