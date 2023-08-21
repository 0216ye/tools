/**
 * 更新应用
 */
import { post } from '@/utils/request';
import { replacePage } from '@/navigate';
import config from '@/config';
// #ifdef MP-ALIPAY || MP-TOUTIAO || MP-WEIXIN || MP-BAIDU
const updateManager = uni.getUpdateManager();

updateManager.onUpdateReady(function () {
  uni.showModal({
    title: '更新提示',
    content: '新版本已经准备好，是否重启应用？',
    success(res: any) {
      if (res.confirm) {
        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
        updateManager.applyUpdate();
      }
    },
  });
});
// #endif

export function updateApp() {
  post({
    url: 'AppVersion/info/getPushInfo',

    data: {
      app_types: 0,
      type: uni.getSystemInfoSync().platform === 'ios' ? '0' : '1',
    },
  }).then(ret => {
    if (!ret.data) {
      return;
    }
    // 推送版本号
    const push_version_arr = ret.data.push_version.split('.');
    // 需要强制更新的版本号
    const important_version_arr = ret.data.important_version.split('.');
    // 当前APP版本号
    const location_version_arr = config.appVersion.split('.');

    console.warn(location_version_arr, 'location_version_arr');
    console.warn(push_version_arr, 'push_version_arr');
    for (let i = 0; i < location_version_arr.length; i++) {
      // 需要更新
      if (Number(location_version_arr[i]) < Number(push_version_arr[i])) {
        // is_important:是否强制更新
        let is_important = false;
        for (let j = 0; j < location_version_arr.length; j++) {
          // 需要强制更新
          if (Number(location_version_arr[j]) < Number(important_version_arr[j]) && ret.data.important) {
            is_important = true;
            break;
          } else if (Number(location_version_arr[j]) > Number(important_version_arr[j])) {
            break;
          }
        }
        // 判断是否为wgt热更新安装包，如果是则无感知更新；如果否则为整包更新。
        if (isWgtPackage(ret.data.url)) {
          quiteUpdate(ret.data.url);
        } else {
          replacePage('/pages/update-page/update-page', {
            is_important,
            data: ret.data,
          });
        }
        break;
      } else if (Number(location_version_arr[i]) > Number(push_version_arr[i])) {
        break;
      }
    }
  });
}

export function isWgtPackage(url: string): boolean {
  const urlSub = url.split('.');
  return urlSub[urlSub.length - 1] === 'wgt';
}

export function quiteUpdate(url: string) {
  uni.showLoading({
    title: '程序准备中',
  });
  uni.downloadFile({
    //执行下载
    url, //下载地址
    success: downloadResult => {
      //下载成功
      if (downloadResult.statusCode === 200) {
        // iOS热更新有审核风险，不能出现热更新提示
        const platform = uni.getSystemInfoSync().platform;
        if (platform === 'ios') {
          installApp(downloadResult.tempFilePath);
        } else {
          uni.showModal({
            title: '有新版本',
            content: '新版本已准备好，即将重启',
            showCancel: false,
            success: res => {
              if (res.confirm) {
                installApp(downloadResult.tempFilePath);
              }
            },
          });
        }
      } else {
        uni.hideLoading();
      }
    },
    fail() {
      uni.hideLoading();
    },
  });
}

export function installApp(wgtFile: string) {
  plus.runtime.install(
    //安装
    wgtFile,
    { force: true },
    function () {
      uni.hideLoading();
      plus.runtime.restart();
    },
    function () {
      uni.hideLoading();
    },
  );
}
