import { router } from '../router/router';
import { message } from 'ant-design-vue';
import { POST } from './api';

/**
 * 处理登录重定向
 */
export const redirectLogin = (): void => {
  const currentRoute = router.currentRoute.value;
  if (currentRoute.name !== 'Login') {
    POST('/site/logout');
    router.push(`/login?path=${encodeURIComponent(currentRoute.fullPath)}`);
    message.destroy();
    message.info('身份验证失败，请先登录');
  }
};
