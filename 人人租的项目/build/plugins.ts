import legacy from '@vitejs/plugin-legacy';
import moment from 'moment';
import { visualizer } from 'rollup-plugin-visualizer';
import { Plugin } from 'vite';

const buildEnv = process.env.BUILD_ENV;
const isReport = process.env.REPORT;

export function createLegacyPlugin(): Plugin {
  return legacy({ targets: ['defaults', 'not IE 11'] });
}

export function createReportPlugin(): Plugin {
  return visualizer();
}

export function getBuildTimeVite(): Plugin {
  let startTime: number;
  let endTime: number;
  return {
    name: 'get-build-time',
    buildStart() {
      startTime = Date.now();
      console.log('Build Start: ', moment(startTime).format('YYYY-MM-DD HH:mm:ss'));
    },
    closeBundle() {
      endTime = Date.now();
      console.log('Build End: ', moment(endTime).format('YYYY-MM-DD HH:mm:ss'));
      console.log('Build Time: ', ((endTime - startTime) / 1000).toFixed(2) + 's');
    },
  };
}

export function createCustomPlugins(): Plugin[] {
  const plugins: Plugin[] = [];

  // 浏览器兼容性插件
  if (buildEnv !== 'test') {
    // plugins.push(createLegacyPlugin());
  }

  // 打包体积分析插件
  if (isReport) {
    plugins.push(createReportPlugin());
  }

  plugins.push(getBuildTimeVite());

  return plugins;
}
