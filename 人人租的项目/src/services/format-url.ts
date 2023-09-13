/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * 用来包装请求url
 * 开发环境 允许使用mockurl、调用接口传入的configurl、代理服务器（空） 的其中一个。优先级：接口传入 > vuex > mock > 使用代理服务器
 * 打包环境 只能使用config里配置的url。优先级：接口传入 > vuex > 配置
 * @params {Object} config axios的第三个对象，或者自己包装的对象1
 */
import { store } from '../store/store';
import { globalConfig, hostConfig } from '../config/global-config';
import { getProxyTarget } from '../utils/url';

type TSuffix = 'com' | 'net';

const env = import.meta.env.DEV;
const GO_DEV = import.meta.env.VITE_GO_DEV;
const { mock, baseUrl, mockUrl } = globalConfig;

export const formatUrl = (config: any = {}): string => {
  const storeBaseUrl = store.getters.baseUrl; // route.query.origin 部署环境注入的 origin 路由参数值
  const currentConfig = hostConfig[config.hostType] || {};
  if (env) {
    // 开发环境，使用代理proxy
    // /api: 运营后台super接口；/go-api: golang接口
    const envPath = currentConfig.envPath || '/api';
    const targetUrl = config.baseUrl || storeBaseUrl || (mock && mockUrl) || ''; // 对应开发环境优先级
    return `${targetUrl}${envPath}${config.url}`;
  } else {
    // 打包环境（部署环境），使用完整url
    // 打包环境又分三种：正式服、开发服(test, .com)、测试服(.net)
    let customHost = '';
    if (config.hostType) {
      customHost = currentConfig.host;
      const { serverNum, suffix, isDev } = getCurrentServerConfig();
      // 如果是开发环境
      if (serverNum) {
        const envType = suffix === 'com' ? (isDev ? 'dev' : 'test') : 'test';
        let target = serverNum;
        if (config.hostType == 'Golang') {
          target = GO_DEV || String((Number(serverNum) || 1) % 5 || 5);
        }
        customHost = getProxyTarget({ target, envType, hostType: config.hostType }) || '';
      }
    }

    const targetUrl = config.baseUrl || storeBaseUrl || baseUrl; // 对应打包环境baseUrl优先级
    return `${customHost || targetUrl}${config.url}`;
  }
};

export function getCurrentServerConfig(): { serverNum: string; suffix: TSuffix; isDev: boolean } {
  // 获取iframe父级窗口location
  const topHost = document.referrer; // 正式服：admin.rrzu.com  开发服：dev10-admin.rrzuji.com  测试服：admin1.rrzuji.net

  // 解析location.host
  const num = topHost.match(/\d+/g)?.[0] || topHost.split(/\.dev(.*?)\-/)?.[1];
  const informal = /dev\w+\-/.test(topHost) || /admin\w+\./.test(topHost) || /test\w+\-/.test(topHost);
  const suffix = topHost.split('.').pop()?.split('/')[0] as TSuffix;

  // 返回结果 { serverNum: string; suffix: 'com' | 'net' }
  return {
    serverNum: informal ? num || '1' : '',
    suffix,
    isDev: /dev\w+\-/.test(topHost),
  };
}
