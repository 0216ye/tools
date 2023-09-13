import './index.less';

import { GET, POST } from '@/services/api';
import { message } from 'ant-design-vue';
import { defineComponent, ref } from 'vue';
import { remarkProps } from './props';
import { RemarkItem } from './typing';

export default defineComponent({
  name: 'crm-remark',
  props: remarkProps,
  emits: ['add-success'],
  setup(props, { emit, slots }) {
    // 添加弹窗
    const addRemarkVisible = ref(false);
    const addLoading = ref(false);
    const addText = ref('');
    const textareaRef = ref<any>(null);
    async function addRemarkHandle() {
      if (!addText.value) return;
      addLoading.value = true;
      try {
        await POST(props.pushLink, {
          ...props.extraParams,
          [props.idKey]: props.item ? props.item.union_id : props.id,
          remark: addText.value,
        });
        addRemarkVisible.value = false;
        message.success('添加成功！');
        emit('add-success', { text: addText.value });
        addText.value = '';
      } finally {
        addLoading.value = false;
      }
    }
    const renderAddModal = () => {
      return (
        <a-modal
          vModel={[addRemarkVisible.value, 'visible']}
          confirmLoading={addLoading.value}
          title={props.title}
          onCancel={() => (addRemarkVisible.value = false)}
          onOk={addRemarkHandle}
        >
          <a-textarea ref={textareaRef} autofocus vModel={[addText.value, 'value']} placeholder="请输入" />
        </a-modal>
      );
    };

    // 记录展示弹窗
    const remarkListVisible = ref(false);
    const remarkListLoading = ref(false);
    const remarkList = ref<RemarkItem[]>([]);
    async function getRemarkList() {
      remarkListVisible.value = true;
      if (props.staticLogs) {
        remarkList.value = props.staticLogs;
        return;
      }
      remarkListLoading.value = true;
      try {
        const res = await GET(props.logLink, { [props.idKey]: props.item ? props.item.union_id : props.id });
        if (props.formatLogs) {
          remarkList.value = props.formatLogs(res.data);
        } else {
          remarkList.value = res.data;
        }
      } finally {
        remarkListLoading.value = false;
      }
    }
    const renderListModal = () => {
      return (
        <a-modal vModel={[remarkListVisible.value, 'visible']} footer={null} title="标记记录" width={720}>
          <a-spin spinning={remarkListLoading.value}>
            <div class="remark-list" style="max-height: 620px">
              {...remarkList.value.map(item => (
                <div class="remark-item" key={item.id}>
                  <div class="remark-text">{item.remark}</div>
                  <div class="created-by">
                    <span class="created-name">{item.remark_by}</span>
                    <span class="created-time">{item.created_at}</span>
                  </div>
                </div>
              ))}
            </div>
            {remarkList.value.length === 0 && <a-empty></a-empty>}
          </a-spin>
        </a-modal>
      );
    };

    // size: default
    const renderDefaultSize = () => {
      return (
        <>
          {props.item ? (
            <div class={`mark-record ${props.layout}`}>
              <div
                class={`last-remark ${props.layout === 'vertical' ? 'wrap-tow-line' : ''}`}
                onClick={() => (addRemarkVisible.value = true)}
              >
                {props.item.last_remark}
              </div>
              {props.layout === 'horizontal' && (
                <div class="horizontal-remark-num" onClick={getRemarkList}>
                  • {props.item.remark_num}次记录
                </div>
              )}
              <div class="time-by">
                <span>by{props.item.remark_by}</span>
                <span>{props.item.created_at}</span>
              </div>
              {props.layout === 'vertical' && (
                <div class="vertical-remark-num" onClick={getRemarkList}>
                  • {props.item.remark_num}次记录
                </div>
              )}
            </div>
          ) : (
            <a-button type="link" onClick={() => (addRemarkVisible.value = true)}>
              备注
            </a-button>
          )}
        </>
      );
    };

    // size: small
    const renderSmallSize = () => {
      return (
        <>
          <span class="my-link" onClick={() => (addRemarkVisible.value = true)}>
            备注
          </span>
          {props.item && (
            <span class="small-text" onClick={getRemarkList}>
              {props.item.remark_num}次记录 {props.item.created_at}
            </span>
          )}
        </>
      );
    };

    // size: block
    const renderBlockSize = () => {
      return (
        <div class={`block-remark ${props.blockFlex ? 'flex-wrap' : ''} flex-y-start`}>
          <div
            class="left-content flex-con"
            onClick={() => {
              addRemarkVisible.value = true;
              // 组件渲染需要时间，需要将该操作加入异步队列
              setTimeout(() => textareaRef.value?.focus(), 200);
            }}
          >
            {props.item ? (
              <>
                <span class="block-remark-text">
                  {props.prefixText}
                  {props.item.last_remark}
                </span>
                <span class="block-time-by">——{props.item.remark_by}</span>
                <span class="block-time-by">{props.item.created_at}</span>
              </>
            ) : (
              <span class="block-remark-text">
                {slots.emptyText ? slots.emptyText() : props.prefixText + '暂无备注'}
              </span>
            )}
          </div>
          <div class="right-count" onClick={getRemarkList}>
            {props.item ? props.item.remark_num : 0}次记录
          </div>
        </div>
      );
    };

    return () => (
      <>
        <div class="remark-content remark-component">
          {props.size === 'default' && renderDefaultSize()}
          {props.size === 'small' && renderSmallSize()}
          {props.size === 'block' && renderBlockSize()}
        </div>
        {renderAddModal()}
        {renderListModal()}
      </>
    );
  },
});
