<template>
  <div class="app">
    <ConfigProvider :locale="zhCN">
      <router-view v-slot="{ Component }">
        <a-skeleton :loading="pageLoading">
          <keep-alive :include="include">
            <component :is="Component" />
          </keep-alive>
        </a-skeleton>
      </router-view>
    </ConfigProvider>
  </div>
</template>

<script lang="ts">
import { ConfigProvider } from 'ant-design-vue';
import { defineComponent, watch, ref } from 'vue';
import { useRoute } from 'vue-router';
// import { useStore } from 'vuex';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'moment/dist/locale/zh-cn';
import useTheme from '@/hook/feature/use-theme';
import { ThemeColor } from '@/typing/typing';
import { GET } from './services/api';
dayjs.locale('zh-cn');

export default defineComponent({
  components: {
    ConfigProvider,
  },
  setup() {
    const route = useRoute();
    // const store = useStore();

    const include: string[] = [
      'rule-list',
      'scenes-list',
      'scenes-setting',
      'system-setting',
      'order-datio',
      'commodity-list',
      'promotion-activity',
      'manage-resource',
      'system-management',
      'manage-promotion',
      'order-datio',
      'await-risk-setting',
      'force-skip-scenes',
      'force-hit-risk',
      'anti-fraud-rule',
      'jurisdiction-management-preview',
      'risk-report',
      'data-migration',
      'sell-after-sales',
      'market-application-item',
      // 'mayi-claims-list',
      'mayi-server',
      'user-ticket-v2-custom-query',
      'user-ticket-v2-mine-action',
      'user-ticket-v2-ticket-all-status',
      'user-ticket-v2-ticket-group-status',
      'user-ticket-v2-sla',
      // riskAccessRuleSystemRuleConfig
      'risk-access-rule-system-rule-config',
    ];

    // 处理全平台主题颜色
    const { setTheme } = useTheme();
    setTheme(ThemeColor.GREEN); // 默认绿色主题色
    // watch是为了确保baseUrl已经保存在vuex中，确保getThemeConfig能正常请求
    // watch role是一种快捷的做法，watch store baseUrl更合理，但是这边watch store baseUrl 不方便本地环境
    // 保留TODO
    watch(
      () => route.query.role,
      // () => store.getters.baseUrl,
      val => {
        if (val !== undefined) {
          getThemeConfig();
        }
      },
    );
    const pageLoading = ref(false); // 设置一个loading防止页面设置主题色闪烁
    async function getThemeConfig() {
      if (!route.query.role) {
        pageLoading.value = true;
        try {
          const res = await GET<unknown, { type: 'new' | 'used' }>(
            '/user-stay-duration-log/get-annotation',
            {},
            { closeErrorMessage: true },
          );
          if (res.data.type === 'new') {
            setTheme(ThemeColor.BLUE);
          }
        } finally {
          pageLoading.value = false;
        }
      }
    }

    return {
      include,
      zhCN,
      pageLoading,
    };
  },
});
</script>

<style scoped>
.app {
  height: 100%;
  /* 加一个border解决layout布局的margin-top会把app下移的问题 */
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
}
</style>
