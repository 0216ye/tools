<template>
  <div
    ref="wrap"
    class="wrap"
  />
</template>
<script>
/* eslint-disable no-console */
import LoadEvent from '@/utils/event';

export default {
  props: {
    // 百度地图ak
    ak: {
      type: String,
      default: 'IgtRnMhBZldIzckr89ciyfH9V6VG5VFl',
    },
    mapId: {
      type: String,
      default: '',
    },
    onReady: {
      type: Function,
      default() {
        return () => ({});
      },
    },
  },
  emits: ['before-init'],
  mounted() {
    this.checkDependencies().then(() => {
      this.initMap();
    });
  },
  beforeUnmount() {
    if (this.map && this.map.destroy) {
      this.map.destroy();
    }
  },
  methods: {
    initMap() {
      const id = this.mapId || `map_${Math.random().toString(16).slice(-6)}`;
      this.$refs.wrap.id = id;
      this.id = id;
      this.$emit('before-init', this.id);
      this.map = new window.BMap.Map(id);
      this.map.centerAndZoom(new window.BMap.Point(116.331398, 39.897445), 12);
      this.onReady(this.id, this.map);
    },
    checkDependencies() {
      return new Promise(resolve => {
        const scriptsLoaded = !!window.BMap;
        if (scriptsLoaded) {
          resolve();
        } else if (window.$loadMapEnv) {
          // 利用订阅发布，确保同时渲染多个组件时，不会重复创建script标签
          window.$loadMapEnv.on('scriptsLoaded', () => {
            resolve();
          });
        } else {
          window.$loadMapEnv = new LoadEvent();
          this.loadScript().then(() => {
            resolve();
            window.$loadMapEnv.emit('scriptsLoaded');
          });
        }
      });
    },
    loadScript() {
      return new Promise(resolve => {
        if (window.BMap) {
          resolve();
        } else {
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = `https://api.map.baidu.com/getscript?v=4.0&ak=${this.ak}`;
          document.querySelector('head').appendChild(script);
          // 很重要，使百度地图支持https!
          window.HOST_TYPE = '2';
          script.onload = () => {
            if (window.BMap) {
              resolve();
            } else {
              console.error('加载地图失败');
            }
          };
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.wrap {
  width: 100%;
  height: 100%;
}
</style>
