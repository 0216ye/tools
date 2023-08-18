<template>
  <div class="filter-wrap">
    <a-popover
      v-model:visible="filter.visible"
      :placement="placement"
      trigger="click"
    >
      <template #content>
        <div class="content-wrap">
          <form-extend
            ref="form"
            :form-group="filter.form"
            :label-col="{ span: 24 }"
            layout="vertical"
            :wrapper-col="{ span: 24 }"
          />
          <div class="footer border-top">
            <a-button
              class="btn"
              @click="reset"
            >
              重置
            </a-button>
            <a-button
              class="btn"
              @click="filter.visible = false"
            >
              取消
            </a-button>
            <a-button
              class="btn"
              type="primary"
              @click="submit"
            >
              确定
            </a-button>
          </div>
        </div>
      </template>
      <slot name="action">
        <a-button
          :class="[!filter.visible && !active ? 'unactive' : '', 'filter-btn']"
          type="link"
        >
          <FilterOutlined />筛选
        </a-button>
      </slot>
    </a-popover>
  </div>
</template>
<script>
/**
 * 存入[{ key, type }]对象数组进行筛选，参数同form-extend，返回对象，例如 { key1: 'res1', key2: 'res2', }
 *
 * type的值
 * string：搜索框
 * radio: 单选
 * checkbox: 多选
 * select: 选择器
 */
import { FilterOutlined } from '@ant-design/icons-vue';

export default {
  components: {
    FilterOutlined,
  },
  props: {
    placement: {
      type: String,
      default: 'bottomLeft',
    },
    // 表单的键和表单值构成的键值对 对象
    filterValue: {
      type: Object,
      default() {
        return {};
      },
    },
    // 表单配置。同form-extend组件的配置。
    filterConfig: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  emits: ['on-filter', 'on-reset'],
  data() {
    return {
      filter: {
        visible: false,
        form: [],
      },
    };
  },
  computed: {
    active() {
      let active = false;
      Object.keys(this.filterValue).forEach(key => {
        if (this.filterValue[key] || (Array.isArray(this.filterValue[key]) && this.filterValue[key].length)) {
          active = true;
        }
      });
      return active;
    },
  },
  watch: {
    'filter.visible'(value) {
      // 根据传入的值和表单配置构造表单
      if (value) {
        this.createForm(this.filterConfig, this.filterValue);
      }
    },
  },
  methods: {
    submit() {
      this.$refs.form.submit().then(form => {
        this.filter.visible = false;
        this.$emit('on-filter', form);
      });
    },
    reset() {
      this.filter.visible = false;
      this.$emit('on-filter', {});
      this.$emit('on-reset');
      this.createForm(this.filterConfig);
    },
    createForm(config, formValue = {}) {
      this.filter.form = [];
      if (!Array.isArray(config)) {
        return;
      }
      this.filter.form = config.map(item => {
        switch (item.type) {
          case 'string':
          case 'radio':
            return {
              ...item,
              value: formValue[item.key] || '',
            };
          case 'checkbox':
            return {
              ...item,
              value: formValue[item.key] || [],
            };
          case 'select':
            return {
              ...item,
              mode: 'multiple',
              value: formValue[item.key] || undefined,
            };
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.filter-wrap {
  display: inline-block;
  .unactive {
    color: rgba(0, 0, 0, 0.65);
  }
  .filter-btn {
    background: #fff;
    border-radius: 2px;
  }
}
.content-wrap {
  width: 360px;
  padding: 18px 8px 0 8px;
  .footer {
    padding: 12px 0;
    text-align: right;
    .btn {
      margin-left: 8px;
    }
  }
}
.filter-action-default {
  cursor: pointer;
  .anticon {
    margin-right: 8px;
  }
}
</style>
