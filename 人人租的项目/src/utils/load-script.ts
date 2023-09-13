const sdk = {
  WEIXINJSSDK: 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js',
  ALIPAYJSSDK: 'https://gw.alipayobjects.com/as/g/h5-lib/alipayjsapi/3.1.1/alipayjsapi.min.js',
  SFJSSDK: 'https://ccsp-egmas-static.sf-express.com/h5apps/st/0.1.55/syttunnel.js',
};

/**
 * 加载script文件，必须需要显式声明传入的script类型，避免重复加载不同版本的相同js模块
 * 使用示例，加载微信sdk await loadScript('weixinJSSDK', () => !!window.jWeixin);
 * @param src
 * @param checkFunc
 */
export const loadScript = async (srcType: 'WEIXINJSSDK' | 'ALIPAYJSSDK' | 'SFJSSDK', checkFunc: () => boolean) => {
  const src = sdk[srcType];
  if (!src) {
    console.error('请传入正确的srcType');
    return;
  }

  return new Promise((resolve, reject) => {
    if (checkFunc()) {
      resolve('success');
    } else {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = src;
      const head = document.querySelector('head');
      if (head) {
        head.appendChild(script);
      }
      script.onload = () => {
        if (checkFunc()) {
          resolve('success');
        } else {
          reject('fail');
          console.error(`加载${src}失败,请检查您的配置地址URL填写是否正确!`);
        }
      };
    }
  });
};
