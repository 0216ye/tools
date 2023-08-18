<template>
  <div class="remark-content">
    <template v-if="size === 'default'">
      <div
        v-if="item"
        :class="['mark-record', layout]"
      >
        <div
          :class="['last-remark', layout === 'vertical' ? 'wrap-tow-line' : '']"
          @click="addRemarkVisible = true"
        >
          {{ item.last_remark }}
        </div>
        <div
          v-if="layout === 'horizontal'"
          class="horizontal-remark-num"
          @click="getRemarkList"
        >
          • {{ item.remark_num }}次记录
        </div>
        <div class="time-by">
          <span>by{{ item.remark_by }}</span>
          <span>{{ item.created_at }}</span>
        </div>
        <div
          v-if="layout === 'vertical'"
          class="vertical-remark-num"
          @click="getRemarkList"
        >
          • {{ item.remark_num }}次记录
        </div>
      </div>
      <a-button
        v-else
        type="link"
        @click="addRemarkVisible = true"
      >
        备注
      </a-button>
    </template>

    <template v-else-if="size === 'small'">
      <span
        class="my-link"
        @click="addRemarkVisible = true"
      > 备注 </span>
      <span
        v-if="item"
        class="small-text"
        @click="getRemarkList"
      >
        {{ item.remark_num }}次记录 {{ item.created_at }}
      </span>
    </template>

    <template v-else-if="size === 'block'">
      <div class="block-remark flex-wrap flex-y-start">
        <div
          class="left-content flex-con"
          @click="addRemarkVisible = true"
        >
          <template v-if="item">
            <span class="block-remark-text">{{ prefixText }}{{ item.last_remark }}</span>
            <span class="block-time-by">——{{ item.remark_by }}</span>
            <span class="block-time-by">{{ item.created_at }}</span>
          </template>
          <template v-else>
            <span class="block-remark-text">{{ prefixText }}暂无备注</span>
          </template>
        </div>
        <div
          class="right-count"
          @click="getRemarkList"
        >
          {{ item ? item.remark_num : 0 }}次记录
        </div>
      </div>
    </template>

    <!-- 添加弹窗 -->
    <a-modal
      v-model:visible="addRemarkVisible"
      :confirm-liading="addLoading"
      title="添加备注"
      @cancel="addRemarkVisible = false"
      @ok="addRemarkHandle"
    >
      <a-textarea
        v-model:value="addText"
        placeholder="请输入"
      />
    </a-modal>
    <!-- 记录弹窗 -->
    <a-modal
      v-model:visible="remarkListVisible"
      :footer="null"
      title="标记记录"
    >
      <a-spin :spinning="remarkListLoading">
        <div class="remark-list">
          <div
            v-for="(remark, index) in remarkList"
            :key="index"
            class="remark-item"
          >
            <div class="remark-text">
              {{ remark.remark }}
            </div>
            <div class="created-by">
              <span class="created-name">{{ remark.remark_by }}</span>
              <span class="created-time">{{ remark.created_at }}</span>
            </div>
          </div>
        </div>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import { GET, POST } from '../../services/api';

export default {
  name: 'remark',
  props: {
    // 布局：水平 horizontal、垂直 vertical 默认垂直
    layout: {
      type: String,
      default: 'vertical',
    },
    // 大小：默认default 简约small
    size: {
      type: String,
      default: 'default',
    },
    item: {
      type: Object,
      default() {
        return null;
      },
    },
    id: {
      type: String,
      default: '',
    },
    pushLink: {
      type: String,
      default: '/crm/push',
    },
    logLink: {
      type: String,
      default: '/crm/log',
    },
    idKey: {
      type: String,
      default: 'unionId',
    },
    prefixText: {
      type: String,
      default: '',
    },
  },
  emits: ['add-success'],
  data() {
    return {
      addRemarkVisible: false,
      addLoading: false,
      addText: '',

      remarkListVisible: false,
      remarkListLoading: false,
      remarkList: [],
    };
  },
  methods: {
    addRemarkHandle() {
      if (!this.addText) return;
      this.addLoading = true;
      POST(this.pushLink, {
        [this.idKey]: this.item ? this.item.union_id : this.id,
        remark: this.addText,
      })
        .then(() => {
          this.addText = '';
          this.addRemarkVisible = false;
          this.$message.success('添加成功！');
          this.$emit('add-success');
        })
        .finally(() => {
          this.addLoading = false;
        });
    },
    getRemarkList() {
      this.remarkListLoading = true;
      this.remarkListVisible = true;
      GET(this.logLink, {
        [this.idKey]: this.item ? this.item.union_id : this.id,
      })
        .then(res => {
          this.remarkList = res.data;
        })
        .finally(() => {
          this.remarkListLoading = false;
        });
    },
  },
};
</script>

<style scoped lang="less">
.wrap-tow-line {
  display: -webkit-box;
  overflow: hidden;
  white-space: normal !important;
  text-overflow: ellipsis;
  word-wrap: break-word;
  word-break: break-all;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.mark-record {
  &.vertical {
    width: 200px;
    .last-remark {
      width: 200px;
      color: rgba(0, 0, 0, 0.65);
      line-height: 22px;
      text-decoration: underline;
      cursor: pointer;
    }
    .time-by {
      margin-bottom: 8px;
      color: rgba(0, 0, 0, 0.25);
      font-size: 12px;
      line-height: 20px;
      span:nth-child(1) {
        margin-right: 8px;
      }
    }
    .vertical-remark-num {
      color: #00c1b6;
      text-decoration: underline;
      cursor: pointer;
    }
  }
  &.horizontal {
    display: flex;
    .last-remark {
      max-width: 200px;
      overflow: hidden;
      color: #ff4a57;
      white-space: nowrap;
      text-decoration: underline;
      text-overflow: ellipsis;
      cursor: pointer;
    }
    .horizontal-remark-num {
      margin: 0 24px;
      color: #00c1b6;
      cursor: pointer;
    }
    .time-by {
      color: rgba(0, 0, 0, 0.45);
      font-size: 12px;
      line-height: 20px;
      span:nth-child(1) {
        margin-right: 8px;
      }
    }
  }
}
.remark-list {
  max-height: 400px;
  overflow-y: auto;
}
.remark-item {
  margin-bottom: 16px;
  padding: 0 0 16px 0;
  border-bottom: 1px solid #e9e9e9;
  .remark-text {
    margin-bottom: 8px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
  }
  .created-name {
    margin-right: 32px;
    color: rgba(0, 0, 0, 0.45);
    line-height: 22px;
  }
  .created-time {
    color: rgba(0, 0, 0, 0.25);
    line-height: 22px;
  }
}
.small-text {
  margin-left: 8px;
  color: rgba(0, 0, 0, 0.65);
  text-decoration: underline;
  cursor: pointer;
}
.block-remark {
  flex-wrap: wrap;
  .left-content {
    width: 100%;
    padding-right: 80px;
    cursor: pointer;
    .block-remark-text {
      color: rgba(0, 0, 0, 0.85);
      white-space: pre-wrap;
      text-decoration: underline;
      word-break: break-all;
    }
    .block-time-by {
      color: rgba(0, 0, 0, 0.45);
    }
  }
  .right-count {
    color: rgba(0, 0, 0, 0.45);
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
