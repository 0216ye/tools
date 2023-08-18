<template>
  <a-modal
    v-model:visible="modal.visible"
    :footer="false"
    title="选择地址"
    :width="1000"
    @cancel="onClose"
    @ok="onOk"
  >
    <a-row v-if="modal.visible">
      <a-col :span="12">
        <Map
          :ak="ak"
          class="map-wrap"
          :on-ready="onMapReady"
        />
      </a-col>
      <a-col
        :offset="1"
        :span="11"
      >
        <a-input
          allow-clear
          placeholder="输入详细地址进行搜索，例：北京市朝阳区朝阳公园"
          size="large"
          @change="
            e => {
              search(e.target.value);
            }
          "
        />
        <a-list
          class="list-wrap"
          :data-source="geocRsList"
          item-layout="horizontal"
          :style="{ cursor: 'pointer' }"
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <template #actions>
                <EnvironmentOutlined
                  :style="{ fontSize: '16px', color: item.isCurrent ? 'var(--ant-primary-color)' : '' }"
                />
              </template>
              <a-list-item-meta
                class="item"
                :description="item.address"
                @click="onClickItem(item)"
              >
                <template #title>
                  <a href="javascript: void(0);">{{ item.title }}</a>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
      </a-col>
    </a-row>
  </a-modal>
</template>
<script>
import Map from '../map/map.vue';
import targetIcon from './images/target.svg';
import currentLocation from './images/current.svg';
import { EnvironmentOutlined } from '@ant-design/icons-vue';
export default {
  components: {
    Map,
    EnvironmentOutlined,
  },
  props: {
    options: {
      type: Object,
      default() {
        return {
          lat: '',
          lng: '',
          address: '',
        };
      },
    },
    visible: {
      type: Boolean,
      default: false,
    },
    ak: {
      type: String,
      default: 'IgtRnMhBZldIzckr89ciyfH9V6VG5VFl',
    },
  },
  emits: ['on-visible-change', 'on-select'],
  data() {
    return {
      mapReady: false,
      geocRsList: [],
      modal: {
        visible: false,
      },
    };
  },
  watch: {
    visible: {
      handler(val) {
        this.modal.visible = val;
      },
      immediate: true,
    },
  },
  methods: {
    onOk() {
      // 后面改成点击确定的方式
    },
    onClose() {
      this.modal.visible = false;
      this.$emit('on-visible-change', false);
    },
    onClickItem(item) {
      const {
        title,
        address,
        isCurrent,
        point: { lat, lng },
      } = item;
      this.getLocationFromPoint(new window.BMap.Point(lng, lat), rs => {
        this.$emit('on-select', {
          lat,
          lng,
          title,
          address: `${address} ${isCurrent ? '' : title}`,
          point: rs,
        });
        this.onClose();
      });
    },
    mapInit() {
      const { lat, lng, address } = this.options;
      if (lat && lng && address) {
        const point = new window.BMap.Point(lng, lat);
        this.map.centerAndZoom(point, 17);
        this.addMarker(point);
        this.renderSelectList({
          address,
          point: {
            lng,
            lat,
          },
          surroundingPois: [],
        });
      } else if (address) {
        this.search(address, true);
      } else {
        new window.BMap.LocalCity().get(result => {
          this.map.setCenter(result.name);
        });
      }
    },
    // 地图初始化完成后添加比例尺和时间
    onMapReady(id, map) {
      this.mapId = id;
      this.map = map;
      // 防止加载出现冲突
      setTimeout(() => {
        this.mapInit();
        map.addControl(
          new window.BMap.NavigationControl({
            anchor: window.BMAP_ANCHOR_BOTTOM_RIGHT,
            type: window.BMAP_NAVIGATION_CONTROL_SMALL,
          }),
        );
        map.addEventListener('movestart', this.mapMoveStart);
        map.addEventListener('moveend', this.mapMoveEnd);
        this.initCenterControl();
        this.mapReady = true;
      }, 500);
    },
    // 清除点 添加控件
    mapMoveStart() {
      this.map.clearOverlays();
      this.map.addControl(this.centerControl);
    },
    mapMoveEnd() {
      const point = this.map.getCenter();
      this.addMarker(point);
      this.map.removeControl(this.centerControl);
      this.getLocationFromPoint(point, rs => {
        this.renderSelectList(rs);
      });
    },
    // 根据坐标点解析出来的地址热点、地址信息
    getLocationFromPoint(pt, callback) {
      // 根据坐标点解析出来的地址热点、地址信息
      const geoc = new window.BMap.Geocoder();
      geoc.getLocation(pt, rs => {
        if (typeof callback === 'function') {
          callback(rs);
        }
      });
    },
    // 自定义控件
    initCenterControl() {
      const { map } = this;
      const wrap = getComputedStyle(document.getElementById(this.mapId));
      const left = Number.parseInt(wrap.width, 10) / 2 - 8;
      const top = Number.parseInt(wrap.height, 10) / 2 - 8;
      // 自定义控件需要继承Control类
      class CenterControl extends window.BMap.Control {
        constructor() {
          super();
          this.defaultAnchor = window.BMAP_ANCHOR_TOP_LEFT;
          this.defaultOffset = new window.BMap.Size(left, top);
        }
        initialize() {
          const img = document.createElement('img');
          // 设置样式
          img.src = targetIcon;
          // 添加DOM元素到地图中
          map.getContainer().appendChild(img);
          // 将DOM元素返回
          return img;
        }
      }

      this.centerControl = new CenterControl();
    },
    // 添加marker
    addMarker(point) {
      const { map } = this;
      const markerCurrentLocation = new window.BMap.Marker(point, {
        icon: new window.BMap.Icon(currentLocation, new window.BMap.Size(48, 48)),
        offset: new window.BMap.Size(0, -24),
      });
      const markerTarget = new window.BMap.Marker(point, {
        icon: new window.BMap.Icon(targetIcon, new window.BMap.Size(16, 16)),
        offset: new window.BMap.Size(0, 0),
      });
      map.clearOverlays();
      map.addOverlay(markerCurrentLocation);
      map.addOverlay(markerTarget);
      // 跳动的动画
      markerCurrentLocation.setAnimation(window.BMAP_ANIMATION_BOUNCE);
    },
    // 拿出地图lbs数据
    renderSelectList(geocRs) {
      // 如果有当前位置
      this.geocRsList = [];
      if (geocRs.address) {
        this.geocRsList.push({
          address: geocRs.address,
          point: geocRs.point,
          title: '地图当前标注位置',
          isCurrent: true,
        });
      }
      geocRs.surroundingPois.forEach(item => {
        this.geocRsList.push({
          address: item.address,
          point: item.point, // lng, lat
          title: item.title,
        });
      });
    },
    // 检索数据
    search(addressText, isResetMarket = false) {
      const local = new window.BMap.LocalSearch(this.map, {
        onSearchComplete: res => {
          if (local.getStatus() === window.BMAP_STATUS_SUCCESS) {
            const surroundingPois = [];
            for (let i = 0; i < res.getCurrentNumPois(); i += 1) {
              surroundingPois.push(res.getPoi(i));
            }
            this.renderSelectList({
              surroundingPois,
            });
            if (isResetMarket && surroundingPois.length > 0) {
              const { lng, lat } = surroundingPois[0].point;
              const point = new window.BMap.Point(lng, lat);
              this.map.setCenter(point);
              this.map.setZoom(17);
              this.addMarker(point);
            }
          }
        },
      });
      local.search(addressText);
    },
  },
};
</script>
<style lang="less" scoped>
@height: 550px;
@listTop: 16px;
@searchHeight: 40px;
.map-wrap {
  width: 100%;
  height: 550px;
}
.list-wrap {
  height: @height - @searchHeight - @listTop;
  margin-top: @listTop;
  overflow-y: auto;
}
.item {
  cursor: pointer;
}
</style>
