<template>
  <!-- 查看流水弹窗 -->
  <div class="refusal-modal-wrap">
    <a-button
      size="small"
      type="link"
      @click="open"
    >
      查看流水
    </a-button>
    <!-- 开票信息流水 -->
    <a-modal
      v-model:visible="visible"
      :footer="null"
      title="流水记录"
      @cancel="visible = false"
    >
      <a-table
        :columns="flowRecordCol"
        :data-source="list"
        :loading="listLoading"
        :pagination="page"
        @change="tableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'order_id'">
            <a
              href="javascript:;"
              @click="onGotoPage(record)"
            >{{ record.order_id }}</a>
          </template>
        </template>
      </a-table>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useTable } from '@/hook/component/use-table';
import { IRefundListItem } from '../data';
import { EServiceType, flowRecordCol } from '../config';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

// -----流水记录弹窗----
const visible = ref(false);
// -----流水数据
const searchId = reactive<{ id: string | null; sort: number }>({
  id: null,
  sort: EServiceType.offlinePublicInvoice,
});
const { list, listLoading, page, getTableList, tableChange } = useTable<
  IRefundListItem,
  { id: string | null; sort: number }
>({
  url: props.url,
  searchForm: searchId,
  formatHandle: res => res.data.list,
  totalKey: 'data.pageInfo.count',
});
const open = async function () {
  searchId.id = props.id;
  searchId.sort = EServiceType.offlinePublicInvoice;
  getTableList('search');
  visible.value = true;
};

const onGotoPage = function (row: IRefundListItem) {
  const { type, order_id } = row;
  window.parent.postMessage(
    {
      action: 'blank',
      href: type === 1 ? `/order/v2-index?order_id=${order_id}` : `/offline-transfer/index?order_id=${order_id}`,
    },
    '*',
  );
};
</script>

<style lang="less" scoped>
p {
  margin-bottom: 8px;
}
</style>
