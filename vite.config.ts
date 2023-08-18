import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { createCustomPlugins } from './build/plugins';
import { defineConfig } from 'vite';
import { resolve } from 'path';
import * as devHost from './devHostConfig';
import { getProxyTarget } from './src/utils/url';

const env = process.env.NODE_ENV === 'development';

function pathResolve(dir: string) {
  return resolve(__dirname, '.', dir);
}
export default defineConfig({
  resolve: {
    alias: {
      '@/': `${pathResolve('src')}/`,
    },
  },
  server: {
    proxy: {
      '/api': {
        target: getProxyTarget({ target: devHost.defaultTarget, envType: devHost.defaultEnv, hostType: 'PHP' }),
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
        cookieDomainRewrite: { '*': '' },
        protocolRewrite: 'https',
      },
      '/mobile': {
        target: getProxyTarget({ target: devHost.mobileTarget, envType: devHost.mobileEnv, hostType: 'Mobile' }),
        changeOrigin: true,
        rewrite: path => path.replace(/^\/mobile/, ''),
        cookieDomainRewrite: { '*': '' },
        protocolRewrite: 'https',
      },
      '/go-api': {
        target: getProxyTarget({ target: devHost.golangTarget, envType: devHost.golangEnv, hostType: 'Golang' }),
        changeOrigin: true,
        rewrite: path => path.replace(/^\/go-api/, ''),
        cookieDomainRewrite: { '*': '' },
        protocolRewrite: 'https',
      },
    },
    host: '0.0.0.0',
  },
  optimizeDeps: {
    include: [
      'ant-design-vue/es/locale/zh_CN',
      'moment/dist/locale/zh-cn',
      'moment/src/moment',
      'dom-to-image/src/dom-to-image',
      '@antv/x6-plugin-keyboard > mousetrap',
    ],
    exclude: ['@antv/x6', '@antv/x6-plugin-keyboard', '@antv/x6-plugin-selection'],
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          'border-radius-base': '4px',
          'body-background': 'rgb(247, 247, 247)',
          'text-color': 'rgba(6, 21, 51, 0.65)',
          'heading-color': 'rgba(6, 21, 51, 0.85)',
          'border-color-base': 'rgba(6,21,51,0.15)',
        },
        javascriptEnabled: true,
      },
    },
  },
  build: {
    // 启用/禁用 gzip 压缩大小报告。压缩大型输出文件可能会很慢，因此禁用该功能可能会提高大型项目的构建性能。
    reportCompressedSize: false,
    sourcemap: env,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['ant-design-vue'],
        },
      },
    },
  },
  plugins: [vue(), vueJsx(), ...createCustomPlugins()],
});
