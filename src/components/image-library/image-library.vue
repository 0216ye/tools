<template>
  <a-modal
    v-model:visible="modalVisible"
    :body-style="{ padding: '0' }"
    :mask-closable="false"
    title="选择图片"
    top="50"
    :width="1000"
    @cancel="onCancel"
    @ok="onOk"
  >
    <div class="wrap">
      <div
        v-if="modalVisible"
        style="min-width: 950px; height: 600px"
      >
        <PictureLibrary
          ref="library"
          :img-size="imgSize"
          :max="max"
          :mode="mode"
          :role="role"
          :sort="sort"
        />
      </div>
    </div>
  </a-modal>
</template>
<script>
// import PictureLibrary from '../../pages/picture-library/index.vue';
import PictureLibrary from '@/pages-stage/operations/tools/picture-lib/index.vue';

export default {
  components: {
    PictureLibrary,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    // super user
    role: {
      type: String,
      default: '',
    },
    // upload表示用来上传图片
    mode: {
      type: String,
      default: 'upload',
    },
    max: {
      type: [Number, String],
      default: Infinity,
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
  emits: ['update:visible', 'confirm', 'cancel'],
  data() {
    return {
      modalVisible: false,
    };
  },
  watch: {
    visible: {
      handler(value) {
        this.modalVisible = value;
      },
      immediate: true,
    },
    modalVisible(value) {
      if (this.visible === value) {
        return;
      }
      this.$emit('update:visible', value);
    },
  },
  methods: {
    onOk() {
      this.$emit('confirm', this.$refs.library.getPhotos());
      this.modalVisible = false;
    },
    onCancel() {
      this.$emit('cancel')
    },
    open() {
      this.modalVisible = true;
    },
  },
};
</script>
<style scoped lang="less">
.wrap {
  width: 100%;
  overflow-x: auto;
}
</style>
