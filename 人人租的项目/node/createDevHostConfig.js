/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const { resolve } = require('path');

const path = resolve('./devHostConfig.ts');
const FILE_VERSION = '2.0';

if (!fs.existsSync(path)) {
  write();
} else {
  console.log('devHostConfig.ts exists. \r\n');
  read();
}

function write() {
  const versionText = `/** ${FILE_VERSION} 版本 */ \r\n`;
  const devHostHelper = `
/**
 * 无特殊说明都是https://
 *
 * php项目域名
 * dev\${number}.rrzuji.com 开发服
 * admin\${number}.rrzuji.net 测试服
 * admin.rrzu.com 正式服
 *
 * mobile项目域名
 * dev\${number}-m.rrzuji.com 开发服
 * m\${number}.rrzuji.net 测试服
 * rank.rrzu.com/golang 正式服
 *
 * 优惠券golang项目域名
 * dev2-go-web.rrzuji.com 开发服
 * go-1.rrzuji.net 测试服
 * go-micro.rrzu.com 正式服
 */
  `;
  const devHostText = `
import { EnvType } from '@/utils/url';

// php项目
export const defaultTarget = '10';
export const defaultEnv: EnvType = 'dev';

// mobile项目
export const mobileTarget = '12';
export const mobileEnv: EnvType = 'dev';

// golang项目
export const golangTarget = '1';
export const golangEnv: EnvType = 'dev';
  `;

  fs.writeFileSync(path, `${versionText}${devHostHelper}${devHostText}`);
  console.log('devHostConfig.ts created. \r\n');
}

function read() {
  const data = fs.readFileSync(path, 'utf8');
  if (data.match(/([1-9]\d*\.?\d*)|(0\.\d*[1-9])/)[0] !== FILE_VERSION) {
    console.log('devHostConfig.ts version check unpass. \r\n');
    write();
  } else {
    console.log('devHostConfig.ts version check pass. \r\n');
  }
}
