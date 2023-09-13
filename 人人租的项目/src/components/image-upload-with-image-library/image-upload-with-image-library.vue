<template>
  <div style="line-height: initial">
    <drag
      direction="horizontal"
      :items="items"
      padding="0"
      :prop-list-item-wrap-style="{ marginRight: '8px', marginBottom: '8px' }"
      @on-sort="update"
    >
      <template #item="{ item, index }">
        <div class="drag-image-wrap">
          <image-item
            fit="cover"
            :height="height"
            :img="item.src"
            :padding="padding"
            :preview="showPreview"
            :width="width"
          />
        </div>
        <slot
          :index="index"
          :item="item"
          name="action"
        />
        <div
          v-if="showDelete"
          class="delete-btn"
          @click="removeImage(index)"
        >
          <CloseCircleFilled />
        </div>
      </template>
      <template
        v-if="items.length < max"
        #after
      >
        <div class="add-btn-wrap">
          <div
            class="add-btn"
            :style="{ width: `${width}px`, height: `${height}px` }"
            @click="openImageLibrary"
          >
            <PlusOutlined />
            <div class="text">
              上传图片
            </div>
          </div>
        </div>
      </template>
    </drag>
    <ImageLibrary
      v-model:visible="imageLibraryModal.visible"
      :img-size="imgSize"
      :max="canSelectMax"
      :role="role"
      :sort="sort"
      @cancel="onCancel"
      @confirm="addImage"
    />
  </div>
</template>
<script>
import { PlusOutlined, CloseCircleFilled } from '@ant-design/icons-vue';
import ImageLibrary from '../image-library/image-library.vue';

export default {
  components: {
    PlusOutlined,
    ImageLibrary,
    CloseCircleFilled,
  },
  props: {
    // 传入 [{ src }, { src } , { src }, ...]
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    max: {
      type: [Number, String],
      default: 5,
    },
    width: {
      type: [Number, String],
      default: 100,
    },
    height: {
      type: [Number, String],
      default: 100,
    },
    padding: {
      type: [Number, String],
      default: 8,
    },
    showDelete: {
      type: Boolean,
      default: true,
    },
    showPreview: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: '',
    },
    sort: {
      type: Boolean,
      default: false,
    },
    // 图片尺寸规格，默认m。
    imgSize: {
      type: String,
      default: 'm',
    },
  },
  emits: ['update:value', 'edit', 'change', 'sort-change', 'cancel'],
  data() {
    return {
      items: [],
      imageLibraryModal: {
        visible: false,
      },
    };
  },
  computed: {
    canSelectMax() {
      return this.max - this.items.length;
    },
  },
  watch: {
    value: {
      // 直接引用了内存地址
      handler(value) {
        if (!Array.isArray(value) || this.items === value) {
          return;
        }
        this.id = `list_${Math.random().toString(16).slice(-6)}${new Date().getTime()}`;
        this.items = value;
      },
      immediate: true,
    },
  },
  methods: {
    update() {
      this.$emit('update:value', this.items);
      this.$emit('sort-change', this.items);
    },
    openImageLibrary() {
      this.imageLibraryModal.visible = true;
    },
    addImage(imgs) {
      for (const img of imgs) {
        if (this.items.length < this.max) {
          this.items.push({
            src: img.url,
            dragId: `${this.items.length}${this.getUid()}`,
          });
        } else {
          break;
        }
      }
      this.$emit('change', this.items);
    },
    removeImage(index) {
      this.items.splice(index, 1);
      this.$emit('change', this.items);
    },
    getUid() {
      return `list_${Math.random().toString(16).slice(-6)}${new Date().getTime()}`;
    },
    onCancel() {
      this.$emit('cancel')
    }
  },
};
</script>
<style scoped lang="less">
.drag-image-wrap {
  position: relative;
  overflow: hidden;
  border: 1px solid rgb(217, 217, 217);
  border-radius: 2px;
}
.add-btn-wrap {
  display: inline-block;
  vertical-align: top;
  border: 1px dashed rgb(217, 217, 217);
  border-radius: 2px;
  &:hover {
    border-color: rgb(0, 200, 190);
  }
  .add-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8px;
    background-color: rgb(250, 250, 250);
    cursor: pointer;
    transition: border-color 0.3s ease 0s;
    .text {
      margin-top: 8px;
      color: rgb(102, 102, 102);
      line-height: initial;
    }
  }
}
.delete-btn {
  position: absolute;
  top: 2px;
  right: 4px;
  display: inline-block;
  color: rgb(191, 191, 191);
  font-size: 18px;
  cursor: pointer;
}
</style>
