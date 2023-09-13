<template>
  <a-modal
    v-model:visible="modalVisible"
    :confirm-loading="loading"
    :mask-closable="false"
    ok-text="确定"
    title="裁剪图片"
    top="50"
    :width="1000"
    @ok="onOk"
  >
    <Clip
      v-if="modalVisible"
      ref="clip"
      :url="url"
      @clip-wrap-change="onWrapChange"
    />
    <div style="text-align: center">
      裁剪区域大小 [{{ clipWidth }}px] X [{{ clipHeight }}px]
      <a @click="onPreview">查看预览</a>
    </div>
  </a-modal>
</template>
<script>
import Clip from '../clip/clip.vue';

export default {
  components: {
    Clip,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    // 图片源，url或这base64
    url: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:visible', 'confirm'],
  data() {
    return {
      modalVisible: false,
      clipWidth: 0,
      clipHeight: 0,
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
    async onOk() {
      this.$emit('confirm', await this.$refs.clip.getClipToFile(), {
        width: this.clipWidth,
        height: this.clipHeight,
      });
    },
    onWrapChange(res) {
      this.clipWidth = res.clipWidth;
      this.clipHeight = res.clipHeight;
    },
    onPreview() {
      this.$refs.clip.handleClipImage().then(base64 => {
        this.$preview.open({
          imgs: [base64],
        });
      });
    },
  },
};
</script>
<style scoped lang="less">
::v-deep(.ant-modal-body) {
  overflow-x: auto;
}
</style>
