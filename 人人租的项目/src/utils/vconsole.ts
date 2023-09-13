import config from '@/config';
import VConsole from 'vconsole';

/**
 * 创建 vconsole，低版本ios不支持
 * @param params.manual 是否手动创建vconsole
 */
export const createVConsole = ({ manual = false } = {}) => {
  uni.getSystemInfo({
    success: res => {
      if (res.uniPlatform === 'web') {
        if (res.osName === 'ios' && Number(String(res.osVersion).split('.')) < 14) {
          return;
        }

        // #ifdef H5-TEST
        new VConsole();
        // #endif

        // #ifdef H5
        if (config.env === 'development') {
          new VConsole();
        }

        if (manual) {
          new VConsole();
        }
        // #endif
      }
    },
  });
};

createVConsole();
