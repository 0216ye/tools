export default {
  // 需要加载进行裁剪的图片base64url 或者 网络url 或者 本地选择url
  url: null,
  // 默认contain设置图片时的边框大小
  padding: 20,
  // 裁剪区域是否需要固定比例
  clipRectFixedRadio: false,
  // 裁剪区域宽高比例 宽
  clipRectWidthRadio: 1,
  // 裁剪区域宽高比例 高
  clipRectHeightRadio: 1,
  // 裁剪区域辅助线，一共12份，x轴方向
  clipRectXGuidesRadio: [4, 4, 4],
  // 裁剪区域辅助线，一共12份，y轴方向
  clipRectYGuidesRadio: [4, 4, 4],
  // 不使用裁剪遮罩，默认裁剪整个画布范围
  disabledClipRect: false,
  // 指定裁剪模块挂载的html节点
  getContainer: () => null,
  // 图片画布的背景颜色，同时是图片移出画布显示范围后显示的底色
  imageCanvasBackground: 'rgba(255, 255, 255, 1)',
  // 裁剪模块边框上的操作区域提示器填充颜色
  clipPointFillColor: 'rgba(0, 200, 190, .8)',
  // 裁剪模块内的辅助分割线颜色
  clipLineStrokeColor: 'rgba(0, 0, 0, .5)',
  // 裁剪模块区域的边框颜色
  clipRectBorderColor: 'rgba(0, 200, 190, .8)',
  // 裁剪画布的遮罩颜色
  clipCanvasBackground: 'rgba(0, 0, 0, .6)',
  // 为true则会设置为 anonymous，将允许图片跨域加载。但是浏览器如果使用了同样的图片，也要用同样加载方式。
  // ie10+ 如果属性值不是use-credentials，都会解析为anonymous，表示跨域资源请求不需要提供凭证
  imgCrossOrigin: false,
};
