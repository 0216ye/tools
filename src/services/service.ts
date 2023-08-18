import axios from 'axios';
import * as qs from 'qs';
import { redirectLogin } from './login';
import { formatUrl } from './format-url';
import { hostConfig } from '@/config/global-config';
import { getCookie } from '@/utils/cookies';

const env = import.meta.env.DEV;
const defaultContentType = 'application/x-www-form-urlencoded; charset=UTF-8';
const service = axios.create({
  baseURL: '/', // api的base_url
  timeout: 50000, // 请求超时时间
  withCredentials: true, // 跨域携带cookie
  maxRedirects: 0, // 将不处理任何重定向
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  paramsSerializer: params => {
    return qs.stringify(params, { arrayFormat: 'brackets' }); // 序列化复杂参数，如params: { id: 1, page: 1, filter: { name: '' } }
  },
});

const getToken = function (): string {
  return window.localStorage.getItem('token') || '';
};

const setToken = function (value = ''): void {
  window.localStorage.setItem('token', value);
};

/**
 * request拦截器 axios
 * config是axios.post或者get第三个参数的config配置。
 * post和get第一，二个参数实际上是第三个的子集。
 * config可以包含所有axios可用参数，和本系统扩展参数例如：baseUrl
 */
service.interceptors.request.use(
  (config: any) => {
    config.url = formatUrl(config);
    // content-type 优先级：service指定 > global host config配置 > 默认值
    if (!config.headers['content-type']) {
      config.headers['content-type'] = hostConfig[config.hostType]?.contentType || defaultContentType;
    }
    // 默认post都是 application/x-www-form-urlencoded; charset=UTF-8，需要转换成string
    if (config.headers['content-type'] === defaultContentType) {
      config.data = qs.stringify(config.data);
    }
    // 前后端分离项目，接口需要token。线上旧接口不能加上token会报错。
    if (env) {
      config.headers.token = getToken();
    }
    if (config.hostType === 'Golang') {
      config.headers.Authorization = getCookie('Go-Token');
    }
    return config;
  },
  (error: any) => Promise.reject(error),
);

/**
 * respone拦截器 axios
 * 处理403，主要是后端的登录重定向，后端其实不一定是登录的重定向
 * 302重定向。同上，后端其实不一定是登录的重定向。
 */
service.interceptors.response.use(
  (response: any) => {
    const { request, config, data } = response;
    // 有些接口，成功status不一定是0
    let successStatusCheckValue: any = 0;
    if (config.successStatusCheckValue === 'none') {
      successStatusCheckValue = undefined;
    } else {
      successStatusCheckValue = config.successStatusCheckValue || 0;
    }

    if (request && request.responseURL && request.responseURL.includes('/site/login')) {
      redirectLogin();
      return Promise.reject(data);
    }
    // 检测请求成功的标志
    if (
      data.status !== successStatusCheckValue &&
      data.code !== successStatusCheckValue &&
      !request.responseURL.includes('geetest-str')
    ) {
      if (data.status === 7500) {
        redirectLogin();
      }
      if (data.code === 30001) {
        redirectLogin();
      }
      return Promise.reject(data);
    }
    // 新后台登录接口，存token
    if (config.url.indexOf('/site/api-login') > -1) {
      setToken(data.token);
    }
    return data;
  },
  (error: any) => {
    // test 超时
    if (error.message.indexOf('timeout of') !== -1) {
      return Promise.reject(error.message);
    }
    // 处理没有权限的403
    if (error && error.response && error.response.data.code === 403 && error.response.data.name === 'Forbidden') {
      return Promise.reject(error.response.data);
    }
    // 用户登录信息过期
    if (error && error.response && error.response.status === 401) {
      redirectLogin();
      return;
    }
    if (error && error.response && error.response.status === 403) {
      redirectLogin();
      return;
    }
    return Promise.reject(error);
  },
);

export default service;
